<script setup lang="ts">
defineProps<{
  logs: string[];
  isLoading: boolean;
}>();
</script>

<template>
  <KintaiCard title="Process Logs" icon="i-heroicons-command-line" class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/20 shadow-xl ring-1 ring-gray-200 dark:ring-gray-800">
    <div
      class="bg-gray-950 text-green-400 p-4 rounded-xl font-mono text-sm h-40 overflow-y-auto mb-6 shadow-inner ring-1 ring-white/10"
    >
      <div v-if="logs.length === 0" class="text-gray-500 italic flex items-center justify-center h-full">
        // Waiting for action...
      </div>
      <div v-for="(log, index) in logs" :key="index" class="mb-1 opacity-90 hover:opacity-100 transition-opacity">
        <span class="text-gray-500 mr-2">></span>{{ log }}
      </div>
    </div>

    <UButton
      type="submit"
      block
      size="xl"
      color="primary"
      variant="solid"
      :loading="isLoading"
      class="font-bold tracking-wide shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
    >
      <template #leading>
        <UIcon name="i-heroicons-paper-airplane" class="w-5 h-5" />
      </template>
      Submit to Portal
    </UButton>
  </KintaiCard>
</template>
