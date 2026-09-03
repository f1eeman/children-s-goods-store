export interface Link {
  href: string
  label: string
}

export const MAIN_NAV: Link[] = [
  { href: '/catalog/akcii/', label: 'Акции' },
  { href: '/certificates/', label: 'Сертификаты' },
  { href: '/delivery/', label: 'Доставка и оплата' },
  { href: '/gallery/', label: 'Фотогалерея' },
  { href: '/about/', label: 'О компании' },
  { href: '/#contacts', label: 'Контакты' },
]

export const FOOTER_COLUMNS: Link[][] = [
  [
    { href: '/about/', label: 'О компании' },
    { href: '/terms/', label: 'Условия работы' },
    { href: '/gallery/', label: 'Фотогалерея' },
    { href: '/certificates/', label: 'Сертификаты' },
  ],
  [
    { href: '/requisites/', label: 'Реквизиты' },
    { href: '/cooperation/partners/', label: 'Партнёрам' },
    { href: '/cooperation/ambassadors/', label: 'Амбассадорам' },
    { href: '/cooperation/bloggers/', label: 'Блогерам' },
  ],
  [
    { href: '/news/', label: 'Новости' },
    { href: '/privacy/', label: 'Политика конфиденциальности' },
  ],
]

export interface Crumb {
  label: string
  href?: string
}
