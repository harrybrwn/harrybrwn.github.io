import { z, defineCollection } from "astro:content";

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    pubDate: z.date().optional(),
    blog: z.boolean().optional(),
    draft: z.boolean().optional(),
  }),
});

const garden = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()),
    pubDate: z.date().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = {
  blog,
  garden,
};
