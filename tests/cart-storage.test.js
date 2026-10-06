import test from 'node:test'
import assert from 'node:assert/strict'
import { restoreCart, serializeCart } from '../src/cart-storage.js'

test('restores quantities against stable IDs when the catalog is reordered', () => {
  const saved = serializeCart(
    new Map([
      [0, 2],
      [1, 3],
    ]),
    [{ id: 'a' }, { id: 'b' }],
  )
  assert.deepEqual(
    [...restoreCart(saved, [{ id: 'b' }, { id: 'a' }])],
    [
      [1, 2],
      [0, 3],
    ],
  )
})
test('drops removed products and uses the new catalog prices', () => {
  const saved = serializeCart(
    new Map([
      [0, 2],
      [1, 1],
    ]),
    [
      { id: 'a', amount: 10 },
      { id: 'b', amount: 20 },
    ],
  )
  assert.equal(saved.includes('amount'), false)
  const products = [{ id: 'a', amount: 15 }]
  const restored = restoreCart(saved, products)
  assert.deepEqual([...restored], [[0, 2]])
  assert.equal(
    [...restored].reduce((sum, [index, q]) => sum + products[index].amount * q, 0),
    30,
  )
})
test('corrupt storage and invalid quantities do not break the cart', () => {
  for (const raw of ['broken', 'null', '{}', '{"version":9,"items":[]}'])
    assert.equal(restoreCart(raw, [{ id: 'a' }]).size, 0)
  for (const quantity of [-1, 0, 1.5, '2', null, Number.MAX_VALUE]) {
    assert.equal(
      restoreCart(JSON.stringify({ version: 1, items: [{ id: 'a', quantity }, null] }), [
        { id: 'a' },
      ]).size,
      0,
    )
  }
})
test('removing every item persists an empty selection', () => {
  assert.deepEqual(
    [...restoreCart(serializeCart(new Map(), [{ id: 'a' }]), [{ id: 'a' }])],
    [],
  )
})
