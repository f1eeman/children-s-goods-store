export interface Link {
  href: string
  label: string
}

export const MAIN_NAV: Link[] = [
  { href: '/catalog/akcii/', label: 'Акции' },
  { href: '#', label: 'Сертификаты' },
  { href: '#', label: 'Доставка и оплата' },
  { href: '#', label: 'Фотогалерея' },
  { href: '#', label: 'О компании' },
  { href: '/#contacts', label: 'Контакты' },
]

export const FOOTER_COLUMNS: Link[][] = [
  [
    { href: '#', label: 'О компании' },
    { href: '#', label: 'Условия работы' },
    { href: '#', label: 'Фотогалерея' },
    { href: '#', label: 'Сертификаты' },
  ],
  [
    { href: '#', label: 'Реквизиты' },
    { href: '#', label: 'Партнерам' },
    { href: '#', label: 'Амбассадорам' },
    { href: '#', label: 'Блогерам' },
  ],
  [{ href: '#', label: 'Новости' }],
]
