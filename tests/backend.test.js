import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'

const originalFetch = globalThis.fetch
let sequence = 0
async function client(responses, savedSession = null) {
  const calls = []
  const values = new Map(
    savedSession
      ? [['tbb-admin:https://example.supabase.co', JSON.stringify(savedSession)]]
      : [],
  )
  globalThis.sessionStorage = {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  }
  globalThis.fetch = async (url, options) => {
    calls.push({ url, ...options })
    const next = responses.shift()
    assert.ok(next, `Unexpected request: ${url}`)
    if (next.error) throw next.error
    return new Response(JSON.stringify(next.data), { status: next.status || 200 })
  }
  let source = await fs.readFile(new URL('../src/backend.js', import.meta.url), 'utf8')
  source = source.replaceAll(
    'import.meta.env',
    '({ VITE_SUPABASE_URL: "https://example.supabase.co", VITE_SUPABASE_PUBLISHABLE_KEY: "public-test-key" })',
  )
  const api = await import(
    `data:text/javascript;base64,${Buffer.from(source).toString('base64')}#${sequence++}`
  )
  return { api, calls, values }
}

test('backend API contracts', async (t) => {
  t.after(() => {
    globalThis.fetch = originalFetch
    delete globalThis.sessionStorage
  })
  await t.test(
    'public reads explicitly request published records without an admin token',
    async () => {
      const { api, calls } = await client([{ data: [] }])
      assert.deepEqual(await api.publicItems(), [])
      assert.match(calls[0].url, /status=eq.published/)
      assert.equal(calls[0].headers.Authorization, undefined)
    },
  )
  await t.test(
    'valid credentials are insufficient without admin membership',
    async () => {
      const { api } = await client([
        { data: { access_token: 'token', refresh_token: 'refresh', expires_in: 3600 } },
        { data: { id: 'user-id' } },
        { data: [] },
      ])
      await assert.rejects(
        api.signIn('test@example.com', 'password'),
        /not an administrator/,
      )
      assert.equal(api.hasSession(), false)
    },
  )
  await t.test(
    'admin login checks server membership and sends auth token for writes',
    async () => {
      const { api, calls } = await client([
        { data: { access_token: 'token', refresh_token: 'refresh', expires_in: 3600 } },
        { data: { id: 'user-id' } },
        { data: [{ user_id: 'user-id' }] },
        { data: [{ id: 'item-id', status: 'draft' }] },
      ])
      await api.signIn('test@example.com', 'password')
      await api.saveItem({ status: 'draft' })
      assert.equal(calls[3].headers.Authorization, 'Bearer token')
      assert.equal(calls[3].headers.Prefer, 'return=representation')
    },
  )
  await t.test(
    'expired access tokens refresh before fetching admin content',
    async () => {
      const { api, calls } = await client(
        [
          {
            data: {
              access_token: 'new-token',
              refresh_token: 'new-refresh',
              expires_in: 3600,
            },
          },
          { data: [] },
        ],
        { access_token: 'old', refresh_token: 'refresh', expires_at: 1 },
      )
      await api.adminItems()
      assert.match(calls[0].url, /grant_type=refresh_token/)
      assert.equal(calls[1].headers.Authorization, 'Bearer new-token')
    },
  )
  await t.test('empty write responses never report success', async () => {
    const { api } = await client([{ data: [] }], {
      access_token: 'token',
      expires_at: Date.now() / 1000 + 3600,
    })
    await assert.rejects(api.saveItem({}, 'missing'), /not saved/)
  })
  await t.test('sign out clears the local session even if revocation fails', async () => {
    const { api } = await client([{ error: new Error('offline') }], {
      access_token: 'token',
      expires_at: Date.now() / 1000 + 3600,
    })
    await assert.rejects(api.signOut(), /offline/)
    assert.equal(api.hasSession(), false)
  })
})
