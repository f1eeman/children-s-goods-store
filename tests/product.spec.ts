import { expect, test, type Page } from '@playwright/test'

const quantityOf = (page: Page) =>
  page.getByRole('spinbutton', { name: 'Количество товара' })
const minusOf = (page: Page) =>
  page.getByRole('button', { name: 'Уменьшить количество' })
const plusOf = (page: Page) =>
  page.getByRole('button', { name: 'Увеличить количество' })

test.beforeEach(async ({ page }) => {
  await page.goto('/product/lasty-iskupnis/')
})

test('счётчик начинается с единицы и не уходит ниже', async ({ page }) => {
  await expect(quantityOf(page)).toHaveValue('1')
  await expect(minusOf(page)).toBeDisabled()

  await plusOf(page).click()

  await expect(quantityOf(page)).toHaveValue('2')
  await expect(minusOf(page)).toBeEnabled()

  await minusOf(page).click()

  await expect(quantityOf(page)).toHaveValue('1')
  await expect(minusOf(page)).toBeDisabled()
})

test('таймер акции показывает дни, часы и минуты', async ({ page }) => {
  const cells = page.locator('[data-timer-value]')

  await expect(cells).toHaveCount(3)

  for (const value of await cells.allInnerTexts())
    expect(value).toMatch(/^\d{2}$/)
})

test('параметры товара перечислены таблицей', async ({ page }) => {
  const rows = page.locator('.params dt')

  await expect(rows).not.toHaveCount(0)
  await expect(page.locator('.params dd').first()).not.toBeEmpty()
})

test('метки распродажи и подарка стоят на галерее', async ({ page }) => {
  const labels = page.locator('.gallery .chip')

  await expect(labels).toHaveCount(2)
  await expect(labels.first()).toHaveText('sale')
})
