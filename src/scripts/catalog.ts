interface Card {
  root: HTMLElement
  price: number
  gender: string
  material: string
  title: string
}

interface Range {
  rangeMin: HTMLInputElement
  rangeMax: HTMLInputElement
  inputMin: HTMLInputElement
  inputMax: HTMLInputElement
  fill: HTMLElement
}

type Sort = 'popular' | 'price-asc' | 'price-desc' | 'title'

const PER_PAGE = 3

const isSort = (value: string): value is Sort =>
  value === 'popular' ||
  value === 'price-asc' ||
  value === 'price-desc' ||
  value === 'title'

const cardsOf = (grid: HTMLElement): Card[] =>
  Array.from(grid.querySelectorAll<HTMLElement>('[data-card]')).map((root) => ({
    root,
    price: Number(root.dataset['price'] ?? '0'),
    gender: root.dataset['gender'] ?? '',
    material: root.dataset['material'] ?? '',
    title: root.dataset['title'] ?? '',
  }))

const rangeOf = (root: HTMLElement): Range | null => {
  const rangeMin = root.querySelector<HTMLInputElement>(
    '[data-price-range-min]',
  )
  const rangeMax = root.querySelector<HTMLInputElement>(
    '[data-price-range-max]',
  )
  const inputMin = root.querySelector<HTMLInputElement>(
    '[data-price-input-min]',
  )
  const inputMax = root.querySelector<HTMLInputElement>(
    '[data-price-input-max]',
  )
  const fill = root.querySelector<HTMLElement>('[data-price-fill]')

  if (
    rangeMin === null ||
    rangeMax === null ||
    inputMin === null ||
    inputMax === null ||
    fill === null
  )
    return null

  return { rangeMin, rangeMax, inputMin, inputMax, fill }
}

const checkedValues = (form: HTMLFormElement, name: string): Set<string> =>
  new Set(
    Array.from(
      form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`),
    ).map((input) => input.value),
  )

export function initCatalog(): void {
  const root = document.querySelector<HTMLElement>('[data-catalog]')

  if (root === null) return

  const grid = root.querySelector<HTMLElement>('[data-catalog-grid]')

  if (grid === null) return

  const form = root.querySelector<HTMLFormElement>('[data-catalog-filters]')
  const sortField = document.querySelector<HTMLSelectElement>(
    '[data-catalog-sort]',
  )
  const empty = root.querySelector<HTMLElement>('[data-catalog-empty]')
  const pagination = root.querySelector<HTMLElement>(
    '[data-catalog-pagination]',
  )
  const paginationRow = root.querySelector<HTMLElement>(
    '[data-catalog-pagination-row]',
  )
  const cards = cardsOf(grid)
  const range = form === null ? null : rangeOf(form)

  let page = 1

  const bounds = (): { min: number; max: number } => {
    if (range === null) return { min: -Infinity, max: Infinity }

    const min = Number(range.rangeMin.value)
    const max = Number(range.rangeMax.value)

    return { min: Math.min(min, max), max: Math.max(min, max) }
  }

  const matched = (): Card[] => {
    if (form === null) return cards

    const genders = checkedValues(form, 'gender')
    const materials = checkedValues(form, 'material')
    const { min, max } = bounds()

    return cards.filter(
      (card) =>
        (genders.size === 0 || genders.has(card.gender)) &&
        (materials.size === 0 || materials.has(card.material)) &&
        card.price >= min &&
        card.price <= max,
    )
  }

  const sorted = (list: Card[]): Card[] => {
    const value = sortField?.value ?? 'popular'
    const mode: Sort = isSort(value) ? value : 'popular'

    if (mode === 'popular') return list

    return [...list].sort((a, b) => {
      if (mode === 'price-asc') return a.price - b.price
      if (mode === 'price-desc') return b.price - a.price

      return a.title.localeCompare(b.title, 'ru')
    })
  }

  const drawPagination = (pages: number): void => {
    if (pagination === null || paginationRow === null) return

    paginationRow.replaceChildren()

    if (pages < 2) {
      pagination.hidden = true

      return
    }

    pagination.hidden = false

    for (let index = 1; index <= pages; index += 1) {
      const button = document.createElement('button')

      button.type = 'button'
      button.className = 'page'
      button.textContent = String(index)
      button.setAttribute('aria-label', `Страница ${String(index)}`)
      button.setAttribute('aria-current', String(index === page))
      button.addEventListener('click', () => {
        page = index
        render()
      })

      paginationRow.append(button)
    }
  }

  const render = (): void => {
    const list = sorted(matched())
    const pages = Math.max(1, Math.ceil(list.length / PER_PAGE))

    page = Math.min(page, pages)

    const from = (page - 1) * PER_PAGE
    const shown = new Set(list.slice(from, from + PER_PAGE).map((c) => c.root))

    for (const [index, card] of list.entries())
      card.root.style.order = String(index)

    for (const card of cards) card.root.hidden = !shown.has(card.root)

    if (empty !== null) empty.hidden = list.length > 0

    drawPagination(pages)
  }

  const syncRange = (source: 'range' | 'input'): void => {
    if (range === null) return

    const { rangeMin, rangeMax, inputMin, inputMax, fill } = range
    const limitMin = Number(rangeMin.min)
    const limitMax = Number(rangeMin.max)

    if (source === 'input') {
      rangeMin.value = inputMin.value
      rangeMax.value = inputMax.value
    }

    const low = Math.min(Number(rangeMin.value), Number(rangeMax.value))
    const high = Math.max(Number(rangeMin.value), Number(rangeMax.value))
    const span = limitMax - limitMin

    inputMin.value = String(low)
    inputMax.value = String(high)

    fill.style.setProperty(
      '--fill-start',
      `${String(((low - limitMin) / span) * 100)}%`,
    )
    fill.style.setProperty(
      '--fill-end',
      `${String(((limitMax - high) / span) * 100)}%`,
    )
  }

  form?.addEventListener('change', (event) => {
    const target = event.target

    if (target instanceof HTMLInputElement && target.type === 'range')
      syncRange('range')
    else if (target instanceof HTMLInputElement && target.type === 'number')
      syncRange('input')

    page = 1
    render()
  })

  form?.addEventListener('input', (event) => {
    if (!(event.target instanceof HTMLInputElement)) return
    if (event.target.type !== 'range') return

    syncRange('range')
  })

  form?.addEventListener('submit', (event) => {
    event.preventDefault()
  })

  sortField?.addEventListener('change', () => {
    page = 1
    render()
  })

  syncRange('range')
  render()
}
