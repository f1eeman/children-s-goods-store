import { expect, test, type Page } from '@playwright/test'

const NARROW = { width: 820, height: 900 }

const stripOf = (page: Page) =>
  page.locator('[data-carousel]', { hasText: 'Популярные товары' })

test.beforeEach(async ({ page }) => {
  await page.setViewportSize(NARROW)
  await page.goto('/')
})

test('лента листается вперёд и назад стрелками', async ({ page }) => {
  const strip = stripOf(page)
  const viewport = strip.locator('[data-carousel-viewport]')
  const next = strip.locator('[data-carousel-next]')
  const prev = strip.locator('[data-carousel-prev]')

  await expect(prev).toBeDisabled()
  await expect(next).toBeEnabled()

  await next.click()

  await expect
    .poll(async () => viewport.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(0)
  await expect(prev).toBeEnabled()

  await prev.click()

  await expect
    .poll(async () => viewport.evaluate((node) => node.scrollLeft))
    .toBe(0)
  await expect(prev).toBeDisabled()
})

test('у категорий есть точки прокрутки, у товарных лент — нет', async ({
  page,
}) => {
  const tiles = page.locator('[data-carousel]', { has: page.locator('.tile') })
  const dots = tiles.locator('[data-carousel-dots] .dot')

  await expect(dots).not.toHaveCount(0)
  await expect(dots.first()).toHaveAttribute('aria-current', 'true')
  await expect(stripOf(page).locator('[data-carousel-dots]')).toHaveCount(0)
})

test('карусель категорий листается прокруткой', async ({ page }) => {
  const strip = page.locator('[data-carousel]', {
    has: page.locator('.tile'),
  })
  const viewport = strip.locator('[data-carousel-viewport]')

  await viewport.evaluate((node) => {
    node.scrollLeft = node.clientWidth
  })

  await expect(strip.locator('[data-carousel-prev]')).toBeEnabled()
})
