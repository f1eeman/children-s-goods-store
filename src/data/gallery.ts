import type { ImageMetadata } from 'astro'

import bannerPromo from '@/img/banner-promo.jpg'
import bannerDelivery from '@/img/banner-delivery.jpg'
import promoNewyear from '@/img/promo-newyear.jpg'
import categorySale from '@/img/category-sale.jpg'
import categoryNew from '@/img/category-new.jpg'
import categoryHats from '@/img/category-hats.jpg'
import categorySwimwear from '@/img/category-swimwear.jpg'
import productHatOwl from '@/img/product-hat-owl.jpg'
import productBodysuitCloud from '@/img/product-bodysuit-cloud.jpg'
import productPajamaAcorns from '@/img/product-pajama-acorns.jpg'
import productTshirtMama from '@/img/product-tshirt-mama.jpg'
import productShirtBusiness from '@/img/product-shirt-business.jpg'
import productFlippers from '@/img/product-flippers.png'

export interface Shot {
  image: ImageMetadata
  caption: string
}

export const GALLERY: { lead: string; items: Shot[] } = {
  lead: 'Баннеры сайта, разделы каталога и вещи вблизи. Понравилась вещь — позвоните или напишите: заказ оформляем по телефону и почте.',
  items: [
    {
      image: bannerPromo,
      caption: 'Промо-баннер главной страницы: с него начинается сайт.',
    },
    {
      image: bannerDelivery,
      caption:
        'Баннер о доставке: «Доставка почтой бесплатная при заказе от 5000 рублей».',
    },
    {
      image: promoNewyear,
      caption: 'Баннер «Новогодние скидки 10%».',
    },
    {
      image: categorySale,
      caption: 'Раздел акций: «Чёрная пятница на всю коллекцию!», скидка 40%.',
    },
    {
      image: categoryNew,
      caption: 'Раздел новинок: то, что приехало в магазин последним.',
    },
    {
      image: categoryHats,
      caption: 'Раздел шапок.',
    },
    {
      image: categorySwimwear,
      caption: 'Раздел купальников: для бассейна и моря.',
    },
    {
      image: productHatOwl,
      caption: 'Шапка «Совенок вязанный» — 800 ₽.',
    },
    {
      image: productBodysuitCloud,
      caption: 'Боди «Белое облачко» — 600 ₽.',
    },
    {
      image: productPajamaAcorns,
      caption: 'Пижама «желуди» — 1800 ₽.',
    },
    {
      image: productTshirtMama,
      caption: 'Футболка «мамина дочка» — 600 ₽.',
    },
    {
      image: productShirtBusiness,
      caption: 'Рубашка «деловой парень» — 800 ₽.',
    },
    {
      image: productFlippers,
      caption: 'Ласты «искупнись» — 600 ₽.',
    },
  ],
}
