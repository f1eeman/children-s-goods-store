import type { ImageMetadata } from 'astro'

import bannerDelivery from '@/img/banner-delivery.jpg'
import bannerRequest from '@/img/banner-request.jpg'
import promoNewYear from '@/img/promo-newyear.jpg'

export interface Banner {
  title: string
  href: string
  cta: string
  image: ImageMetadata
  alt: string
}

export const REQUEST_BANNER: Banner = {
  title: 'Оставьте заявку сегодня и получите скидку завтра!',
  href: '/catalog/akcii/',
  cta: 'Смотреть',
  image: bannerRequest,
  alt: 'Ребёнок целует младенца, сидящего в кроватке',
}

export const DELIVERY_BANNER: Banner = {
  title: 'Доставка почтой бесплатная при заказе от 5000 рублей',
  href: '/catalog/',
  cta: 'Смотреть',
  image: bannerDelivery,
  alt: 'Курьер держит стопку картонных коробок',
}

export const SIDEBAR_PROMO: Banner = {
  title: 'Новогодние скидки 10%',
  href: '/catalog/akcii/',
  cta: 'Смотреть',
  image: promoNewYear,
  alt: 'Малыш в новогоднем костюме у ёлки',
}
