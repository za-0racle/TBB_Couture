import './style.css'
import { galleryWorks as sampleWorks } from './gallery.js'
import { configured, publicItems, imageUrl } from './backend.js'
import { escapeHtml as esc, money } from './utils.js'
let galleryWorks = sampleWorks
let catalogError = ''
// Mark HTML templates so markup stays in readable blocks.
const html = String.raw
const whatsappNumber = '2348164835306'
const whatsappUrl = (message) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

// Collection preview data and shared brand elements.
const photo = (id, w = 1000) =>
  id.startsWith('https://')
    ? id
    : `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`
let products = [
  {
    name: 'The Signature Suit',
    type: 'readymade',
    price: money(185000),
    amount: 185000,
    unit: 'piece',
    photo: 'photo-1594633312681-425c7b97ccd1',
    tag: 'THE SIGNATURE EDIT',
  },
  {
    name: 'The Evening Muse',
    type: 'readymade',
    price: money(145000),
    amount: 145000,
    unit: 'piece',
    photo: 'photo-1595777457583-95e059d581b8',
    tag: 'OCCASION WEAR',
  },
  {
    name: 'Italian Wool Blend',
    type: 'materials',
    price: money(28000, 'yard'),
    amount: 28000,
    unit: 'yard',
    photo: 'photo-1558618666-fcd25c85cd64',
    tag: 'FABRIC LIBRARY',
  },
  {
    name: 'The Everyday Essential',
    type: 'readymade',
    price: money(95000),
    amount: 95000,
    unit: 'piece',
    photo: 'photo-1483985988355-763728e1935b',
    tag: 'EFFORTLESS ELEGANCE',
  },
]

// Connected sites show published database content, never sample inventory on failure.
if (configured) {
  document.querySelector('#app').innerHTML =
    '<main class="section" role="status">Loading the collection...</main>'
  products = []
  galleryWorks = []
  try {
    const records = await publicItems()
    products = records
      .filter((item) => item.kind === 'product')
      .map((item) => ({
        name: item.title,
        type: item.category,
        price: money(item.price, item.unit),
        amount: item.price,
        unit: item.unit,
        photo: imageUrl(item.image_path),
        tag: item.category === 'materials' ? 'PREMIUM MATERIAL' : 'THE COLLECTION',
        alt: item.alt,
        description: item.description,
      }))
    galleryWorks = records
      .filter((item) => item.kind === 'work')
      .map((item) => ({
        title: item.title,
        category: item.category,
        photo: imageUrl(item.image_path),
        alt: item.alt,
      }))
  } catch {
    catalogError =
      'We could not load the collection right now. Please refresh to retry or contact us for assistance.'
  }
}

const brand = html`
  <span class="brand">
    <img src="/TBB_LOGO.jpg" alt="TBB Couture" width="1041" height="1080" />
  </span>
`
// Page sections.
document.querySelector('#app').innerHTML = html`
  <a class="skip" href="#main">Skip to content</a>
  <div class="announcement">THOUGHTFULLY DESIGNED. BEAUTIFULLY MADE. UNIQUELY YOU.</div>
  <header>
    <a href="#home" aria-label="TBB Couture home">${brand}</a>
    <nav id="navigation" aria-label="Main navigation">
      <a href="#home">Home</a>
      <a href="#marketplace">Marketplace</a>
      <a href="#gallery">Gallery</a>
      <a href="#learning-center">Learning Center</a>
      <a href="#contact">Contact</a>
      <a
        class="admin-menu-link"
        href="/admin"
        aria-label="Open admin workspace"
        title="Admin workspace"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
        </svg>
        <span>Admin workspace</span>
      </a>
    </nav>
    <button class="button outline header-cta" data-inquiry="consultation">
      Book Consultation
    </button>
    <button
      class="menu"
      aria-label="Open navigation"
      aria-expanded="false"
      aria-controls="navigation"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </header>
  <main id="main">
    <section class="hero" id="home">
      <img
        class="hero-photo"
        src="/homebg.jpg"
        alt="A seated man wearing an embroidered olive-green agbada and matching cap"
        fetchpriority="high"
      />
      <div class="shade"></div>
      <div class="hero-content">
        <p class="eyebrow">THE ART OF A PERFECT FIT</p>
        <h1>
          TBB Couture
          <span>
            We design
            <em>2</em>
            fit.
          </span>
        </h1>
        <p class="hero-copy">
          Distinctive style. Exceptional craftsmanship.
          <br />
          Made for the way you move through the world.
        </p>
        <div class="hero-actions">
          <a class="button gold" id="shop" href="#marketplace">Shop Readymade</a>
          <a class="button glass" href="#learning-center">Explore Learning Center</a>
        </div>
      </div>
      <div class="hero-bottom">
        <span>BESPOKE TAILORING / TIMELESS EXPRESSION</span>
        <a href="#marketplace">SCROLL TO DISCOVER</a>
      </div>
    </section>
    <div class="values">
      <span>Made with intention</span>
      <span>Tailored to you</span>
      <span>Exceptional fabrics</span>
      <span>Timeless by design</span>
    </div>
    <section class="section collection" id="marketplace">
      <div class="section-heading reveal">
        <div>
          <p class="eyebrow">THE CURATED COLLECTION</p>
          <h2>
            An expression of
            <em>you.</em>
          </h2>
        </div>
        <p>
          Considered pieces. Beautiful materials.
          <br />
          Discover the foundation of a distinctive wardrobe.
        </p>
      </div>
      <div class="toolbar">
        <div class="filters" role="group" aria-label="Filter collection">
          <button class="selected" data-filter="all" aria-pressed="true">
            All
            <sup>${products.length}</sup>
          </button>
          <button data-filter="readymade" aria-pressed="false">Readymade Outfits</button>
          <button data-filter="materials" aria-pressed="false">Premium Materials</button>
        </div>
        <span id="count" aria-live="polite">${products.length} curated pieces</span>
        <button class="button outline cart-open" id="cart-open" type="button">
          Cart (
          <span id="cart-count">0</span>
          )
        </button>
      </div>
      <div class="product-grid">
        ${products
          .map(
            (p, i) => html`
              <article class="product" data-category="${p.type}">
                <div class="product-image">
                  <img
                    src="${photo(p.photo, 700)}"
                    alt="${esc(p.alt || p.name + ' - illustrative fashion photograph')}"
                    loading="lazy"
                  />
                  <span class="tag">${esc(p.tag)}</span>
                  <button
                    class="quick"
                    data-product="${i}"
                    aria-label="View ${esc(p.name)}"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7" />
                    </svg>
                  </button>
                </div>
                <div class="meta">
                  <span>
                    ${p.type === 'materials' ? 'PREMIUM MATERIAL' : 'READYMADE'}
                  </span>
                  <span>0${i + 1}</span>
                </div>
                <h3>${esc(p.name)}</h3>
                <div class="product-bottom">
                  <p>${p.price}</p>
                  <div class="product-actions">
                    <button class="add-to-cart" data-add-to-cart="${i}" type="button">
                      Add to cart
                    </button>
                    <button data-product="${i}" type="button">View details</button>
                  </div>
                </div>
              </article>
            `,
          )
          .join('')}
      </div>
      <p id="filter-empty" class="collection-note" hidden>
        No pieces in this category yet.
      </p>
      <p class="collection-note" role="status">
        ${catalogError || (configured ? (products.length ? 'Discover our current collection. Contact us to confirm availability and arrange your order.' : 'New pieces are on their way. Contact us for bespoke requests.') : 'A preview of our aesthetic. Images and prices are illustrative; inquire for current availability.')}
      </p>
    </section>

    <section class="section gallery" id="gallery" aria-labelledby="gallery-title">
      <div class="section-heading reveal">
        <div>
          <p class="eyebrow">THE LOOKBOOK</p>
          <h2 id="gallery-title">
            Every detail.
            <em>A statement.</em>
          </h2>
        </div>
        <p>
          A space for our featured work.
          <br />
          Explore the silhouettes, textures, and details.
        </p>
      </div>
      <p class="gallery-note">
        ${catalogError || (configured ? (galleryWorks.length ? 'Selected work from TBB Couture. Select a photo to explore the details.' : 'Our latest work will appear here soon.') : 'Editorial placeholders shown below. Original TBB Couture work will be featured here.')}
      </p>
      <div class="gallery-grid">
        ${galleryWorks
          .map(
            (work, index) => html`
              <figure class="gallery-item">
                <button
                  class="gallery-preview"
                  data-gallery="${index}"
                  aria-label="Enlarge ${esc(work.title)}"
                >
                  <img
                    src="${photo(work.photo, 900)}"
                    alt="${esc(work.alt)}"
                    loading="lazy"
                    width="800"
                    height="1000"
                  />
                  <span class="gallery-expand" aria-hidden="true">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7" />
                    </svg>
                  </span>
                </button>
                <figcaption>
                  <span>${esc(work.category)}</span>
                  <h3>${esc(work.title)}</h3>
                </figcaption>
              </figure>
            `,
          )
          .join('')}
      </div>
    </section>
    <section class="craft" id="learning-center">
      <div class="craft-photo">
        <img
          src="${photo('photo-1592878904946-b3cd8ae243d0', 1200)}"
          alt="The fine details of a carefully tailored suit"
          loading="lazy"
        />
        <div class="photo-label">
          <span>THE ATELIER</span>
          <p>Where skill becomes signature.</p>
        </div>
      </div>
      <div class="craft-content reveal">
        <p class="eyebrow">THE NEXT GENERATION OF COUTURE</p>
        <h2>
          Mastering
          <br />
          the
          <em>craft.</em>
        </h2>
        <p class="craft-intro">
          Great style begins with skilled hands. Join our Learning Center and turn your
          passion for fashion into a craft that lasts a lifetime.
        </p>
        <ul class="offerings">
          <li>
            <span>01</span>
            Pattern Drafting
          </li>
          <li>
            <span>02</span>
            Premium Bespoke Stitching
          </li>
          <li>
            <span>03</span>
            Fashion Business Management
          </li>
        </ul>
        <button class="button dark" data-inquiry="learning-center">
          Inquire for Intake
        </button>
        <p class="craft-note">Your journey starts with a conversation.</p>
      </div>
    </section>
    <section class="section contact-strip reveal" id="contact">
      <p class="eyebrow">SOMETHING UNIQUELY YOURS</p>
      <h2>
        Your vision.
        <em>Our craftsmanship.</em>
      </h2>
      <p>
        From your first idea to the final fitting, let's create something extraordinary.
      </p>
      <button class="button outline" data-inquiry="consultation">
        Let's Talk About Your Fit
      </button>
    </section>
  </main>
  <footer>
    <a href="#home" aria-label="TBB Couture home">${brand}</a>
    <p class="footer-slogan">We design 2 fit.</p>
    <p class="cac-registration">RC-8376818</p>
    <div class="footer-links">
      <a
        href="${whatsappUrl('Hello TBB Couture! I would like to get in touch.')}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact TBB Couture on WhatsApp (opens in a new tab)"
      >
        <span class="contact-icon" aria-hidden="true">
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            focusable="false"
          >
            <path
              d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a14 14 0 0 1-7-7l2-2-2-5Z"
            />
          </svg>
        </span>
        <span>+234 816 483 5306</span>
      </a>
      <a
        href="https://www.instagram.com/tbb_couture/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TBB Couture on Instagram (opens in a new tab)"
      >
        <span class="contact-icon" aria-hidden="true">
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            focusable="false"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r=".9" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <span>@tbb_couture</span>
      </a>
      <a
        href="https://www.tiktok.com/@tbb.couture"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TBB Couture on TikTok (opens in a new tab)"
      >
        <span class="contact-icon" aria-hidden="true">
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            focusable="false"
          >
            <path
              d="M14 3h3a5 5 0 0 0 4 4v3a8 8 0 0 1-4-1.1V16a6 6 0 1 1-6-6v3a3 3 0 1 0 3 3V3Z"
            />
          </svg>
        </span>
        <span>@tbb.couture</span>
      </a>
    </div>
    <div class="footer-bottom">
      <a href="/admin">Admin workspace</a>
      <span>&copy; ${new Date().getFullYear()} TBB Couture. All rights reserved.</span>
      <span>Designed by Oracle Tek GS</span>
      <a href="#home">Back to top</a>
    </div>
  </footer>
  <a
    class="floating-whatsapp"
    href="${whatsappUrl("Hello TBB Couture! I'd like to make an inquiry.")}"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with TBB Couture on WhatsApp (opens in a new tab)"
    title="Chat on WhatsApp"
  >
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.3-4.8a8.5 8.5 0 1 1 16.2-4Z" />
      <path
        d="m8.2 7 1.5 2.5-1 1.2a8.2 8.2 0 0 0 4.2 4.1l1.2-1 2.5 1.4c-.4 1.5-1.5 2-2.8 1.6-3.8-1.1-6.7-4-7.6-7.2-.4-1.3.4-2.4 2-2.6Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  </a>
  <dialog id="gallery-dialog" class="gallery-dialog" aria-labelledby="gallery-caption">
    <button class="gallery-close close" aria-label="Close image preview">&times;</button>
    <img id="gallery-image" alt="" />
    <div class="gallery-controls">
      <button id="gallery-previous" aria-label="Previous image">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m14 5-7 7 7 7" />
        </svg>
      </button>
      <p id="gallery-caption" aria-live="polite"></p>
      <button id="gallery-next" aria-label="Next image">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m10 5 7 7-7 7" />
        </svg>
      </button>
    </div>
  </dialog>
  <dialog id="cart-dialog" aria-labelledby="cart-title">
    <button class="close" id="close-cart" aria-label="Close cart">&times;</button>
    <p class="eyebrow">YOUR SELECTION</p>
    <h2 id="cart-title">Shopping cart</h2>
    <div id="cart-items"></div>
    <div class="cart-summary">
      <span>Estimated total</span>
      <strong id="cart-total">${money(0)}</strong>
    </div>
    <p class="form-note">
      Checkout opens WhatsApp with your order details. Availability, delivery, and final
      pricing will be confirmed by TBB Couture.
    </p>
    <button class="button dark cart-checkout" id="cart-checkout" type="button">
      Continue to WhatsApp
    </button>
  </dialog>
  <dialog id="inquiry-dialog" aria-labelledby="dialog-title">
    <button class="close" aria-label="Close dialog">&times;</button>
    <div id="dialog-content"></div>
  </dialog>
`
// Consultation, product, and learning-center inquiry dialogs.
const dialog = document.querySelector('#inquiry-dialog')
const cartDialog = document.querySelector('#cart-dialog')
const cart = new Map()

function renderCart() {
  const count = [...cart.values()].reduce((total, quantity) => total + quantity, 0)
  document.querySelector('#cart-count').textContent = String(count)
  const lines = [...cart.entries()]
  const cartItems = document.querySelector('#cart-items')
  const total = lines.reduce(
    (sum, [index, quantity]) => sum + products[index].amount * quantity,
    0,
  )
  document.querySelector('#cart-total').textContent = money(total)
  document.querySelector('#cart-checkout').disabled = count === 0
  cartItems.innerHTML = lines.length
    ? html`
        <div class="cart-lines">
          ${lines
            .map(([index, quantity]) => {
              const product = products[index]
              const unitLabel =
                product.unit === 'yard'
                  ? quantity === 1
                    ? 'yard'
                    : 'yards'
                  : quantity === 1
                    ? 'piece'
                    : 'pieces'
              return html`
                <article class="cart-item">
                  <div class="cart-item-info">
                    <h3>${esc(product.name)}</h3>
                    <p>${money(product.amount, product.unit)} each</p>
                  </div>
                  <div class="cart-quantity">
                    <button
                      type="button"
                      data-cart-decrease="${index}"
                      aria-label="Decrease quantity of ${esc(product.name)}"
                    >
                      -
                    </button>
                    <span>${quantity} ${unitLabel}</span>
                    <button
                      type="button"
                      data-cart-increase="${index}"
                      aria-label="Increase quantity of ${esc(product.name)}"
                    >
                      +
                    </button>
                  </div>
                  <strong class="cart-line-total">
                    ${money(product.amount * quantity)}
                  </strong>
                  <button
                    class="cart-remove"
                    type="button"
                    data-cart-remove="${index}"
                    aria-label="Remove ${esc(product.name)} from cart"
                  >
                    Remove
                  </button>
                </article>
              `
            })
            .join('')}
        </div>
      `
    : html`
        <p class="cart-empty">Your cart is empty.</p>
      `
}

document.querySelector('#cart-open').addEventListener('click', () => {
  renderCart()
  cartDialog.showModal()
})
document.querySelector('#close-cart').addEventListener('click', () => cartDialog.close())
cartDialog.querySelector('#cart-items').addEventListener('click', (event) => {
  const button = event.target.closest('button')
  if (!button) return
  const index = Number(
    button.dataset.cartIncrease ??
      button.dataset.cartDecrease ??
      button.dataset.cartRemove,
  )
  if (button.hasAttribute('data-cart-increase')) {
    cart.set(index, (cart.get(index) || 0) + 1)
  } else if (button.hasAttribute('data-cart-decrease')) {
    const quantity = (cart.get(index) || 0) - 1
    if (quantity > 0) cart.set(index, quantity)
    else cart.delete(index)
  } else if (button.hasAttribute('data-cart-remove')) {
    cart.delete(index)
  } else return
  renderCart()
})
document.querySelector('#cart-checkout').addEventListener('click', () => {
  if (!cart.size) return
  const lines = [...cart.entries()].map(([index, quantity]) => {
    const product = products[index]
    const unitLabel = product.unit === 'yard' ? 'yard(s)' : 'piece(s)'
    return `- ${product.name}: ${quantity} ${unitLabel} at ${money(product.amount, product.unit)} each = ${money(product.amount * quantity)}`
  })
  const total = [...cart.entries()].reduce(
    (sum, [index, quantity]) => sum + products[index].amount * quantity,
    0,
  )
  const message = `Hello TBB Couture! I'd like to order:\n${lines.join('\n')}\nEstimated total: ${money(total)}\nPlease confirm availability and delivery details.`
  window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer')
})

function inquire(type, product) {
  const training = type === 'learning-center'
  document.querySelector('#dialog-content').innerHTML = html`
    <p class="eyebrow">LET'S CREATE SOMETHING BEAUTIFUL</p>
    <h2 id="dialog-title">
      ${product ? esc(product.name) : training ? 'Learn the art of couture.' : 'Your perfect fit starts here.'}
    </h2>
    <p>
      ${product ? esc(product.description || (configured ? 'Contact our team for sizing, fabrics, and availability.' : 'Explore this collection concept with our team. Confirm available designs, fabrics, sizes, and final pricing.')) : training ? 'Ask about upcoming intakes, fees, and training schedules. Tell us a little about your goals.' : "Tell us what you have in mind, and let's start planning your next piece."}
    </p>
    ${
      product
        ? html`
            <p class="price">
              ${product.price}
              <small>
                ${configured ? 'Contact us to arrange your order' : 'Illustrative price - confirm with our team'}
              </small>
            </p>
          `
        : ''
    }
    <form>
      <label>
        Your name
        <input
          name="name"
          autocomplete="name"
          required
          maxlength="100"
          placeholder="Full name"
        />
      </label>
      <label>
        ${training ? 'Your experience' : 'Your interest'}
        <select name="interest">
          ${(training
            ? [
                'New to fashion design',
                'Some sewing experience',
                'Looking to refine my skills',
              ]
            : [
                'Bespoke outfit',
                'Readymade outfit',
                'Premium materials',
                'Styling consultation',
              ]
          )
            .map(
              (x) => html`
                <option>${x}</option>
              `,
            )
            .join('')}
        </select>
      </label>
      <label>
        A few details
        <textarea
          name="message"
          rows="3"
          maxlength="1500"
          placeholder="${training ? 'Your goals and preferred start date...' : 'Occasion, style, sizing, or timeline...'}"
        ></textarea>
      </label>
      <p class="form-note">
        Continue to WhatsApp to review and send your inquiry directly to TBB Couture. This
        website does not submit or store your details.
      </p>
      <button class="button dark" type="submit">Continue to WhatsApp</button>
    </form>
  `
  dialog.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const message = `Hello TBB Couture! My name is ${data.get('name')}. I'd like to inquire about ${product ? product.name : training ? 'the Learning Center' : 'a consultation'}.\n${data.get('interest')}\n${data.get('message')}`
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer')
  })
  dialog.showModal()
}
document
  .querySelectorAll('[data-inquiry]')
  .forEach((b) => b.addEventListener('click', () => inquire(b.dataset.inquiry)))
document
  .querySelectorAll('[data-product]')
  .forEach((b) =>
    b.addEventListener('click', () =>
      inquire('product', products[Number(b.dataset.product)]),
    ),
  )
document.querySelectorAll('[data-add-to-cart]').forEach((button) =>
  button.addEventListener('click', () => {
    const index = Number(button.dataset.addToCart)
    cart.set(index, (cart.get(index) || 0) + 1)
    renderCart()
    document.querySelector('#cart-open').focus()
  }),
)
dialog.querySelector('.close').addEventListener('click', () => dialog.close())
dialog.addEventListener('click', (e) => {
  const r = dialog.getBoundingClientRect()
  if (
    e.target === dialog &&
    (e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom)
  )
    dialog.close()
})
// Marketplace category filtering.
function filter(category) {
  let count = 0
  document.querySelectorAll('[data-filter]').forEach((b) => {
    const selected = b.dataset.filter === category
    b.classList.toggle('selected', selected)
    b.setAttribute('aria-pressed', String(selected))
  })
  document.querySelectorAll('.product').forEach((p) => {
    p.hidden = category !== 'all' && p.dataset.category !== category
    if (!p.hidden) count++
  })
  document.querySelector('#count').textContent = `${count} curated pieces`
  document.querySelector('#filter-empty').hidden = count !== 0
}
document
  .querySelectorAll('[data-filter]')
  .forEach((b) => b.addEventListener('click', () => filter(b.dataset.filter)))
document.querySelector('#shop').addEventListener('click', () => filter('readymade'))
// Responsive navigation: outside taps, keyboard focus, Escape, and resizing.
const menu = document.querySelector('.menu')
const nav = document.querySelector('#navigation')
const mobileNavigation = window.matchMedia('(max-width: 900px)')

function updateMenuHeight() {
  const bottom = document.querySelector('header').getBoundingClientRect().bottom
  nav.style.setProperty('--nav-bottom', Math.max(0, bottom) + 'px')
}

function closeMenu() {
  nav.classList.remove('open')
  menu.setAttribute('aria-expanded', 'false')
  menu.setAttribute('aria-label', 'Open navigation')
}

menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true'
  updateMenuHeight()
  nav.classList.toggle('open', open)
  menu.setAttribute('aria-expanded', String(open))
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation')
})

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu))
document.addEventListener('pointerdown', (event) => {
  if (!nav.contains(event.target) && !menu.contains(event.target)) closeMenu()
})
document.addEventListener('focusin', (event) => {
  if (!nav.contains(event.target) && !menu.contains(event.target)) closeMenu()
})
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    closeMenu()
    menu.focus()
  }
})
mobileNavigation.addEventListener('change', () => {
  if (nav.contains(document.activeElement) && mobileNavigation.matches) menu.focus()
  closeMenu()
})
window.addEventListener('resize', updateMenuHeight, { passive: true })
window.addEventListener(
  'scroll',
  () => {
    if (nav.classList.contains('open')) updateMenuHeight()
  },
  { passive: true },
)
// Progressive reveal animations.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          observer.unobserve(e.target)
        }
      }),
    { threshold: 0.1 },
  )
  document.querySelectorAll('.reveal').forEach((e) => {
    e.classList.add('will-reveal')
    observer.observe(e)
  })
}

// Featured-work gallery: native dialog supports focus trapping and Escape to close.
const galleryDialog = document.querySelector('#gallery-dialog')
let activeWork = 0

function showWork(index) {
  if (!galleryWorks.length) return
  activeWork = (index + galleryWorks.length) % galleryWorks.length
  const work = galleryWorks[activeWork]
  const image = document.querySelector('#gallery-image')
  image.src = photo(work.photo, 1600)
  image.alt = work.alt
  document.querySelector('#gallery-caption').textContent =
    `${activeWork + 1} / ${galleryWorks.length} - ${work.title}${configured ? '' : ' (editorial placeholder)'}`
}

document.querySelectorAll('[data-gallery]').forEach((button) => {
  button.addEventListener('click', () => {
    showWork(Number(button.dataset.gallery))
    galleryDialog.showModal()
  })
})
document
  .querySelector('.gallery-close')
  .addEventListener('click', () => galleryDialog.close())
document
  .querySelector('#gallery-previous')
  .addEventListener('click', () => showWork(activeWork - 1))
document
  .querySelector('#gallery-next')
  .addEventListener('click', () => showWork(activeWork + 1))
galleryDialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault()
    showWork(activeWork + (event.key === 'ArrowRight' ? 1 : -1))
  }
})
galleryDialog.addEventListener('click', (event) => {
  const bounds = galleryDialog.getBoundingClientRect()
  if (
    event.target === galleryDialog &&
    (event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom)
  ) {
    galleryDialog.close()
  }
})

if (window.location.hash === '#apprenticeship') {
  history.replaceState(null, '', '#learning-center')
  document.querySelector('#learning-center').scrollIntoView()
}
