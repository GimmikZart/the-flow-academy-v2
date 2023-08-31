// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    },
  },
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  modules: ['nuxt-icon', '@pinia/nuxt','@nuxtjs/supabase'],
  cloudinary: {
    cloudName: 'dbquiu1jo',
  },
  css: [
    "primevue/resources/themes/lara-light-blue/theme.css",
    '~/assets/css/main.css',
    '~/assets/css/utils.scss',
  ],
  build: {
    transpile: ["primevue"]
  },
  router: {
    linkActiveClass: "active-link",
    linkExactActiveClass: "exact-active-link",
  },
  imports: {
    dirs: [
      // Scan top-level modules
      'composables',
      // ... or scan modules nested one level deep with a specific name and file extension
      'composables/*/index.{ts,js,mjs,mts}',
      // ... or scan all modules within given directory
      'composables/**'
    ]
  }
})