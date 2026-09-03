import { AxeBuilder } from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const MOBILE = { width: 360, height: 720 }

const DESIGN_CONTRAST = ['.chip', '.current', '.subtitle']

const PAGES = [
  '/',
  '/catalog/',
  '/catalog/shapki/',
  '/product/shapka-sovenok-vyazannyy/',
  '/cart/',
  '/news/',
  '/news/shapka-po-pogode/',
  '/gallery/',
  '/search/?q=%D0%B1%D0%BE%D0%B4%D0%B8',
  '/terms/',
  '/requisites/',
  '/404/',
]

const NARROW = [
  '/',
  '/catalog/',
  '/product/shapka-sovenok-vyazannyy/',
  '/cart/',
]

const audit = async (page: Page) => {
  const results = await new AxeBuilder({ page })
    .withTags([
      'wcag2a',
      'wcag2aa',
      'wcag21a',
      'wcag21aa',
      'wcag22aa',
      'best-practice',
    ])
    .analyze()

  return results.violations
    .map((violation) => ({
      ...violation,
      nodes: violation.nodes.filter(
        (node) =>
          violation.id !== 'color-contrast' ||
          !DESIGN_CONTRAST.some((selector) =>
            String(node.target[0]).includes(selector),
          ),
      ),
    }))
    .filter((violation) => violation.nodes.length > 0)
    .flatMap((violation) =>
      violation.nodes.map(
        (node) => `${violation.id}: ${String(node.target[0])}`,
      ),
    )
}

for (const path of PAGES)
  test(`axe не находит нарушений: ${path}`, async ({ page }) => {
    await page.goto(path)

    expect(await audit(page)).toEqual([])
  })

for (const path of NARROW)
  test(`axe не находит нарушений на телефоне: ${path}`, async ({ page }) => {
    await page.setViewportSize(MOBILE)
    await page.goto(path)

    expect(await audit(page)).toEqual([])
  })

test('корзина с товарами доступна', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.setItem(
      'merry-cart',
      JSON.stringify({
        v: 1,
        lines: [
          { slug: 'shapka-sovenok-vyazannyy', qty: 2 },
          { slug: 'bodi-beloe-oblachko', qty: 1, size: '80', color: 'Белый' },
        ],
      }),
    )
  })
  await page.goto('/cart/')

  expect(await audit(page)).toEqual([])
})
