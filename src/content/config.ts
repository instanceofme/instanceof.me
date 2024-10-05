import { z, defineCollection } from "astro:content";

const articleCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    group: z.string(),
    date: z.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  article: articleCollection,
};