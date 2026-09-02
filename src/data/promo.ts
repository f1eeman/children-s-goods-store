import type { ImageMetadata } from 'astro'

import bannerPromo from '@/img/banner-promo.jpg'

export interface Slide {
  title: string
  subtitle: string
  href: string
  cta: string
  badge?: { value: string; caption: string }
  image: ImageMetadata
  alt: string
}

export const SLIDES: Slide[] = [
  {
    title: 'Черная пятница на всю коллекцию!',
    subtitle: 'позволь себе больше',
    href: '/catalog/akcii/',
    cta: 'Смотреть',
    badge: { value: '-40%', caption: 'у нас' },
    image: bannerPromo,
    alt: 'Малыш играет с игрушками на белом покрывале',
  },
]
