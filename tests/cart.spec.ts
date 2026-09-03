import { expect, test, type Page } from '@playwright/test'

const badge = (page: Page) => page.locator('[data-cart-count]')
const total = (page: Page) => page.locator('[data-cart-total]')
const lines = (page: Page) => page.locator('[data-cart-line]:not([hidden])')

test.beforeEach(async ({ page }) => {
  await page.goto('/catalog/')
  await page.evaluate(() => {
    window.localStorage.clear()
  })
  await page.reload()
})

test('пустая корзина не показывает ни бейджа, ни суммы', async ({ page }) => {
  await expect(badge(page)).toBeHidden()
  await expect(total(page)).toHaveText('0 ₽')

  await page.goto('/cart/')

  await expect(page.locator('[data-cart-empty]')).toBeVisible()
  await expect(lines(page)).toHaveCount(0)
  await expect(page.locator('[data-cart-summary]')).toBeHidden()
})

test('кнопка из карточки кладёт товар и оживляет шапку', async ({ page }) => {
  const button = page.locator('.card [data-cart-add]').first()
  const title = await button.getAttribute('data-cart-title')

  await button.click()

  await expect(badge(page)).toHaveText('1')
  await expect(badge(page)).toBeVisible()
  await expect(total(page)).not.toHaveText('0 ₽')
  await expect(button).toHaveText('Готово')
  await expect(page.locator('[data-cart-live]')).toContainText(String(title))
})

test('размер и количество с карточки товара попадают в строку корзины', async ({
  page,
}) => {
  await page.goto('/product/lasty-iskupnis/')
  await page.locator('[data-cart-size]').selectOption({ index: 1 })
  await page.locator('[data-quantity-plus]').click()
  await page.locator('.buy[data-cart-add]').click()

  await expect(badge(page)).toHaveText('2')

  await page.goto('/cart/')

  const line = lines(page).first()

  await expect(lines(page)).toHaveCount(1)
  await expect(line.locator('[data-cart-line-options]')).toContainText('28')
  await expect(line.locator('[data-quantity-input]')).toHaveValue('2')
  await expect(page.locator('[data-cart-sum]')).toHaveText('1200 ₽')
})

test('количество в корзине пересчитывает строку и итог', async ({ page }) => {
  await page.locator('.card [data-cart-add]').first().click()
  await page.goto('/cart/')

  const line = lines(page).first()
  const before = await page.locator('[data-cart-sum]').textContent()

  await line.locator('[data-quantity-plus]').click()

  await expect(line.locator('[data-quantity-input]')).toHaveValue('2')
  await expect(page.locator('[data-cart-sum]')).not.toHaveText(String(before))
  await expect(badge(page)).toHaveText('2')
})

test('корзина переживает перезагрузку и чистится кнопкой', async ({ page }) => {
  await page.locator('.card [data-cart-add]').first().click()
  await page.goto('/cart/')

  await expect(lines(page)).toHaveCount(1)

  await page.reload()

  await expect(lines(page)).toHaveCount(1)

  await page.locator('[data-cart-clear]').click()

  await expect(lines(page)).toHaveCount(0)
  await expect(page.locator('[data-cart-empty]')).toBeVisible()
  await expect(badge(page)).toBeHidden()
})

test('строка убирается кнопкой «Убрать»', async ({ page }) => {
  const buttons = page.locator('.card [data-cart-add]')

  await buttons.nth(0).click()
  await buttons.nth(1).click()
  await page.goto('/cart/')

  await expect(lines(page)).toHaveCount(2)

  await lines(page).first().locator('[data-cart-remove]').click()

  await expect(lines(page)).toHaveCount(1)
})

test('вторая вкладка узнаёт об изменении корзины', async ({
  page,
  context,
}) => {
  await page.locator('.card [data-cart-add]').first().click()

  const second = await context.newPage()

  await second.goto('/cart/')

  await expect(second.locator('[data-cart-line]:not([hidden])')).toHaveCount(1)

  await second
    .locator('[data-cart-line]:not([hidden]) [data-quantity-plus]')
    .click()

  await expect(badge(page)).toHaveText('2')

  await second.close()
})

test('без JS корзина пуста и об этом сказано', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()

  await page.goto('/cart/')

  await expect(page.locator('[data-cart-empty]')).toBeVisible()
  await expect(page.locator('[data-cart-count]')).toBeHidden()
  await expect(page.locator('[data-cart-total]')).toHaveText('0 ₽')

  await context.close()
})

const seed = async (page: Page, lines: unknown[]): Promise<void> => {
  await page.goto('/cart/')
  await page.evaluate((value) => {
    window.localStorage.setItem(
      'merry-cart',
      JSON.stringify({ v: 1, lines: value }),
    )
  }, lines)
  await page.reload()
}

test('один товар в двух размерах даёт две строки, и обе убираются', async ({
  page,
}) => {
  await page.locator('.card [data-cart-add]').first().click()
  await page.goto('/product/shapka-sovenok-vyazannyy/')
  await page.locator('[data-cart-size]').selectOption({ index: 1 })
  await page.locator('.buy[data-cart-add]').click()
  await page.goto('/cart/')

  await expect(lines(page)).toHaveCount(2)
  await expect(badge(page)).toHaveText('2')

  await lines(page).first().locator('[data-cart-remove]').click()

  await expect(lines(page)).toHaveCount(1)

  await lines(page).first().locator('[data-cart-remove]').click()

  await expect(lines(page)).toHaveCount(0)
  await expect(page.locator('[data-cart-empty]')).toBeVisible()
})

test('позиция без размера объясняет это в строке', async ({ page }) => {
  await page.locator('.card [data-cart-add]').first().click()
  await page.goto('/cart/')

  await expect(
    lines(page).first().locator('[data-cart-line-options]'),
  ).toContainText('уточним')
})

test('после загрузки границы счётчика верны, а не от разметки', async ({
  page,
}) => {
  await seed(page, [
    { slug: 'shapka-sovenok-vyazannyy', qty: 99 },
    { slug: 'bodi-beloe-oblachko', qty: 2 },
  ])

  await expect(
    lines(page).first().locator('[data-quantity-minus]'),
  ).toBeEnabled()
  await expect(
    lines(page).first().locator('[data-quantity-plus]'),
  ).toBeDisabled()
  await expect(
    lines(page).nth(1).locator('[data-quantity-minus]'),
  ).toBeEnabled()
})

test('позиция товара, которого нет в сборке, вычищается', async ({ page }) => {
  await seed(page, [
    { slug: 'takogo-tovara-net', qty: 3 },
    { slug: 'bodi-beloe-oblachko', qty: 1 },
  ])

  await expect(lines(page)).toHaveCount(1)
  await expect(badge(page)).toHaveText('1')

  const stored = await page.evaluate(
    () => window.localStorage.getItem('merry-cart') ?? '',
  )

  expect(stored).not.toContain('takogo-tovara-net')
})

test('удаление строки не теряет фокус', async ({ page }) => {
  await seed(page, [
    { slug: 'shapka-sovenok-vyazannyy', qty: 1 },
    { slug: 'bodi-beloe-oblachko', qty: 1 },
  ])

  await lines(page).first().locator('[data-cart-remove]').click()

  await expect(lines(page)).toHaveCount(1)

  const focused = await page.evaluate(
    () => document.activeElement?.getAttribute('data-cart-remove') !== null,
  )

  expect(focused).toBe(true)
})

test('ссылка на корзину называет себя словом', async ({ page }) => {
  await expect(page.locator('header a.cart')).toContainText('Корзина')
})
