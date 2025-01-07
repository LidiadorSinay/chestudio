// content/config.ts
import { z, defineCollection } from "astro:content";

const novedadesCollection = defineCollection({
  schema: z.object({
    titulo: z.string(),
    subtitulo: z.string(),
    fecha: z.string().transform((str) => new Date(str)),
    contenido: z.string(),  // O puedes usar `z.object()` si necesitas un contenido más estructurado
  }),
});

export const collections = {
  novedades: novedadesCollection,  // Definir la colección 'novedades'
};
