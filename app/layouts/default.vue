<script setup lang="ts">
import { ref } from 'vue'

const store = useKintaiStore()
const isSidebarOpen = ref(false)

const navigation = [
  { name: 'Home', to: '/', icon: 'i-heroicons-home' },
  { name: 'Settings', to: '/settings', icon: 'i-heroicons-cog-8-tooth' },
]
</script>

<template>
  <div class="min-h-screen relative overflow-hidden bg-linear-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-950 flex flex-col">
    <!-- Global Decorative Background Elements -->
    <div class="fixed top-0 inset-x-0 h-96 bg-linear-to-b from-sky-500/10 to-transparent pointer-events-none z-0"></div>
    <div class="fixed -top-40 -right-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>
    <div class="fixed -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>

    <!-- Custom Sidebar Overlay -->
    <transition
      enter-active-class="transition-opacity duration-300 ease-linear"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-linear"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-show="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-gray-900/50 backdrop-blur-xs z-40"></div>
    </transition>

    <!-- Custom Sidebar Panel -->
    <div
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-800 flex flex-col',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <span class="text-lg font-bold text-gray-900 dark:text-white">Navigation</span>
        <button @click="isSidebarOpen = false" class="text-gray-400 hover:text-gray-500 focus:outline-none">
          <UIcon name="i-heroicons-x-mark" class="h-6 w-6" />
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <NuxtLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.to"
          @click="isSidebarOpen = false"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200"
          active-class="bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400"
          inactive-class="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <UIcon :name="item.icon" class="w-5 h-5 shrink-0" />
          {{ item.name }}
        </NuxtLink>
      </div>
    </div>

    <!-- Header Navigation Bar -->
    <header class="sticky top-0 z-40 w-full backdrop-blur-md bg-white/75 dark:bg-gray-900/75 border-b border-gray-200 dark:border-gray-800 shadow-sm flex-none">
      <div class="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <!-- Hamburger Menu Button -->
            <button
              @click="isSidebarOpen = true"
              class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 transition-colors"
              aria-label="Open sidebar"
            >
              <UIcon name="i-heroicons-bars-3" class="h-6 w-6" aria-hidden="true" />
            </button>

            <div class="text-xl font-black text-transparent bg-clip-text bg-linear-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 tracking-tight select-none">
              Edrixx Space
            </div>
          </div>
          
          <div class="flex items-center">
            <!-- User ID Display -->
            <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-inner">
              <UIcon name="i-heroicons-user-circle" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ store.preset.loginId || 'Guest' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 relative z-10 w-full overflow-y-auto">
      <div class="py-10 px-4 sm:px-6 lg:px-8 mx-auto w-full max-w-7xl">
        <slot />
      </div>
    </main>
  </div>
</template>
