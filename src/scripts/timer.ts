const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const TICK = 30_000

const pad = (value: number): string => String(value).padStart(2, '0')

export function initTimer(): void {
  const roots = document.querySelectorAll<HTMLElement>('[data-timer]')

  for (const root of roots) {
    const ends = root.dataset['timerEnds']

    if (ends === undefined) continue

    const target = new Date(ends).getTime()

    if (Number.isNaN(target)) continue

    const cells = new Map<string, HTMLElement>()

    for (const cell of root.querySelectorAll<HTMLElement>('[data-timer-value]'))
      cells.set(cell.dataset['timerValue'] ?? '', cell)

    const tick = (): void => {
      const left = Math.max(0, target - Date.now())

      cells.get('days')?.replaceChildren(pad(Math.floor(left / DAY)))
      cells.get('hours')?.replaceChildren(pad(Math.floor((left % DAY) / HOUR)))
      cells
        .get('minutes')
        ?.replaceChildren(pad(Math.floor((left % HOUR) / MINUTE)))
    }

    tick()
    window.setInterval(tick, TICK)
  }
}
