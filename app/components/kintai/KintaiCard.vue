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
  <UCard :ui="{ body: 'p-4 sm:p-6', header: 'p-4' }" class="mb-4">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon v-if="icon" :name="icon" class="w-5 h-5 text-primary" />
        <h3 class="font-bold text-gray-900 dark:text-white">{{ title }}</h3>
      </div>
    </template>

    <slot />
  </UCard>
</template>
