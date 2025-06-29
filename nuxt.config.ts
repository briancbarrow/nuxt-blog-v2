// https://nuxt.com/docs/api/configuration/nuxt-config
// import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  devServer: {
    port: 8000,
  },
  ssr: false,
  css: ["~/assets/styles.css"],
  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/test-utils",
    "@nuxt/ui",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxtjs/tailwindcss",
  ],
  // vite: {
  //   plugins: [
  //     tailwindcss(),
  //   ]
  // },
  content: {
    build: {
      pathMeta: {
        slugifyOptions: {
          remove: /^\/tech/,
        },
      },
      markdown: {
        highlight: {
          theme: "github-dark",
          langs: ["bash", "javascript", "typescript", "json", "css", "elm"],
        },
      },
    },
  },
});
