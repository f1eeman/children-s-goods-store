import { expect, test, type Page } from '@playwright/test'

const cardsOf = (page: Page) => page.locator('[data-catalog-grid] [data-card]')
const shownOf = (page: Page) =>
  page.locator('[data-catalog-grid] [data-card]:not([hidden])')
const pagesOf = (page: Page) => page.locator('[data-catalog-pagination] .page')

test.beforeEach(async ({ page }) => {
  await page.goto('/catalog/')
})

test('на первой странице три карточки из шести', async ({ page }) => {
  await expect(cardsOf(page)).toHaveCount(6)
  await expect(shownOf(page)).toHaveCount(3)
  await expect(pagesOf(page)).toHaveCount(2)
})

test('вторая страница показывает остаток', async ({ page }) => {
  const first = await shownOf(page).first().getAttribute('data-title')

  await pagesOf(page).nth(1).click()

  await expect(shownOf(page)).toHaveCount(3)
  await expect(shownOf(page).first()).not.toHaveAttribute(
    'data-title',
    String(first),
  )
})

test('фильтр по полу оставляет только свои товары', async ({ page }) => {
  await page.locator('label', { hasText: 'Мальчики' }).click()

  await expect(page.getByRole('checkbox', { name: 'Мальчики' })).toBeChecked()

  const shown = shownOf(page)

  await expect(shown).not.toHaveCount(0)

  for (const gender of await shown.evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute('data-gender')),
  ))
    expect(gender).toBe('boys')
})

test('фильтр по цене прячет то, что дороже', async ({ page }) => {
  const max = page.getByRole('spinbutton', { name: 'Цена до, рублей' })

  await max.fill('700')
  await max.dispatchEvent('change')

  const shown = shownOf(page)

  await expect(shown).not.toHaveCount(0)

  for (const price of await shown.evaluateAll((nodes) =>
    nodes.map((node) => Number(node.getAttribute('data-price'))),
  ))
    expect(price).toBeLessThanOrEqual(700)
})

test('сортировка по цене меняет порядок карточек', async ({ page }) => {
  await page
    .getByRole('combobox', { name: 'Сортировка товаров' })
    .selectOption('price-asc')

  const prices = await shownOf(page).evaluateAll((nodes) =>
    nodes
      .map((node) => ({
        order: Number(getComputedStyle(node).order),
        price: Number(node.getAttribute('data-price')),
      }))
      .sort((a, b) => a.order - b.order)
      .map((item) => item.price),
  )

  expect(prices).toStrictEqual([...prices].sort((a, b) => a - b))
})

test('пустая выборка показывает объяснение', async ({ page }) => {
  const min = page.getByRole('spinbutton', { name: 'Цена от, рублей' })

  await min.fill('2000')
  await min.dispatchEvent('change')

  await expect(shownOf(page)).toHaveCount(0)
  await expect(page.locator('[data-catalog-empty]')).toBeVisible()
})
