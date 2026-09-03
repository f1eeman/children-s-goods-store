import { expect, test, type Page } from '@playwright/test'

const internal = (href: string | null): href is string =>
  href !== null && href.startsWith('/') && !href.startsWith('/#')

const routeOf = (href: string): string => {
  const clean = href.split('#')[0]?.split('?')[0] ?? ''

  return clean === '' ? '/' : clean
}

const crawl = async (page: Page): Promise<Set<string>> => {
  const seen = new Set(['/'])
  const queue = ['/']

  for (let route = queue.shift(); route !== undefined; route = queue.shift()) {
    await page.goto(route)

    const hrefs = await page
      .locator('a[href]')
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute('href') ?? ''),
      )

    for (const href of hrefs.filter(internal)) {
      const next = routeOf(href)

      if (seen.has(next)) continue

      seen.add(next)
      queue.push(next)
    }
  }

  return seen
}

test('в решётку ведут только заглушки, которых не даёт макет', async ({
  page,
}) => {
  await page.goto('/')

  const stubs = await page
    .locator('header a[href="#"], footer a[href="#"]')
    .evaluateAll((nodes) =>
      nodes.map((node) => (node instanceof HTMLElement ? node.className : '')),
    )

  expect(stubs).toStrictEqual([
    'login',
    'social',
    'social',
    'social',
    'social',
    'social',
  ])
})

test('все внутренние ссылки шапки и подвала открываются страницей с заголовком', async ({
  page,
}) => {
  await page.goto('/')

  const hrefs = await page
    .locator('header a, footer a')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')))

  const targets = [...new Set(hrefs.filter(internal))]

  expect(targets.length).toBeGreaterThan(8)

  for (const href of targets) {
    const response = await page.goto(href)

    expect(response?.status(), `${href} отдал не 200`).toBe(200)
    await expect(
      page.getByRole('heading', { level: 1 }),
      `${href} без h1`,
    ).toBeVisible()
  }
})

test('до каждой страницы можно дойти ссылками с главной', async ({ page }) => {
  const seen = await crawl(page)

  const required = [
    '/catalog/',
    '/catalog/novinki/',
    '/catalog/akcii/',
    '/catalog/shapki/',
    '/catalog/kupalniki/',
    '/product/lasty-iskupnis/',
    '/about/',
    '/delivery/',
    '/certificates/',
    '/terms/',
    '/requisites/',
    '/gallery/',
    '/news/',
    '/cooperation/partners/',
    '/cooperation/ambassadors/',
    '/cooperation/bloggers/',
    '/privacy/',
  ]

  for (const route of required)
    expect(seen.has(route), `${route} не достижим ссылками`).toBe(true)

  expect(seen.size).toBeGreaterThanOrEqual(27)
})

test('неизвестный адрес отдаёт 404 и нашу страницу', async ({ page }) => {
  const response = await page.goto('/takoy-stranicy-net/')

  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('header')).toBeVisible()
})

test('поиск из шапки приводит на страницу поиска с результатом', async ({
  page,
}) => {
  await page.goto('/')
  await page
    .getByRole('searchbox', { name: 'Искать товар на сайте' })
    .fill('шапка')
  await page
    .locator('header form')
    .getByRole('button', { name: 'Найти' })
    .click()

  await expect(page).toHaveURL(/\/search\/\?q=/)

  const shown = page.locator('[data-search-grid] [data-card]:not([hidden])')

  await expect(shown).toHaveCount(1)
  await expect(shown.first()).toContainText('Шапка')
  await expect(page.locator('[data-search-count]')).toContainText('1')
})

test('поиск без совпадений объясняет, что ничего не нашлось', async ({
  page,
}) => {
  await page.goto('/search/?q=%D1%81%D0%B0%D0%BC%D0%BE%D0%BB%D1%91%D1%82')

  await expect(
    page.locator('[data-search-grid] [data-card]:not([hidden])'),
  ).toHaveCount(0)
  await expect(page.locator('[data-search-empty]')).toBeVisible()
})
