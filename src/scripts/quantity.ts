export function initQuantity(): void {
  const roots = document.querySelectorAll<HTMLElement>('[data-quantity]')

  for (const root of roots) {
    const input = root.querySelector<HTMLInputElement>('[data-quantity-input]')
    const minus = root.querySelector<HTMLButtonElement>('[data-quantity-minus]')
    const plus = root.querySelector<HTMLButtonElement>('[data-quantity-plus]')

    if (input === null || minus === null || plus === null) continue

    const min = Number(input.min)
    const max = Number(input.max)

    const apply = (next: number, notify = false): void => {
      const value = Math.min(max, Math.max(min, Math.round(next)))

      input.value = String(value)
      minus.disabled = value <= min
      plus.disabled = value >= max

      if (notify) input.dispatchEvent(new Event('change', { bubbles: true }))
    }

    minus.addEventListener('click', () => {
      apply(Number(input.value) - 1, true)
    })

    plus.addEventListener('click', () => {
      apply(Number(input.value) + 1, true)
    })

    input.addEventListener('change', () => {
      apply(Number(input.value))
    })

    input.addEventListener('merry:quantity', () => {
      apply(Number(input.value))
    })

    apply(Number(input.value))
  }
}
