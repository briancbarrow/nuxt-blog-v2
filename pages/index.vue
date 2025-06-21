<script setup lang="ts">
const { data: posts } = await useAsyncData("blog", () =>
  queryCollection("blog").order("date", "DESC").all()
);

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
</script>

<template>
  <div class="bg-gray-50 text-slate-800">
    <!-- About Me Summary -->
    <div class="bg-gray-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="flex flex-col lg:flex-row gap-12 items-center">
          <div class="lg:w-1/3">
            <div class="bg-gray-300 rounded-full w-48 h-48 mx-auto">
              <img
                src="/images/avatar.jpeg"
                alt="Profile"
                class="rounded-full h-48 w-48 object-cover"
              />
            </div>
          </div>
          <div class="lg:w-2/3 text-center lg:text-left">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">About Me</h2>
            <p class="text-lg text-gray-700 mb-4">
              I'm a full stack web developer with experience in JavaScript,
              Python, Go, and recently Elixir. I'm passionate about community
              building and helping others grow in tech.
            </p>
            <p class="text-lg text-gray-700 mb-6">
              As an organizer for the UtahJS conference and founder of a coding
              study group in Salt Lake City, I enjoy creating opportunities for
              developers to learn and connect. I recently rebooted the Utah
              Elixir meetup group to share my enthusiasm for functional
              programming.
            </p>
            <NuxtLink
              to="/about"
              class="inline-block px-6 py-3 bg-slate-700 text-white font-medium rounded-md hover:bg-slate-800 transition-colors"
            >
              Learn More About Me
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900">Blog Posts</h2>
          <!--
          <p class="mt-4 text-lg text-gray-600">
            My latest insights and tutorials
          </p>
          -->
        </div>
        <ul class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <li
            v-for="post in posts"
            :key="post.path"
            class="bg-white rounded-lg shadow overflow-hidden"
          >
            <div class="bg-blue-100 h-48 flex items-center justify-center">
              <img
                :src="'/' + post.img"
                alt="Article thumbnail"
                class="h-full w-full object-cover"
              />
            </div>
            <div class="p-6">
              <time
                v-if="post.date"
                class="text-sm text-gray-500 dark:text-gray-400 mt-1 block"
              >
                {{ formatDate(post.date) }}
              </time>
              <h3 class="text-xl font-bold mb-2">
                {{ post.title }}
              </h3>
              <p class="text-gray-600 mb-4">
                {{ post.description }}
              </p>
              <NuxtLink
                :to="post.path"
                class="text-blue-600 hover:text-blue-800 font-medium"
              >
                Read more →
              </NuxtLink>
            </div>
          </li>
        </ul>
        <!--
        <div class="text-center mt-12">
          <NuxtLink
            to="/articles"
            class="inline-block px-6 py-3 bg-slate-700 text-white font-medium rounded-md hover:bg-slate-800 transition-colors"
          >
            View All Articles
          </NuxtLink>
        </div>
        -->
      </div>
    </div>
  </div>
</template>
