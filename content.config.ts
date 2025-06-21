import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      source: "blog/*.md",

      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.coerce.date().optional(),
        tags: z.array(z.string()).optional(),
        img: z.string().optional(),
        published: z.boolean().default(false),
      }),
    }),
  },
});
