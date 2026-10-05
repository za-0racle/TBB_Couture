import test from 'node:test'
import assert from 'node:assert/strict'
import { escapeHtml, validateImage, validateItem, money } from '../src/utils.js'

const product = {
  kind: 'product',
  title: 'Signature suit',
  category: 'readymade',
  alt: 'Black tailored suit',
  description: '',
  status: 'draft',
  price: 85000,
  unit: 'piece',
}

test('admin text cannot break out of HTML text or attribute contexts', () => {
  assert.equal(
    escapeHtml('<img src=x onerror="alert(1)">&\''),
    '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;&amp;&#39;',
  )
})

test('accepts complete products and gallery works', () => {
  assert.equal(validateItem({ ...product }).price, 85000)
  assert.equal(
    validateItem({
      ...product,
      kind: 'work',
      category: 'Tailoring',
      price: null,
      unit: null,
    }).kind,
    'work',
  )
})

test('rejects invalid prices, states, categories, and empty descriptions of images', () => {
  for (const price of [0, -1, NaN, Infinity, 100000001])
    assert.throws(() => validateItem({ ...product, price }))
  for (const override of [
    { title: ' ' },
    { category: 'other' },
    { status: 'hidden' },
    { alt: '' },
    { unit: 'box' },
  ]) {
    assert.throws(() => validateItem({ ...product, ...override }))
  }
})

test('rejects SVG, oversized and empty uploads while accepting supported formats', () => {
  assert.equal(validateImage({ type: 'image/jpeg', size: 5242880 }), 'jpg')
  assert.equal(validateImage({ type: 'image/png', size: 30 }), 'png')
  assert.equal(validateImage({ type: 'image/webp', size: 30 }), 'webp')
  for (const file of [
    { type: 'image/svg+xml', size: 30 },
    { type: 'image/png', size: 5242881 },
    { type: 'image/jpeg', size: 0 },
  ])
    assert.throws(() => validateImage(file))
})

test('money formats naira prices and material units', () => {
  assert.match(money(85000), /85,000/)
  assert.match(money(2000, 'yard'), /2,000.*\/ yard/)
})
