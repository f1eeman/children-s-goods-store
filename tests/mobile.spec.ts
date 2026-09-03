import { expect, test, type Page } from '@playwright/test'

const MOBILE = { width: 360, height: 720 }

const boxes = (page: Page, selector: string) =>
  page.locator(selector).evaluateAll((nodes) =>
    nodes.map((node) => {
      const rect = node.getBoundingClientRect()

      return { width: Math.round(rect.width), height: Math.round(rect.height) }
    }),
  )

test.beforeEach(async ({ page }) => {
  await page.setViewportSize(MOBILE)
})

test('таблица на телефоне становится стопкой, а не уезжает вбок', async ({
  page,
}) => {
  await page.goto('/delivery/')

  const overflow = await page
    .locator('.table')
    .first()
    .evaluate((node) => node.scrollWidth - node.clientWidth)

  expect(overflow).toBeLessThanOrEqual(1)

  await expect(page.locator('.table td').first()).toBeVisible()
})

test('телефон в шапке не переносится по строкам', async ({ page }) => {
  await page.goto('/')

  const lines = await page
    .locator('header .fact-link')
    .evaluate((node) => node.getClientRects().length)

  expect(lines).toBe(1)
})

test('заголовок карточки товара обрезается многоточием, а не переносится', async ({
  page,
}) => {
  await page.goto('/catalog/')

  const style = await page
    .locator('.card .title')
    .first()
    .evaluate((node) => {
      const computed = getComputedStyle(node)

      return { wrap: computed.whiteSpace, overflow: computed.textOverflow }
    })

  expect(style.wrap).toBe('nowrap')
  expect(style.overflow).toBe('ellipsis')
})

test('цели касания в шапке, подвале и крошках не мельче 24 точек', async ({
  page,
}) => {
  await page.goto('/delivery/')

  const targets = [
    'header .fact-link',
    'header .cart',
    'header .login',
    'footer .link',
    'nav[aria-label="Хлебные крошки"] .link',
  ]

  for (const selector of targets) {
    const list = await boxes(page, selector)

    expect(list.length, `${selector} не найден`).toBeGreaterThan(0)

    for (const box of list) {
      expect(box.height, `${selector} по высоте`).toBeGreaterThanOrEqual(24)
      expect(box.width, `${selector} по ширине`).toBeGreaterThanOrEqual(24)
    }
  }
})

test('страницы не едут по горизонтали на узкой раскладке', async ({ page }) => {
  const routes = [
    '/',
    '/catalog/',
    '/product/lasty-iskupnis/',
    '/about/',
    '/delivery/',
    '/terms/',
    '/news/',
    '/gallery/',
    '/search/',
  ]

  for (const route of routes) {
    await page.goto(route)

    const width = await page.evaluate(
      () => document.documentElement.scrollWidth,
    )

    expect(width, `${route} шире окна`).toBeLessThanOrEqual(MOBILE.width)
  }
})
