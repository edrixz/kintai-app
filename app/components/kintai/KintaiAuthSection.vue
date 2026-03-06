<script setup lang="ts">
import { computed } from "vue";

const store = useKintaiStore();

const password = computed({
  get: () => store.preset.password || '',
  set: (val) => { store.preset.password = val; }
});
</script>

<template>
  <KintaiCard title="Authentication" icon="i-heroicons-lock-closed" class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/20 shadow-xl ring-1 ring-gray-200 dark:ring-gray-800">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <BaseInput
        v-model="store.preset.loginId"
        label="Staff ID"
        placeholder="E0001234"
        icon="i-heroicons-user"
        required
      />
      
      <BaseInput
        v-model="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        icon="i-heroicons-key"
        required
      />
    </div>
  </KintaiCard>
</template>
