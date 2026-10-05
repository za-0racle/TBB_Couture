import './style.css'

const isAdmin = /^\/admin(?:\/|$)/.test(window.location.pathname)
if (isAdmin) {
  await import('./admin.js')
} else {
  await import('./storefront.js')
}
