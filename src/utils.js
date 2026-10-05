export const html = String.raw

export function escapeHtml(value = '') {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character],
  )
}

export function money(value, unit = 'piece') {
  const amount = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 2,
  }).format(Number(value))
  return unit === 'yard' ? `${amount} / yard` : amount
}

export function validateImage(file) {
  const allowed = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }
  if (!file || !allowed[file.type]) throw new Error('Choose a JPG, PNG, or WebP image.')
  if (file.size === 0 || file.size > 5 * 1024 * 1024) {
    throw new Error('Images must be between 1 byte and 5 MB.')
  }
  return allowed[file.type]
}

export function validateItem(item) {
  if (!['work', 'product'].includes(item.kind))
    throw new Error('Choose a valid content type.')
  if (!item.title.trim() || item.title.length > 100)
    throw new Error('Enter a title of up to 100 characters.')
  if (!item.category.trim() || item.category.length > 60)
    throw new Error('Enter a category of up to 60 characters.')
  if (!item.alt.trim() || item.alt.length > 250)
    throw new Error('Describe the image in up to 250 characters.')
  if (item.description.length > 2000)
    throw new Error('Keep the description within 2,000 characters.')
  if (!['draft', 'published'].includes(item.status))
    throw new Error('Choose draft or published.')
  if (item.kind === 'product') {
    if (!['readymade', 'materials'].includes(item.category))
      throw new Error('Choose a valid product category.')
    if (!Number.isFinite(item.price) || item.price <= 0 || item.price > 100000000)
      throw new Error('Enter a price between 0.01 and 100,000,000 naira.')
    if (!['piece', 'yard'].includes(item.unit))
      throw new Error('Choose a valid price unit.')
  }
  return item
}
