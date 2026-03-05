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

    <BaseButton
      type="submit"
      block
      :loading="isLoading"
      icon="i-heroicons-paper-airplane"
    >
      Submit to Portal
    </BaseButton>
  </KintaiCard>
</template>
