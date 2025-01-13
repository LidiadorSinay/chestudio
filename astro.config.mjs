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
  adapter: netlify(),
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  },
  integrations: [
    netlify(),
    tailwind(),
    mdx(),
    sitemap({
      site: "https://chestudio.com", // Tu URL de producción
      changefreq: "weekly",         // Frecuencia de actualización
      priority: 0.8,                // Prioridad de las páginas
      exclude: [],                  // No excluyas ninguna página, a menos que quieras
      pages: [
        "/publicaciones",           
        "/novedades",   
        "/novedad/0",
        "/novedad/1"           
      ],
    })
  ],
});
