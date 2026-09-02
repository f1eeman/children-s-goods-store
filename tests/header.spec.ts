import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('в шапке есть навигация и поиск', async ({ page }) => {
  await expect(page.locator('header .nav-link')).not.toHaveCount(0)
  await expect(
    page.getByRole('searchbox', { name: 'Искать товар на сайте' }),
  ).toBeVisible()
})

test('кнопка «Каталог» ведёт в каталог одежды', async ({ page }) => {
  await page.locator('header').getByRole('link', { name: 'Каталог' }).click()

  await expect(page).toHaveURL(/\/catalog\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Одежда')
})

test('якорь «Контакты» ведёт в раздел контактов', async ({ page }) => {
  await page.locator('header .nav-link', { hasText: 'Контакты' }).click()

  const contacts = page.locator('#contacts')

  await expect(contacts).toBeInViewport()
  await expect(
    contacts.getByRole('heading', { name: 'Наши контакты' }),
  ).toBeVisible()
})

test('логотип возвращает на главную', async ({ page }) => {
  await page.goto('/catalog/')
  await page
    .locator('header')
    .getByRole('link', { name: /на главную/ })
    .click()

  await expect(page).toHaveURL(/\/$/)
})
