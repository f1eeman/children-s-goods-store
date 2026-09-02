const MIN = 1
const MAX = 2
const STEP = 0.25

export function initMapZoom(): void {
  const roots = document.querySelectorAll<HTMLElement>('[data-map]')

  for (const root of roots) {
    const photo = root.querySelector<HTMLElement>('[data-map-photo]')
    const zoomIn = root.querySelector<HTMLButtonElement>('[data-map-in]')
    const zoomOut = root.querySelector<HTMLButtonElement>('[data-map-out]')

    if (photo === null || zoomIn === null || zoomOut === null) continue

    let scale = MIN

    const apply = (next: number): void => {
      scale = Math.min(MAX, Math.max(MIN, next))
      photo.style.transform = `scale(${String(scale)})`
      zoomIn.disabled = scale >= MAX
      zoomOut.disabled = scale <= MIN
    }

    zoomIn.addEventListener('click', () => {
      apply(scale + STEP)
    })

    zoomOut.addEventListener('click', () => {
      apply(scale - STEP)
    })

    apply(MIN)
  }
}
