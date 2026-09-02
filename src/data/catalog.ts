import type { ImageMetadata } from 'astro'

import categoryHats from '@/img/category-hats.jpg'
import categoryNew from '@/img/category-new.jpg'
import categorySale from '@/img/category-sale.jpg'
import categorySwimwear from '@/img/category-swimwear.jpg'
import bodysuit from '@/img/product-bodysuit-cloud.jpg'
import flippers from '@/img/product-flippers.png'
import hat from '@/img/product-hat-owl.jpg'
import pajama from '@/img/product-pajama-acorns.jpg'
import shirt from '@/img/product-shirt-business.jpg'
import tshirt from '@/img/product-tshirt-mama.jpg'

export type Gender = 'boys' | 'girls'

export type Material = 'synthetic' | 'cotton'

export interface Param {
  label: string
  value: string
}

export interface Product {
  slug: string
  title: string
  price: number
  oldPrice?: number
  gift?: boolean
  saleEndsAt?: string
  gender: Gender
  material: Material
  image: ImageMetadata
  alt: string
  categories: string[]
  sizes: string[]
  colors: string[]
  params: Param[]
}

export interface Category {
  slug: string
  title: string
  image?: ImageMetadata
  alt?: string
}

export const ROOT_CATEGORY: Category = { slug: 'odezhda', title: 'Одежда' }

export const CATEGORIES: Category[] = [
  {
    slug: 'novinki',
    title: 'Новинки',
    image: categoryNew,
    alt: 'Девочка в жёлтой футболке и чёрных брюках',
  },
  {
    slug: 'akcii',
    title: 'Акции',
    image: categorySale,
    alt: 'Розовая футболка и белые кроссовки',
  },
  {
    slug: 'shapki',
    title: 'Шапки',
    image: categoryHats,
    alt: 'Вязаная шапка с помпонами',
  },
  {
    slug: 'kupalniki',
    title: 'Купальники',
    image: categorySwimwear,
    alt: 'Девочка в голубом купальнике',
  },
]

export const PRODUCTS: Product[] = [
  {
    slug: 'shapka-sovenok-vyazannyy',
    title: 'Шапка «Совенок вязанный»',
    price: 800,
    oldPrice: 650,
    gender: 'boys',
    material: 'cotton',
    image: hat,
    alt: 'Малыш в вязаной шапке с совой',
    categories: ['shapki', 'novinki'],
    sizes: ['44—46', '46—48', '48—50'],
    colors: ['Серый', 'Бирюзовый'],
    params: [
      { label: 'Пол', value: 'Для мальчиков' },
      { label: 'Состав', value: 'Хлопок, акрил' },
      { label: 'Подкладка', value: 'Хлопок' },
      { label: 'Уход', value: 'Ручная стирка' },
    ],
  },
  {
    slug: 'bodi-beloe-oblachko',
    title: 'Боди «Белое облачко»',
    price: 600,
    gender: 'girls',
    material: 'cotton',
    image: bodysuit,
    alt: 'Малыш в белом боди у табурета',
    categories: ['novinki'],
    sizes: ['62', '68', '74', '80'],
    colors: ['Белый'],
    params: [
      { label: 'Пол', value: 'Для девочек' },
      { label: 'Состав', value: 'Хлопок' },
      { label: 'Застёжка', value: 'Кнопки' },
      { label: 'Уход', value: 'Машинная стирка, 30 °C' },
    ],
  },
  {
    slug: 'pizhama-zheludi',
    title: 'Пижама «желуди»',
    price: 1800,
    oldPrice: 1200,
    gender: 'girls',
    material: 'cotton',
    image: pajama,
    alt: 'Малыш в пижаме с рисунком',
    categories: ['akcii', 'novinki'],
    sizes: ['74', '80', '86'],
    colors: ['Молочный', 'Коричневый'],
    params: [
      { label: 'Пол', value: 'Для девочек' },
      { label: 'Состав', value: 'Хлопок' },
      { label: 'Сезон', value: 'Круглый год' },
      { label: 'Уход', value: 'Машинная стирка, 30 °C' },
    ],
  },
  {
    slug: 'futbolka-mamina-dochka',
    title: 'Футболка «мамина дочка»',
    price: 600,
    oldPrice: 650,
    gender: 'girls',
    material: 'cotton',
    image: tshirt,
    alt: 'Розовая детская футболка',
    categories: ['novinki', 'akcii'],
    sizes: ['104', '110', '116', '122'],
    colors: ['Розовый'],
    params: [
      { label: 'Пол', value: 'Для девочек' },
      { label: 'Состав', value: 'Хлопок' },
      { label: 'Рукав', value: 'Короткий' },
      { label: 'Уход', value: 'Машинная стирка, 40 °C' },
    ],
  },
  {
    slug: 'rubashka-delovoy-paren',
    title: 'Рубашка «деловой парень»',
    price: 800,
    oldPrice: 1750,
    gender: 'boys',
    material: 'synthetic',
    image: shirt,
    alt: 'Чёрная детская рубашка',
    categories: ['akcii'],
    sizes: ['110', '116', '122', '128'],
    colors: ['Чёрный'],
    params: [
      { label: 'Пол', value: 'Для мальчиков' },
      { label: 'Состав', value: 'Полиэстер' },
      { label: 'Застёжка', value: 'Кнопки' },
      { label: 'Уход', value: 'Машинная стирка, 30 °C' },
    ],
  },
  {
    slug: 'lasty-iskupnis',
    title: 'Ласты «искупнись»',
    price: 600,
    oldPrice: 650,
    gift: true,
    saleEndsAt: '2026-09-28T14:00:00+03:00',
    gender: 'boys',
    material: 'synthetic',
    image: flippers,
    alt: 'Бирюзовые детские ласты',
    categories: ['kupalniki', 'akcii'],
    sizes: ['28—30', '30—32', '32—34'],
    colors: ['Бирюзовый'],
    params: [
      { label: 'Пол', value: 'Для мальчиков' },
      { label: 'Состав', value: 'Полиэстер' },
      { label: 'Состав подошвы', value: 'Резина' },
      { label: 'Уход', value: 'Вода, моющие средства' },
    ],
  },
]

export const PRICE_LIMITS = { min: 190, max: 2000 } as const

export const PER_PAGE = 3

export const categoryBySlug = (slug: string): Category | undefined =>
  slug === ROOT_CATEGORY.slug
    ? ROOT_CATEGORY
    : CATEGORIES.find((category) => category.slug === slug)

export const productsOf = (slug: string): Product[] =>
  slug === ROOT_CATEGORY.slug
    ? PRODUCTS
    : PRODUCTS.filter((product) => product.categories.includes(slug))

export const productBySlug = (slug: string): Product | undefined =>
  PRODUCTS.find((product) => product.slug === slug)

export const hrefOf = (product: Product): string => `/product/${product.slug}/`

export const POPULAR: Product[] = PRODUCTS.slice(0, 3)

export const RECENT: Product[] = PRODUCTS.slice(3)

export const alsoBought = (slug: string): Product[] =>
  PRODUCTS.filter((product) => product.slug !== slug).slice(0, 3)
