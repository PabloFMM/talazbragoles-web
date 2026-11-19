// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeGuias from './src/lib/rehype-guias.mjs';

export default defineConfig({
  site: 'https://www.talazbragoles.com',
  // Tablas apilables a 320 px y sin «# Título» duplicado en las guías (ver el archivo).
  markdown: { rehypePlugins: [rehypeGuias] },
  // /diseno/ es interna (noindex): fuera del sitemap.
  integrations: [sitemap({ filter: (page) => !page.includes('/diseno') })],
});
