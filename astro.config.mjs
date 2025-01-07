import { defineConfig } from "astro/config";
import netlify from '@astrojs/netlify';
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: "https://chestudio.com",
  output: "server",
  output: 'server',
  adapter: netlify(),
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  },
  integrations: [netlify(),tailwind(), mdx(), sitemap()],
});