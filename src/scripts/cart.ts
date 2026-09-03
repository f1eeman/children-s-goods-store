import { MAX_QTY, priceLabel } from '@/data/price'

export interface Line {
  slug: string
  qty: number
  size?: string
  color?: string
}

const KEY = 'merry-cart'
const VERSION = 1
const SPEECH_LIFE = 4000
const LABEL_LIFE = 1600

const timers = new WeakMap<HTMLElement, number>()
const labels = new WeakMap<HTMLElement, string>()

const keyOf = (line: Line): string =>
  [line.slug, line.size ?? '', line.color ?? ''].join('|')

const clamp = (value: number): number =>
  Math.min(MAX_QTY, Math.max(1, Math.round(value)))

const isLine = (value: unknown): value is Line => {
  if (typeof value !== 'object' || value === null) return false

  const line = value as Record<string, unknown>

  return (
    typeof line['slug'] === 'string' &&
    typeof line['qty'] === 'number' &&
    Number.isFinite(line['qty']) &&
    line['qty'] > 0 &&
    (line['size'] === undefined || typeof line['size'] === 'string') &&
    (line['color'] === undefined || typeof line['color'] === 'string')
  )
}

export const read = (): Line[] => {
  try {
    const raw = window.localStorage.getItem(KEY)

    if (raw === null) return []

    const parsed: unknown = JSON.parse(raw)

    if (typeof parsed !== 'object' || parsed === null) return []

    const lines = (parsed as Record<string, unknown>)['lines']

    if (!Array.isArray(lines)) return []

    return lines
      .filter(isLine)
      .map((line) => ({ ...line, qty: clamp(line.qty) }))
  } catch {
    return []
  }
}

const write = (lines: Line[]): boolean => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ v: VERSION, lines }))
  } catch {
    return false
  }

  window.dispatchEvent(new CustomEvent('merry:cart'))

  return true
}

export const add = (line: Line): boolean => {
  const lines = read()
  const found = lines.find((item) => keyOf(item) === keyOf(line))

  if (found === undefined) lines.push({ ...line, qty: clamp(line.qty) })
  else found.qty = clamp(found.qty + line.qty)

  return write(lines)
}

export const setQty = (key: string, qty: number): boolean => {
  const lines = read()
    .map((line) =>
      keyOf(line) === key
        ? { ...line, qty: Math.min(MAX_QTY, Math.max(0, Math.round(qty))) }
        : line,
    )
    .filter((line) => line.qty > 0)

  return write(lines)
}

export const remove = (key: string): boolean =>
  write(read().filter((line) => keyOf(line) !== key))

export const clear = (): boolean => write([])

const pricesOf = (): Map<string, number> => {
  const node = document.querySelector('[data-cart-prices]')
  const prices = new Map<string, number>()

  if (node === null) return prices

  try {
    const parsed: unknown = JSON.parse(node.textContent ?? '{}')

    if (typeof parsed !== 'object' || parsed === null) return prices

    for (const [slug, price] of Object.entries(parsed))
      if (typeof price === 'number') prices.set(slug, price)
  } catch {
    return prices
  }

  return prices
}

const total = (lines: Line[], prices: Map<string, number>): number =>
  lines.reduce((sum, line) => sum + (prices.get(line.slug) ?? 0) * line.qty, 0)

const count = (lines: Line[]): number =>
  lines.reduce((sum, line) => sum + line.qty, 0)

const speak = (name: string, values: Record<string, string> = {}): void => {
  const node = document.querySelector<HTMLElement>('[data-cart-live]')

  if (node === null) return

  let text = node.dataset[name] ?? ''

  if (text === '') return

  for (const [mark, value] of Object.entries(values))
    text = text.replace(`%${mark}`, value)

  node.textContent = text

  const previous = timers.get(node)

  if (previous !== undefined) window.clearTimeout(previous)

  timers.set(
    node,
    window.setTimeout(() => {
      node.textContent = ''
    }, SPEECH_LIFE),
  )
}

const paintHeader = (lines: Line[], prices: Map<string, number>): void => {
  const badge = document.querySelector<HTMLElement>('[data-cart-count]')
  const sum = document.querySelector<HTMLElement>('[data-cart-total]')
  const items = count(lines)

  if (badge !== null) {
    badge.textContent = String(items)
    badge.hidden = items === 0
  }

  if (sum !== null) sum.textContent = priceLabel(total(lines, prices))
}

interface Page {
  root: HTMLElement
  list: HTMLElement
  empty: HTMLElement | null
  summary: HTMLElement | null
  sum: HTMLElement | null
  rows: Map<string, HTMLElement>
}

const pageOf = (): Page | null => {
  const root = document.querySelector<HTMLElement>('[data-cart-page]')

  if (root === null) return null

  const list = root.querySelector<HTMLElement>('[data-cart-lines]')

  if (list === null) return null

  return {
    root,
    list,
    empty: root.querySelector<HTMLElement>('[data-cart-empty]'),
    summary: root.querySelector<HTMLElement>('[data-cart-summary]'),
    sum: root.querySelector<HTMLElement>('[data-cart-sum]'),
    rows: new Map(),
  }
}

const rowOf = (page: Page, line: Line): HTMLElement | null => {
  const key = keyOf(line)
  const known = page.rows.get(key)

  if (known !== undefined) return known

  const template = page.root.querySelector<HTMLTemplateElement>(
    `[data-cart-template="${line.slug}"]`,
  )
  const source = template?.content.firstElementChild

  if (source === null || source === undefined) return null

  const row = source.cloneNode(true) as HTMLElement

  row.dataset['cartKey'] = key
  page.list.append(row)
  page.rows.set(key, row)

  return row
}

const fill = (
  row: HTMLElement,
  line: Line,
  price: number,
  index: number,
  emptyOptions: string,
): void => {
  const input = row.querySelector<HTMLInputElement>('[data-quantity-input]')
  const sum = row.querySelector<HTMLElement>('[data-cart-line-sum]')
  const options = row.querySelector<HTMLElement>('[data-cart-line-options]')

  row.style.order = String(index)
  row.hidden = false

  if (input !== null) {
    input.value = String(line.qty)
    input.dispatchEvent(new CustomEvent('merry:quantity'))
  }

  if (sum !== null) sum.textContent = priceLabel(price * line.qty)

  if (options !== null) {
    const parts = [line.size, line.color].filter(
      (part): part is string => part !== undefined && part !== '',
    )

    options.textContent = parts.length === 0 ? emptyOptions : parts.join(', ')
  }
}

const paintPage = (
  page: Page | null,
  lines: Line[],
  prices: Map<string, number>,
): void => {
  if (page === null) return

  const emptyOptions = page.list.dataset['cartLinesUnset'] ?? ''
  const alive = new Set<string>()

  for (const [index, line] of lines.entries()) {
    const row = rowOf(page, line)

    if (row === null) continue

    alive.add(keyOf(line))
    fill(row, line, prices.get(line.slug) ?? 0, index, emptyOptions)
  }

  for (const [key, row] of page.rows)
    if (!alive.has(key)) {
      row.remove()
      page.rows.delete(key)
    }

  if (page.empty !== null) page.empty.hidden = lines.length > 0
  if (page.summary !== null) page.summary.hidden = lines.length === 0

  page.list.hidden = lines.length === 0

  if (page.sum !== null) page.sum.textContent = priceLabel(total(lines, prices))
}

const addFrom = (button: HTMLElement): void => {
  const slug = button.dataset['cartSlug']

  if (slug === undefined) return

  const scope = button.closest<HTMLElement>('[data-cart-scope]')
  const qtyField = scope?.querySelector<HTMLInputElement>(
    '[data-quantity-input]',
  )
  const sizeField = scope?.querySelector<HTMLSelectElement>('[data-cart-size]')
  const colorField =
    scope?.querySelector<HTMLSelectElement>('[data-cart-color]')
  const qty = Number(qtyField?.value ?? '1')

  const saved = add({
    slug,
    qty: Number.isFinite(qty) && qty > 0 ? qty : 1,
    ...(sizeField?.value ? { size: sizeField.value } : {}),
    ...(colorField?.value ? { color: colorField.value } : {}),
  })

  if (!saved) {
    speak('cartLiveFailed')

    return
  }

  const done = button.dataset['cartDone']

  if (done !== undefined) {
    if (!labels.has(button)) labels.set(button, button.textContent ?? '')

    const previous = timers.get(button)

    if (previous !== undefined) window.clearTimeout(previous)

    button.textContent = done
    timers.set(
      button,
      window.setTimeout(() => {
        button.textContent = labels.get(button) ?? done
      }, LABEL_LIFE),
    )
  }

  speak('cartLiveAdded', { s: button.dataset['cartTitle'] ?? '' })
}

const focusAfter = (row: HTMLElement, page: Page | null): void => {
  const rows = [...(page?.rows.values() ?? [])].filter((item) => !item.hidden)
  const index = rows.indexOf(row)
  const next = rows[index + 1] ?? rows[index - 1]
  const button = next?.querySelector<HTMLElement>('[data-cart-remove]')

  if (button !== undefined && button !== null) {
    button.focus()

    return
  }

  page?.empty?.focus()
}

export function initCart(): void {
  const prices = pricesOf()
  const page = pageOf()
  const stored = read()
  const known = stored.filter((line) => prices.has(line.slug))

  if (prices.size > 0 && known.length !== stored.length) write(known)

  const paint = (): void => {
    const lines = read()

    paintHeader(lines, prices)
    paintPage(page, lines, prices)
  }

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return

    const addButton = event.target.closest<HTMLElement>('[data-cart-add]')

    if (addButton !== null) {
      addFrom(addButton)

      return
    }

    const removeButton = event.target.closest<HTMLElement>('[data-cart-remove]')

    if (removeButton !== null) {
      const row = removeButton.closest<HTMLElement>('[data-cart-line]')
      const key = row?.dataset['cartKey']

      if (row !== null && row !== undefined && key !== undefined) {
        focusAfter(row, page)

        if (remove(key)) speak('cartLiveRemoved')
        else speak('cartLiveFailed')
      }

      return
    }

    if (event.target.closest('[data-cart-clear]') !== null) {
      page?.empty?.focus()

      if (clear()) speak('cartLiveCleared')
      else speak('cartLiveFailed')
    }
  })

  document.addEventListener('change', (event) => {
    if (!(event.target instanceof HTMLInputElement)) return
    if (event.target.dataset['quantityInput'] === undefined) return

    const row = event.target.closest<HTMLElement>('[data-cart-line]')
    const key = row?.dataset['cartKey']

    if (key === undefined) return

    if (!setQty(key, Number(event.target.value))) {
      speak('cartLiveFailed')

      return
    }

    const sum = row?.querySelector<HTMLElement>('[data-cart-line-sum]')

    speak('cartLiveQty', {
      n: event.target.value,
      s: sum?.textContent ?? '',
    })
  })

  window.addEventListener('merry:cart', paint)
  window.addEventListener('storage', (event) => {
    if (event.key === KEY || event.key === null) paint()
  })

  paint()
}
