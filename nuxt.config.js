// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
    },
  },
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
  modules: ['@pinia/nuxt', 'nuxt-icon', '@nuxtjs/supabase'],
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