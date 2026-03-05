// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  // Enable Nuxt 4 features and directory structure
  future: {
    compatibilityVersion: 4,
  },
  // Core modules for UI, State Management, and Utilities
  modules: ["@nuxt/ui", "@pinia/nuxt", "@vueuse/nuxt"],
  // TypeScript strict mode configuration
  typescript: {
    strict: true,
    typeCheck: false,
  },
  css: ["./app/assets/css/main.css"],
  // Auto-import Pinia stores
  imports: {
    dirs: ["stores"],
  },
  vite: {
    plugins: [tailwindcss() as any],
  },
  devtools: { enabled: true },
});
