import './style.css'
import { galleryWorks } from './gallery.js'
// Mark HTML templates so markup stays in readable blocks.
const html = String.raw

// Collection preview data and shared brand elements.
const photo = (id, w = 1000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`
const products = [
  {
    name: 'The Signature Suit',
    type: 'readymade',
    price: '₦185,000',
    photo: 'photo-1594633312681-425c7b97ccd1',
    tag: 'THE SIGNATURE EDIT',
  },
  {
    name: 'The Evening Muse',
    type: 'readymade',
    price: '₦145,000',
    photo: 'photo-1595777457583-95e059d581b8',
    tag: 'OCCASION WEAR',
  },
  {
    name: 'Italian Wool Blend',
    type: 'materials',
    price: '₦28,000 / yard',
    photo: 'photo-1558618666-fcd25c85cd64',
    tag: 'FABRIC LIBRARY',
  },
  {
    name: 'The Everyday Essential',
    type: 'readymade',
    price: '₦95,000',
    photo: 'photo-1483985988355-763728e1935b',
    tag: 'EFFORTLESS ELEGANCE',
  },
]
const brand = html`
  <span class="brand">
    <img src="/TBB_LOGO.jpg" alt="TBB Couture" width="1041" height="1080" />
  </span>
`
const arrow = '<span aria-hidden="true">↗</span>'
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
      <a href="#apprenticeship">Apprenticeship</a>
      <a href="#contact">Contact</a>
    </nav>
    <button class="button outline header-cta" data-inquiry="consultation">
      Book Consultation ${arrow}
    </button>
    <button
      class="menu"
      aria-label="Open navigation"
      aria-expanded="false"
      aria-controls="navigation"
    >
      ☰
    </button>
  </header>
  <main id="main">
    <section class="hero" id="home">
      <img
        class="hero-photo"
        src="${photo('photo-1539109136881-3be0616acf4b', 2000)}"
        alt="Fashion editorial with contemporary tailoring on a city street"
        fetchpriority="high"
      />
      <div class="shade"></div>
      <div class="hero-content">
        <p class="eyebrow">— &nbsp; THE ART OF A PERFECT FIT</p>
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
          <a class="button gold" id="shop" href="#marketplace">Shop Readymade ${arrow}</a>
          <a class="button glass" href="#apprenticeship">
            Explore Apprenticeship ${arrow}
          </a>
        </div>
      </div>
      <div class="hero-bottom">
        <span>BESPOKE TAILORING / TIMELESS EXPRESSION</span>
        <a href="#marketplace">SCROLL TO DISCOVER &nbsp; ↓</a>
      </div>
      <span class="hero-side">THE TBB COUTURE EDIT — 01</span>
    </section>
    <div class="values">
      <span>Made with intention</span>
      <i>✧</i>
      <span>Tailored to you</span>
      <i>✧</i>
      <span>Exceptional fabrics</span>
      <i>✧</i>
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
            <sup>04</sup>
          </button>
          <button data-filter="readymade" aria-pressed="false">Readymade Outfits</button>
          <button data-filter="materials" aria-pressed="false">Premium Materials</button>
        </div>
        <span id="count" aria-live="polite">4 curated pieces</span>
      </div>
      <div class="product-grid">
        ${products
          .map(
            (p, i) => html`
              <article class="product" data-category="${p.type}">
                <div class="product-image">
                  <img
                    src="${photo(p.photo, 700)}"
                    alt="${p.name} — illustrative fashion photograph"
                    loading="lazy"
                  />
                  <span class="tag">${p.tag}</span>
                  <button class="quick" data-product="${i}" aria-label="View ${p.name}">
                    ↗
                  </button>
                </div>
                <div class="meta">
                  <span>
                    ${p.type === 'materials' ? 'PREMIUM MATERIAL' : 'READYMADE'}
                  </span>
                  <span>0${i + 1}</span>
                </div>
                <h3>${p.name}</h3>
                <div class="product-bottom">
                  <p>${p.price}</p>
                  <button data-product="${i}">View Details &nbsp; ↗</button>
                </div>
              </article>
            `,
          )
          .join('')}
      </div>
      <p class="collection-note">
        A preview of our aesthetic. Images and prices are illustrative; inquire for
        current availability.
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
        Editorial placeholders shown below. Original TBB Couture work will be featured
        here.
      </p>
      <div class="gallery-grid">
        ${galleryWorks
          .map(
            (work, index) => html`
              <figure class="gallery-item">
                <button
                  class="gallery-preview"
                  data-gallery="${index}"
                  aria-label="Enlarge ${work.title}"
                >
                  <img
                    src="${photo(work.photo, 900)}"
                    alt="${work.alt}"
                    loading="lazy"
                    width="800"
                    height="1000"
                  />
                  <span class="gallery-expand" aria-hidden="true">&#8599;</span>
                </button>
                <figcaption>
                  <span>${work.category}</span>
                  <h3>${work.title}</h3>
                </figcaption>
              </figure>
            `,
          )
          .join('')}
      </div>
    </section>
    <section class="craft" id="apprenticeship">
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
          Great style begins with skilled hands. Join our apprenticeship program and turn
          your passion for fashion into a craft that lasts a lifetime.
        </p>
        <ul class="offerings">
          <li>
            <span>01</span>
            Pattern Drafting ${arrow}
          </li>
          <li>
            <span>02</span>
            Premium Bespoke Stitching ${arrow}
          </li>
          <li>
            <span>03</span>
            Fashion Business Management ${arrow}
          </li>
        </ul>
        <button class="button dark" data-inquiry="apprenticeship">
          Inquire for Intake ${arrow}
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
        Let's Talk About Your Fit ${arrow}
      </button>
    </section>
  </main>
  <footer>
    <a href="#home" aria-label="TBB Couture home">${brand}</a>
    <p class="footer-slogan">We design 2 fit.</p>
    <div class="footer-links">
      <a href="tel:+2348169824380">↗ &nbsp; +234 816 982 4380</a>
      <a
        href="https://www.instagram.com/tbbcouture/"
        target="_blank"
        rel="noopener noreferrer"
      >
        ◎ &nbsp; @tbbcouture
      </a>
      <a
        href="https://www.tiktok.com/@tbb.couture"
        target="_blank"
        rel="noopener noreferrer"
      >
        ♪ &nbsp; tbb.couture
      </a>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} TBB Couture. All rights reserved.</span>
      <span>DESIGNED WITH PURPOSE. MADE TO FIT.</span>
      <a href="#home">Back to top ↑</a>
    </div>
  </footer>
  <dialog id="gallery-dialog" class="gallery-dialog" aria-labelledby="gallery-caption">
    <button class="gallery-close close" aria-label="Close image preview">&times;</button>
    <img id="gallery-image" alt="" />
    <div class="gallery-controls">
      <button id="gallery-previous" aria-label="Previous image">&larr;</button>
      <p id="gallery-caption" aria-live="polite"></p>
      <button id="gallery-next" aria-label="Next image">&rarr;</button>
    </div>
  </dialog>
  <dialog id="inquiry-dialog" aria-labelledby="dialog-title">
    <button class="close" aria-label="Close dialog">×</button>
    <div id="dialog-content"></div>
  </dialog>
`
// Consultation, product, and apprenticeship inquiry dialogs.
const dialog = document.querySelector('#inquiry-dialog')
function inquire(type, product) {
  const training = type === 'apprenticeship'
  document.querySelector('#dialog-content').innerHTML =
    `<p class="eyebrow">LET'S CREATE SOMETHING BEAUTIFUL</p><h2 id="dialog-title">${product ? product.name : training ? 'Learn the art of couture.' : 'Your perfect fit starts here.'}</h2><p>${product ? 'Explore this collection concept with our team. Confirm available designs, fabrics, sizes, and final pricing.' : training ? 'Ask about upcoming intakes, fees, and training schedules. Tell us a little about your goals.' : 'Tell us what you have in mind, and let’s start planning your next piece.'}</p>${
      product
        ? html`
            <p class="price">
              ${product.price}
              <small>Illustrative price · confirm with our team</small>
            </p>
          `
        : ''
    }<form><label>Your name<input name="name" autocomplete="name" required maxlength="100" placeholder="Full name"></label><label>${training ? 'Your experience' : 'Your interest'}<select name="interest">${(training
      ? ['New to fashion design', 'Some sewing experience', 'Looking to refine my skills']
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
      .join(
        '',
      )}</select></label><label>A few details<textarea name="message" rows="3" maxlength="1500" placeholder="${training ? 'Your goals and preferred start date…' : 'Occasion, style, sizing, or timeline…'}"></textarea></label><p class="form-note">Continue to WhatsApp to review and send your inquiry directly to TBB Couture. This website does not submit or store your details.</p><button class="button dark" type="submit">Continue to WhatsApp ${arrow}</button></form>`
  dialog.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const message = `Hello TBB Couture! My name is ${data.get('name')}. I'd like to inquire about ${product ? product.name : training ? 'the apprenticeship program' : 'a consultation'}.\n${data.get('interest')}\n${data.get('message')}`
    window.open(
      `https://wa.me/2348169824380?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer',
    )
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
}
document
  .querySelectorAll('[data-filter]')
  .forEach((b) => b.addEventListener('click', () => filter(b.dataset.filter)))
document.querySelector('#shop').addEventListener('click', () => filter('readymade'))
// Responsive navigation.
const menu = document.querySelector('.menu'),
  nav = document.querySelector('nav')
function closeMenu() {
  nav.classList.remove('open')
  menu.setAttribute('aria-expanded', 'false')
  menu.setAttribute('aria-label', 'Open navigation')
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true'
  nav.classList.toggle('open', open)
  menu.setAttribute('aria-expanded', String(open))
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation')
})
nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu))
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('open')) {
    closeMenu()
    menu.focus()
  }
})
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
  activeWork = (index + galleryWorks.length) % galleryWorks.length
  const work = galleryWorks[activeWork]
  const image = document.querySelector('#gallery-image')
  image.src = photo(work.photo, 1600)
  image.alt = work.alt
  document.querySelector('#gallery-caption').textContent =
    `${activeWork + 1} / ${galleryWorks.length} - ${work.title} (editorial placeholder)`
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
