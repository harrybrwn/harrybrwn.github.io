import { z, defineCollection } from "astro:content";

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.enum([
      "goals",
      "golang",
      "journal",
      "opinion",
      "tech",
      "web",
    ])),
    pubDate: z.date(),
    modDate: z.date().optional(),
    blog: z.boolean().optional(),
    draft: z.boolean().optional(),
  }),
});

const garden = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.enum([
      "computer-science",
      "hobbies",
      "homelab",
      "ideas",
      "kubernetes",
      "opsec",
      "philosophy",
      "programming",
      "security",
    ])),
    pubDate: z.date(),
    modDate: z.date().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = {
  blog,
  garden,
};
