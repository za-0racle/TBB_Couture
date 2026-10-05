// Supabase's public API key identifies the project. Authorization is enforced by RLS.
const projectUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')
const publicKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
export const configured = Boolean(projectUrl && publicKey)
const sessionKey = `tbb-admin:${projectUrl}`
let session = null
try {
  session = JSON.parse(sessionStorage.getItem(sessionKey) || 'null')
} catch {
  session = null
}
let refreshing = null

function remember(value) {
  session = value
  try {
    if (value) sessionStorage.setItem(sessionKey, JSON.stringify(value))
    else sessionStorage.removeItem(sessionKey)
  } catch {
    // Memory-only sessions still work if the browser blocks session storage.
  }
}

async function request(
  path,
  { method = 'GET', body, token, headers = {}, timeout = 30000 } = {},
) {
  if (!configured) throw new Error('Connect Supabase before using the admin workspace.')
  const response = await fetch(`${projectUrl}${path}`, {
    method,
    headers: {
      apikey: publicKey,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body && !(body instanceof Blob) ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body instanceof Blob ? body : body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(timeout),
  })
  const raw = await response.text()
  let data
  try {
    data = raw ? JSON.parse(raw) : null
  } catch {
    data = null
  }
  if (!response.ok) {
    if (response.status === 401)
      throw new Error('Your session has expired. Sign out and sign in again.')
    if (response.status === 403)
      throw new Error('Your account does not have permission for this action.')
    throw new Error(
      data?.msg ||
        data?.message ||
        data?.error_description ||
        data?.error ||
        `Request failed (${response.status}). Please retry.`,
    )
  }
  return data
}

async function accessToken() {
  if (!session?.access_token) throw new Error('Please sign in to continue.')
  if (session.expires_at * 1000 > Date.now() + 60000) return session.access_token
  if (!refreshing) {
    refreshing = request('/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      body: { refresh_token: session.refresh_token },
    })
      .then((value) => {
        remember({
          ...value,
          expires_at: Math.floor(Date.now() / 1000) + value.expires_in,
        })
        return value.access_token
      })
      .catch((error) => {
        remember(null)
        throw error
      })
      .finally(() => {
        refreshing = null
      })
  }
  return refreshing
}

export async function signIn(email, password) {
  const value = await request('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: { email, password },
  })
  remember({ ...value, expires_at: Math.floor(Date.now() / 1000) + value.expires_in })
  try {
    return await requireAdmin()
  } catch (error) {
    remember(null)
    throw error
  }
}

export async function requireAdmin() {
  const token = await accessToken()
  const user = await request('/auth/v1/user', { token })
  const admins = await request(
    `/rest/v1/admin_users?user_id=eq.${encodeURIComponent(user.id)}&select=user_id`,
    { token },
  )
  if (!admins?.length)
    throw new Error(
      'This account is not an administrator. Ask the project owner to grant access.',
    )
  return user
}

export function hasSession() {
  return Boolean(session?.access_token)
}

export async function signOut() {
  try {
    if (session?.access_token)
      await request('/auth/v1/logout?scope=local', {
        method: 'POST',
        token: session.access_token,
      })
  } finally {
    remember(null)
  }
}

export function imageUrl(path) {
  if (!path) return ''
  return `${projectUrl}/storage/v1/object/public/couture-media/${path.split('/').map(encodeURIComponent).join('/')}`
}

export async function publicItems() {
  return await request(
    '/rest/v1/content_items?status=eq.published&select=*&order=created_at.desc',
  )
}

export async function adminItems() {
  return await request('/rest/v1/content_items?select=*&order=updated_at.desc', {
    token: await accessToken(),
  })
}

export async function saveItem(item, id) {
  const rows = await request(
    `/rest/v1/content_items${id ? `?id=eq.${encodeURIComponent(id)}` : ''}`,
    {
      method: id ? 'PATCH' : 'POST',
      body: item,
      token: await accessToken(),
      headers: { Prefer: 'return=representation' },
    },
  )
  if (!rows?.length)
    throw new Error('The item was not saved. Refresh the workspace and try again.')
  return rows[0]
}

export async function deleteItem(id) {
  const rows = await request(`/rest/v1/content_items?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    token: await accessToken(),
    headers: { Prefer: 'return=representation' },
  })
  if (!rows?.length)
    throw new Error('The item could not be deleted. Refresh and try again.')
}

export async function uploadImage(file, userId, extension) {
  const path = `${userId}/${crypto.randomUUID()}.${extension}`
  await request(`/storage/v1/object/couture-media/${path}`, {
    method: 'POST',
    body: file,
    token: await accessToken(),
    timeout: 120000,
    headers: { 'Content-Type': file.type, 'x-upsert': 'false', 'Cache-Control': '3600' },
  })
  return path
}

export async function removeImage(path) {
  if (path)
    await request('/storage/v1/object/couture-media', {
      method: 'DELETE',
      body: { prefixes: [path] },
      token: await accessToken(),
    })
}
