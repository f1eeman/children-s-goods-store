import { defineConfig, fontProviders } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://example.invalid',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/search') && !page.includes('/cart'),
    }),
  ],
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Comfortaa',
      cssVariable: '--font-comfortaa',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            weight: 400,
            style: 'normal',
            src: ['./src/assets/fonts/comfortaa-400.woff2'],
          },
          {
            weight: 500,
            style: 'normal',
            src: ['./src/assets/fonts/comfortaa-500.woff2'],
          },
          {
            weight: 600,
            style: 'normal',
            src: ['./src/assets/fonts/comfortaa-600.woff2'],
          },
          {
            weight: 700,
            style: 'normal',
            src: ['./src/assets/fonts/comfortaa-700.woff2'],
          },
        ],
      },
    },
  ],
})
