export const SITE = {
  name: 'MERRY',
  address: 'Санкт-Петербург, ул. Большая Конюшенная, д. 19',
  hours: '10:00 – 22:00, пн/сб',
  phone: { href: '+79999999999', label: '+7 (999)-999-99-99' },
  shopPhone: { href: '+78552910562', label: '+7 (8552) 91-05-62' },
  email: 'cc@merry-child.ru',
  schedule: [
    { days: 'пн-сб:', hours: '08:00-19:00' },
    { days: 'вс:', hours: '09:00-17:00' },
  ],
} as const
