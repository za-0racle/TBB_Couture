// Store only stable IDs and quantities. Prices always come from the current catalog.
export function restoreCart(raw, products) {
  const cart = new Map()
  let saved
  try {
    saved = JSON.parse(raw || 'null')
  } catch {
    return cart
  }
  if (saved?.version !== 1 || !Array.isArray(saved.items)) return cart
  const indices = new Map(products.map((product, index) => [product.id, index]))
  for (const item of saved.items) {
    if (
      !item ||
      typeof item.id !== 'string' ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity <= 0
    )
      continue
    const index = indices.get(item.id)
    if (index !== undefined) cart.set(index, item.quantity)
  }
  return cart
}

export function serializeCart(cart, products) {
  return JSON.stringify({
    version: 1,
    items: [...cart.entries()]
      .filter(
        ([index, quantity]) =>
          products[index]?.id && Number.isSafeInteger(quantity) && quantity > 0,
      )
      .map(([index, quantity]) => ({ id: products[index].id, quantity })),
  })
}
