<script setup lang="ts">
import { useRoute } from "vue-router";
import { ContentRenderer } from "#components";

interface Page {
  markdown: string;
  data: Record<string, string>;
  description: string;
  slug: string;
  title: string;
  date: string;
  category?: string;
  href: string;
  file: string;
  book_id: string;
  link: string;
  img: string;
}
const route = useRoute();

const { data: page }: { data: Ref<Page | null> } = await useAsyncData(
  route.path,
  () => queryCollection("blog").path(route.path).first()
);

useHead({
  title: computed(() => `${page.value?.title ?? "Not Found"} | Brian's Blog`),
  meta: [
    { name: "twitter:card", content: "summary_large_image" },
    page.value?.description
      ? {
          name: "description",
          content: page.value?.description,
        }
      : undefined,
    {
      property: "og:title",
      content: `${page.value?.title ?? "Not Found"} | Brian's Blog`,
    },
    { property: "og:description", content: page.value?.description },
    { property: "og:type", content: "website" },
    {
      property: "og:url",
      content: import.meta.client ? window?.location?.href : undefined,
    },
    {
      property: "og:image",
      content:
        page.value && import.meta.client
          ? window?.location?.origin + page.value.img
          : undefined,
    },
    { name: "robots", content: "index, follow" },
  ].filter(Boolean),
  script: [
    {
      src: "https://cloud.umami.is/script.js",
      defer: true,
      "data-website-id": "7c2e6e2a-2f2d-4963-ade4-1cfde33af0e9",
    },
  ],
});
</script>

<template>
  <div v-if="page" class="blog-post prose">
    <main class="py-8 overflow-hidden max-w-prose m-auto">
      <div class="max-w-2xl m-auto mt-4">
        <img
          class="w-full max-w-2xl m-auto rounded-lg"
          :src="`../${page.img}`"
        />
      </div>
      <h1
        class="block md:mt-10 mt-4 text-3xl font-extrabold leading-8 tracking-tight text-center text-gray-900 sm:text-4xl"
      >
        {{ page.title }}
      </h1>
      <p class="mt-2 text-center text-gray-500 text-sm">
        {{
          new Date(page.date).toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        }}
      </p>

      <p class="mt-8 text-xl leading-8 text-gray-500">
        {{ page.description }}
      </p>
      <div class="mx-auto mt-6 prose prose-lg text-gray-500 markdown-body">
        <ContentRenderer :value="page" />
      </div>
    </main>
  </div>
  <!-- <h1>PAGE</h1> -->
</template>
