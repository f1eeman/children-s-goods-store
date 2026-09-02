interface Carousel {
  viewport: HTMLElement
  prev: HTMLButtonElement | null
  next: HTMLButtonElement | null
  dots: HTMLElement | null
  row: HTMLElement | null
}

const EDGE = 2

const carouselOf = (root: HTMLElement): Carousel | null => {
  const viewport = root.querySelector<HTMLElement>('[data-carousel-viewport]')

  if (viewport === null) return null

  return {
    viewport,
    prev: root.querySelector<HTMLButtonElement>('[data-carousel-prev]'),
    next: root.querySelector<HTMLButtonElement>('[data-carousel-next]'),
    dots: root.querySelector<HTMLElement>('[data-carousel-dots]'),
    row: root.querySelector<HTMLElement>('[data-carousel-dots-row]'),
  }
}

const pagesOf = ({ scrollWidth, clientWidth }: HTMLElement): number =>
  clientWidth === 0
    ? 1
    : Math.max(1, Math.ceil((scrollWidth - EDGE) / clientWidth))

const pageOf = ({ scrollLeft, clientWidth }: HTMLElement): number =>
  clientWidth === 0 ? 0 : Math.round(scrollLeft / clientWidth)

const behavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth'

export function initCarousel(): void {
  const roots = document.querySelectorAll<HTMLElement>('[data-carousel]')

  for (const root of roots) {
    const carousel = carouselOf(root)

    if (carousel === null) continue

    const { viewport, prev, next, dots, row } = carousel
    let buttons: HTMLButtonElement[] = []

    const syncArrows = (): void => {
      const max = viewport.scrollWidth - viewport.clientWidth
      const scrollable = max > EDGE

      if (prev !== null)
        prev.disabled = !scrollable || viewport.scrollLeft <= EDGE
      if (next !== null)
        next.disabled = !scrollable || viewport.scrollLeft >= max - EDGE
    }

    const syncDots = (): void => {
      const current = pageOf(viewport)

      for (const [index, button] of buttons.entries())
        button.setAttribute('aria-current', String(index === current))
    }

    const buildDots = (): void => {
      if (dots === null || row === null) return

      const pages = pagesOf(viewport)

      row.replaceChildren()
      buttons = []

      if (pages < 2) {
        dots.hidden = true

        return
      }

      dots.hidden = false

      for (let page = 0; page < pages; page += 1) {
        const button = document.createElement('button')

        button.type = 'button'
        button.className = 'dot'
        button.setAttribute('aria-label', `Экран ${String(page + 1)}`)
        button.addEventListener('click', () => {
          viewport.scrollTo({
            left: page * viewport.clientWidth,
            behavior: behavior(),
          })
        })

        row.append(button)
        buttons.push(button)
      }

      syncDots()
    }

    const step = (direction: number): void => {
      viewport.scrollBy({
        left: direction * viewport.clientWidth,
        behavior: behavior(),
      })
    }

    prev?.addEventListener('click', () => {
      step(-1)
    })
    next?.addEventListener('click', () => {
      step(1)
    })

    viewport.addEventListener('scroll', () => {
      syncArrows()
      syncDots()
    })

    new ResizeObserver(() => {
      buildDots()
      syncArrows()
    }).observe(viewport)

    buildDots()
    syncArrows()
  }
}
