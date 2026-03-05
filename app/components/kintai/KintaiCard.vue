<script setup lang="ts">
/**
 * A wrapper component for Kintai sections using Nuxt UI UCard.
 * @props title - The heading text for the section.
 * @props icon - Heroicon name to display next to the title.
 */
defineProps<{
  title: string;
  icon?: string;
}>();
</script>

<template>
  <UCard :ui="{ body: 'p-5 sm:p-8', header: 'p-2 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 rounded-t-xl backdrop-blur' }" class="mb-6 rounded-xl transition-shadow hover:shadow-2xl">
    <template #header>
      <div class="flex items-center gap-3">
        <div v-if="icon" class="flex items-center justify-center w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400">
          <UIcon :name="icon" class="w-6 h-6" />
        </div>
        <h3 class="font-black text-lg text-gray-900 dark:text-gray-100 tracking-tight">{{ title }}</h3>
      </div>
    </template>

    <slot />
  </UCard>
</template>
