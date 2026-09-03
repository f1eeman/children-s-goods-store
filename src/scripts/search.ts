const normalize = (value: string): string =>
  value.toLowerCase().replaceAll('ё', 'е').trim()

const wordsOf = (value: string): string[] =>
  normalize(value)
    .split(/[^a-zа-я0-9]+/u)
    .filter((word) => word.length > 1)

export function initSearch(): void {
  const root = document.querySelector<HTMLElement>('[data-search]')

  if (root === null) return

  const grid = root.querySelector<HTMLElement>('[data-search-grid]')
  const input = root.querySelector<HTMLInputElement>('[data-search-input]')
  const count = root.querySelector<HTMLElement>('[data-search-count]')
  const empty = root.querySelector<HTMLElement>('[data-search-empty]')
  const blank = root.querySelector<HTMLElement>('[data-search-blank]')

  if (grid === null) return

  const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-card]'))
  const query = new URLSearchParams(window.location.search).get('q') ?? ''

  if (input !== null) input.value = query

  const words = wordsOf(query)

  if (words.length === 0) {
    if (blank !== null) blank.hidden = false

    if (count !== null) {
      count.hidden = false
      count.textContent = `Все товары: ${String(cards.length)}`
    }

    return
  }

  let shown = 0

  for (const card of cards) {
    const haystack = normalize(
      `${card.dataset['title'] ?? ''} ${card.dataset['keywords'] ?? ''}`,
    )
    const hit = words.some((word) => haystack.includes(word))

    card.hidden = !hit

    if (hit) shown += 1
  }

  if (blank !== null) blank.hidden = true
  if (empty !== null) empty.hidden = shown > 0

  if (count !== null) {
    count.hidden = shown === 0
    count.textContent = `Найдено товаров: ${String(shown)}`
  }
}
