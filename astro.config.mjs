// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.talazbragoles.com',
  // /diseno/ es interna (noindex): fuera del sitemap.
  integrations: [sitemap({ filter: (page) => !page.includes('/diseno') })],
  vite: {
    plugins: [tailwindcss()],
  },
});
