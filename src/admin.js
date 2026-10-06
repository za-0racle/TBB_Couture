import './admin.css'
import * as backend from './backend.js'
import { escapeHtml as esc, html, money, validateImage, validateItem } from './utils.js'

const app = document.querySelector('#app')
let user = null
let items = []
let currentView = 'dashboard'
let query = ''
let statusFilter = 'all'
let busy = false
let previewUrl = ''
let editor = null

const brand = html`
  <a class="admin-brand" href="/">
    <img src="/TBB_LOGO.jpg" alt="TBB Couture" />
    <span>
      TBB Couture
      <small>THE ADMIN WORKSPACE</small>
    </span>
  </a>
`

function notify(message, error = false) {
  const region = document.querySelector('#admin-message')
  if (!region) return
  region.textContent = message
  region.classList.toggle('is-error', error)
  region.hidden = !message
}

function renderLogin(message = '') {
  app.innerHTML = html`
    <main class="admin-login">
      <div class="login-story">
        ${brand}
        <p class="eyebrow">BEHIND THE CRAFT</p>
        <h1>
          A beautiful brand.
          <br />
          <em>Thoughtfully managed.</em>
        </h1>
        <p>Your collection, your creations, your workspace.</p>
        <a href="/">Return to the storefront</a>
      </div>
      <section class="login-panel">
        <p class="eyebrow">TBB COUTURE ADMIN</p>
        <h2>${backend.configured ? 'Welcome back.' : 'Connect your workspace.'}</h2>
        ${
          backend.configured
            ? html`
                <p>
                  Sign in with your administrator account to manage your work and
                  collection.
                </p>
                <form id="login-form">
                  <label>
                    Email address
                    <input
                      name="email"
                      type="email"
                      autocomplete="username"
                      required
                      placeholder="you@example.com"
                    />
                  </label>
                  <label>
                    Password
                    <span class="admin-password-field">
                      <input
                        name="password"
                        type="password"
                        autocomplete="current-password"
                        required
                      />
                      <button
                        class="admin-password-toggle"
                        type="button"
                        aria-label="Show password"
                        aria-pressed="false"
                        title="Show password"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.7"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                          <circle cx="12" cy="12" r="3" />
                          <path class="password-eye-slash" d="m4 4 16 16" hidden />
                        </svg>
                      </button>
                    </span>
                  </label>
                  <p id="login-message" class="form-error" role="alert">
                    ${esc(message)}
                  </p>
                  <button class="button dark" type="submit">Sign in to workspace</button>
                </form>
                <p class="admin-hint">
                  Access is by invitation. Contact the project owner if you need an
                  account or a password reset.
                </p>
              `
            : html`
                <p>
                  The workspace needs a Supabase connection before admins can sign in or
                  upload content.
                </p>
                <ol class="setup-steps">
                  <li>
                    Run
                    <code>supabase/schema.sql</code>
                    in your Supabase SQL Editor.
                  </li>
                  <li>
                    Create an Auth user and add its ID to
                    <code>admin_users</code>
                    .
                  </li>
                  <li>
                    Set
                    <code>VITE_SUPABASE_URL</code>
                    and
                    <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>
                    in Vercel, then redeploy.
                  </li>
                </ol>
                <p>
                  See
                  <code>ADMIN_SETUP.md</code>
                  in the project for the full setup guide.
                </p>
                <a class="button outline" href="/">View storefront</a>
              `
        }
      </section>
    </main>
  `
  const password = document.querySelector('#login-form [name="password"]')
  const passwordToggle = document.querySelector('.admin-password-toggle')
  passwordToggle?.addEventListener('click', () => {
    const visible = password.type === 'password'
    password.type = visible ? 'text' : 'password'
    passwordToggle.setAttribute('aria-pressed', String(visible))
    passwordToggle.setAttribute('aria-label', visible ? 'Hide password' : 'Show password')
    passwordToggle.title = visible ? 'Hide password' : 'Show password'
    passwordToggle
      .querySelector('.password-eye-slash')
      .toggleAttribute('hidden', !visible)
  })
  document.querySelector('#login-form')?.addEventListener('submit', async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const button = form.querySelector('button')
    const data = new FormData(form)
    button.disabled = true
    button.textContent = 'Signing in...'
    document.querySelector('#login-message').textContent = ''
    try {
      user = await backend.signIn(data.get('email').trim(), data.get('password'))
      await openWorkspace()
    } catch (error) {
      document.querySelector('#login-message').textContent = error.message
      button.disabled = false
      button.textContent = 'Sign in to workspace'
    }
  })
}

async function openWorkspace() {
  items = await backend.adminItems()
  app.innerHTML = html`
    <div class="admin-shell">
      <aside class="admin-sidebar">
        ${brand}
        <p class="sidebar-label">YOUR WORKSPACE</p>
        <nav class="admin-navigation" aria-label="Admin navigation">
          <button data-view="dashboard">
            Overview
            <span>01</span>
          </button>
          <button data-view="work">
            Gallery works
            <span>02</span>
          </button>
          <button data-view="product">
            Sale items
            <span>03</span>
          </button>
        </nav>
        <div class="sidebar-bottom">
          <p>
            Made with intention.
            <br />
            Managed with care.
          </p>
          <a href="/" target="_blank" rel="noopener">View live storefront</a>
        </div>
      </aside>
      <div class="admin-body">
        <div class="admin-topbar">
          <span>THE ATELIER / ADMIN</span>
          <div>
            <span class="admin-email">${esc(user.email)}</span>
            <button id="sign-out">Sign out</button>
          </div>
        </div>
        <main class="admin-main">
          <div
            id="admin-message"
            class="admin-message"
            role="status"
            aria-live="polite"
            hidden
          ></div>
          <div id="workspace-content"></div>
        </main>
      </div>
    </div>
    <dialog
      id="editor-dialog"
      class="editor-dialog"
      aria-labelledby="editor-title"
    ></dialog>
    <dialog
      id="delete-dialog"
      class="delete-dialog"
      aria-labelledby="delete-title"
    ></dialog>
  `
  document.querySelectorAll('[data-view]').forEach((button) =>
    button.addEventListener('click', () => {
      currentView = button.dataset.view
      query = ''
      statusFilter = 'all'
      notify('')
      renderWorkspace()
    }),
  )
  document.querySelector('#sign-out').addEventListener('click', async (event) => {
    const button = event.currentTarget
    button.disabled = true
    try {
      await backend.signOut()
      renderLogin()
    } catch {
      renderLogin(
        'Signed out on this device. The server could not be reached to revoke the session.',
      )
    }
    user = null
    items = []
  })
  editor = document.querySelector('#editor-dialog')
  editor.addEventListener('cancel', (event) => {
    if (busy) event.preventDefault()
  })
  editor.addEventListener('close', clearPreview)
  renderWorkspace()
}

function renderWorkspace() {
  document.querySelectorAll('[data-view]').forEach((button) => {
    const active = button.dataset.view === currentView
    button.classList.toggle('active', active)
    if (active) button.setAttribute('aria-current', 'page')
    else button.removeAttribute('aria-current')
  })
  const dashboard = currentView === 'dashboard'
  document.querySelector('#workspace-content').innerHTML = html`
    <div class="admin-heading">
      <div>
        <p class="eyebrow">
          ${dashboard ? 'A LITTLE PERSPECTIVE' : 'CURATE YOUR COLLECTION'}
        </p>
        <h1>
          ${dashboard ? 'Your atelier, at a glance.' : currentView === 'work' ? 'The gallery workspace.' : 'The marketplace workspace.'}
        </h1>
        <p>
          ${dashboard ? 'Keep your work in view and your collection up to date.' : 'Upload, refine, and publish. Every detail is yours to manage.'}
        </p>
      </div>
      <div class="heading-actions">
        ${dashboard ? '<button class="button outline" data-add="work">Upload work</button>' : ''}
        <button class="button dark" data-add="${dashboard ? 'product' : currentView}">
          ${currentView === 'work' ? 'Upload work' : 'Add sale item'}
        </button>
      </div>
    </div>
    ${
      dashboard
        ? html`
            <div class="stat-grid">
              <article>
                <p>Gallery works</p>
                <strong>${items.filter((item) => item.kind === 'work').length}</strong>
                <span>Your portfolio, growing</span>
              </article>
              <article>
                <p>Sale items</p>
                <strong>${items.filter((item) => item.kind === 'product').length}</strong>
                <span>Pieces in your collection</span>
              </article>
              <article>
                <p>Published</p>
                <strong>
                  ${items.filter((item) => item.status === 'published').length}
                </strong>
                <span>Visible on the storefront</span>
              </article>
              <article>
                <p>Drafts</p>
                <strong>${items.filter((item) => item.status === 'draft').length}</strong>
                <span>Ready for your finishing touch</span>
              </article>
            </div>
            <div class="workspace-banner">
              <div>
                <p class="eyebrow">FROM THE WORKSPACE TO THE WORLD</p>
                <h2>
                  Good work deserves
                  <em>to be seen.</em>
                </h2>
                <p>
                  Publish your latest creations to the gallery, or add a new piece to the
                  marketplace.
                </p>
              </div>
              <a href="/" target="_blank" rel="noopener">View storefront</a>
            </div>
          `
        : ''
    }
    <section class="admin-list-section" aria-label="Content manager">
      <div class="list-heading">
        <h2>
          ${dashboard ? 'Recently updated' : 'Your ' + (currentView === 'work' ? 'featured work' : 'sale items')}
        </h2>
        <button id="refresh-items" class="text-button">Refresh</button>
      </div>
      <div class="admin-filters">
        <label class="search-label">
          Search
          <input
            id="item-search"
            type="search"
            placeholder="Search titles or categories"
            value="${esc(query)}"
          />
        </label>
        <label>
          Status
          <select id="status-filter">
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </label>
      </div>
      <div id="item-list"></div>
    </section>
  `
  document
    .querySelectorAll('[data-add]')
    .forEach((button) =>
      button.addEventListener('click', () => openEditor(button.dataset.add)),
    )
  const status = document.querySelector('#status-filter')
  status.value = statusFilter
  status.addEventListener('change', () => {
    statusFilter = status.value
    renderItems()
  })
  document.querySelector('#item-search').addEventListener('input', (event) => {
    query = event.target.value
    renderItems()
  })
  document.querySelector('#refresh-items').addEventListener('click', async (event) => {
    const button = event.currentTarget
    button.disabled = true
    try {
      items = await backend.adminItems()
      renderWorkspace()
      notify('Workspace refreshed.')
    } catch (error) {
      notify(error.message, true)
      button.disabled = false
    }
  })
  renderItems()
}

function renderItems() {
  const matching = items.filter(
    (item) =>
      (currentView === 'dashboard' || item.kind === currentView) &&
      (statusFilter === 'all' || item.status === statusFilter) &&
      `${item.title} ${item.category}`.toLowerCase().includes(query.toLowerCase().trim()),
  )
  const shown = currentView === 'dashboard' ? matching.slice(0, 8) : matching
  document.querySelector('#item-list').innerHTML = shown.length
    ? html`
        <p class="list-count" aria-live="polite">
          ${shown.length} of ${matching.length} items
        </p>
        <div class="admin-item-grid">
          ${shown
            .map(
              (item) => html`
                <article class="admin-item">
                  <div class="admin-item-photo">
                    <img
                      src="${backend.imageUrl(item.image_path)}"
                      alt="${esc(item.alt)}"
                      loading="lazy"
                    />
                    <span
                      class="status-badge ${item.status === 'published' ? 'published' : ''}"
                    >
                      ${item.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div class="admin-item-details">
                    <p class="eyebrow">${esc(item.category)}</p>
                    <h3>${esc(item.title)}</h3>
                    <p>
                      ${item.kind === 'product' ? money(item.price, item.unit) : 'Gallery work'}
                    </p>
                    <div class="item-actions">
                      <button data-edit="${item.id}">Edit details</button>
                      <button
                        class="delete-button"
                        data-delete="${item.id}"
                        aria-label="Delete ${esc(item.title)}"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              `,
            )
            .join('')}
        </div>
      `
    : html`
        <div class="admin-empty">
          <h3>
            ${query || statusFilter !== 'all' ? 'No matching items.' : 'A fresh canvas.'}
          </h3>
          <p>
            ${query || statusFilter !== 'all' ? 'Try another search or status.' : 'Add your first work or sale item to start your collection.'}
          </p>
        </div>
      `
  document.querySelectorAll('[data-edit]').forEach((button) =>
    button.addEventListener('click', () => {
      const item = items.find((entry) => entry.id === button.dataset.edit)
      openEditor(item.kind, item)
    }),
  )
  document
    .querySelectorAll('[data-delete]')
    .forEach((button) =>
      button.addEventListener('click', () =>
        confirmDelete(items.find((entry) => entry.id === button.dataset.delete)),
      ),
    )
}

function clearPreview() {
  if (previewUrl) URL.revokeObjectURL(previewUrl)
  previewUrl = ''
}

function openEditor(kind, item = null) {
  clearPreview()
  const product = kind === 'product'
  editor.innerHTML = html`
    <button class="close" id="close-editor" aria-label="Close editor">&times;</button>
    <p class="eyebrow">${product ? 'THE COLLECTION' : 'THE LOOKBOOK'}</p>
    <h2 id="editor-title">
      ${item ? 'Refine your ' : 'Add a new '}${product ? 'sale item.' : 'work.'}
    </h2>
    <form id="item-form">
      <fieldset id="item-fields">
        <div class="editor-columns">
          <div>
            <div class="upload-preview">
              <img
                id="upload-preview-image"
                ${item ? `src="${backend.imageUrl(item.image_path)}"` : 'hidden'}
                alt="Selected image preview"
              />
              <span id="upload-placeholder" ${item ? 'hidden' : ''}>
                Your next great piece
                <br />
                <small>Upload a portrait image for the best fit.</small>
              </span>
            </div>
            <label>
              Image ${item ? '(choose a file to replace)' : ''}
              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp"
                ${item ? '' : 'required'}
              />
            </label>
            <p class="admin-hint">
              JPG, PNG, or WebP. Maximum 5 MB. Images use public URLs; keep private
              material off this workspace.
            </p>
            <label>
              Image description
              <input
                name="alt"
                required
                maxlength="250"
                value="${esc(item?.alt || '')}"
                placeholder="Describe the outfit or details in the photo"
              />
            </label>
          </div>
          <div>
            <label>
              ${product ? 'Product name' : 'Work title'}
              <input
                name="title"
                required
                maxlength="100"
                value="${esc(item?.title || '')}"
                placeholder="e.g. The Signature Suit"
              />
            </label>
            <label>
              Category${product ? '<select name="category"><option value="readymade">Readymade Outfits</option><option value="materials">Premium Materials</option></select>' : `<input name="category" required maxlength="60" value="${esc(item?.category || '')}" placeholder="e.g. Bespoke tailoring" />`}
            </label>
            ${
              product
                ? html`
                    <div class="price-fields">
                      <label>
                        Price (NGN)
                        <input
                          name="price"
                          type="number"
                          min="0.01"
                          max="100000000"
                          step="0.01"
                          required
                          value="${item?.price ?? ''}"
                          placeholder="85000"
                        />
                      </label>
                      <label>
                        Per
                        <select name="unit">
                          <option value="piece">Piece</option>
                          <option value="yard">Yard</option>
                        </select>
                      </label>
                    </div>
                  `
                : ''
            }
            <label>
              Description
              <textarea
                name="description"
                rows="4"
                maxlength="2000"
                placeholder="Tell the story, describe the fabric, or include sizing details."
              >
${esc(item?.description || '')}</textarea>
            </label>
            <label>
              Visibility
              <select name="status">
                <option value="draft">Draft - hidden from storefront</option>
                <option value="published">Published - visible on storefront</option>
              </select>
            </label>
            <p class="admin-hint">
              Published items appear on the live site when visitors load or refresh it.
              Draft listings are only visible to admins.
            </p>
          </div>
        </div>
      </fieldset>
      <p id="editor-error" class="form-error" role="alert"></p>
      <div class="editor-actions">
        <button type="button" class="button outline" id="cancel-editor">Cancel</button>
        <button type="submit" class="button dark" id="save-item">
          Save ${product ? 'sale item' : 'work'}
        </button>
      </div>
    </form>
  `
  const form = document.querySelector('#item-form')
  if (product && item) {
    form.elements.category.value = item.category
    form.elements.unit.value = item.unit
  }
  form.elements.status.value = item?.status || 'draft'
  const close = () => {
    if (!busy) editor.close()
  }
  document.querySelector('#close-editor').addEventListener('click', close)
  document.querySelector('#cancel-editor').addEventListener('click', close)
  form.elements.image.addEventListener('change', () => {
    clearPreview()
    const file = form.elements.image.files[0]
    const image = document.querySelector('#upload-preview-image')
    const placeholder = document.querySelector('#upload-placeholder')
    image.hidden = !item
    if (item) image.src = backend.imageUrl(item.image_path)
    placeholder.hidden = Boolean(item)
    document.querySelector('#editor-error').textContent = ''
    if (!file) return
    try {
      validateImage(file)
      previewUrl = URL.createObjectURL(file)
      image.src = previewUrl
      image.hidden = false
      placeholder.hidden = true
    } catch (error) {
      form.elements.image.value = ''
      document.querySelector('#editor-error').textContent = error.message
    }
  })
  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (busy) return
    let uploadedPath = ''
    let saved = false
    const button = document.querySelector('#save-item')
    const errorRegion = document.querySelector('#editor-error')
    const data = new FormData(form)
    const file = form.elements.image.files[0]
    try {
      const payload = validateItem({
        kind,
        title: data.get('title').trim(),
        category: data.get('category').trim(),
        alt: data.get('alt').trim(),
        description: data.get('description').trim(),
        status: data.get('status'),
        price: product ? Number(data.get('price')) : null,
        unit: product ? data.get('unit') : null,
      })
      if (!item && !file) throw new Error('Choose an image before saving.')
      const extension = file ? validateImage(file) : null
      busy = true
      document.querySelector('#item-fields').disabled = true
      button.disabled = true
      document.querySelector('#cancel-editor').disabled = true
      document.querySelector('#close-editor').disabled = true
      button.textContent = file ? 'Uploading image...' : 'Saving...'
      errorRegion.textContent = ''
      if (file) uploadedPath = await backend.uploadImage(file, user.id, extension)
      payload.image_path = uploadedPath || item.image_path
      button.textContent = 'Saving details...'
      const record = await backend.saveItem(payload, item?.id)
      saved = true
      items = [record, ...items.filter((entry) => entry.id !== record.id)]
      let message = `${product ? 'Sale item' : 'Work'} saved as ${record.status}.`
      if (uploadedPath && item?.image_path) {
        try {
          await backend.removeImage(item.image_path)
        } catch {
          message +=
            ' The previous image could not be removed from storage; you can remove it in Supabase.'
        }
      }
      editor.close()
      renderWorkspace()
      notify(message)
    } catch (error) {
      let cleanupNote = ''
      if (uploadedPath && !saved) {
        cleanupNote =
          ' The image uploaded, but saving could not be confirmed. Refresh the workspace before retrying. Remove any unused images in Supabase Storage.'
      }
      errorRegion.textContent = error.message + cleanupNote
    } finally {
      busy = false
      document.querySelector('#item-fields').disabled = false
      button.disabled = false
      document.querySelector('#cancel-editor').disabled = false
      document.querySelector('#close-editor').disabled = false
      button.textContent = `Save ${product ? 'sale item' : 'work'}`
    }
  })
  editor.showModal()
}

function confirmDelete(item) {
  const dialog = document.querySelector('#delete-dialog')
  dialog.innerHTML = html`
    <p class="eyebrow">REMOVE FROM YOUR COLLECTION</p>
    <h2 id="delete-title">Delete this ${item.kind === 'work' ? 'work' : 'sale item'}?</h2>
    <p>
      <strong>${esc(item.title)}</strong>
      will be removed from the workspace and storefront. This cannot be undone.
    </p>
    <p class="form-error" id="delete-error" role="alert"></p>
    <div class="editor-actions">
      <button class="button outline" id="cancel-delete">Keep item</button>
      <button class="button dark" id="confirm-delete">Delete item</button>
    </div>
  `
  let deleting = false
  dialog.oncancel = (event) => {
    if (deleting) event.preventDefault()
  }
  document.querySelector('#cancel-delete').onclick = () => dialog.close()
  document.querySelector('#confirm-delete').onclick = async (event) => {
    deleting = true
    const button = event.currentTarget
    button.disabled = true
    document.querySelector('#cancel-delete').disabled = true
    button.textContent = 'Deleting...'
    try {
      await backend.deleteItem(item.id)
      items = items.filter((entry) => entry.id !== item.id)
      let message = 'Item deleted.'
      try {
        await backend.removeImage(item.image_path)
      } catch {
        message += ' Its image could not be removed from storage; remove it in Supabase.'
      }
      dialog.close()
      renderWorkspace()
      notify(message)
    } catch (error) {
      document.querySelector('#delete-error').textContent = error.message
    } finally {
      deleting = false
      button.disabled = false
      document.querySelector('#cancel-delete').disabled = false
      button.textContent = 'Delete item'
    }
  }
  dialog.showModal()
}

document.title = 'Admin Workspace | TBB Couture'
if (backend.configured && backend.hasSession()) {
  app.innerHTML =
    '<main class="admin-loading" role="status">Opening your workspace...</main>'
  try {
    user = await backend.requireAdmin()
    await openWorkspace()
  } catch (error) {
    renderLogin(error.message)
  }
} else renderLogin()
