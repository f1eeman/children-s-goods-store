const format = new Intl.NumberFormat('ru-RU', { useGrouping: 'min2' })

export const MAX_QTY = 99

export const priceLabel = (value: number): string => `${format.format(value)} ₽`
