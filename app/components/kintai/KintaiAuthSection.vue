<script setup lang="ts">
import type { z } from "zod";

const store = useKintaiStore();
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
        :model-value="$attrs.password as string"
        @update:model-value="$emit('update:password', $event)"
        type="password"
        label="Password"
        placeholder="••••••••"
        icon="i-heroicons-key"
        required
      />
    </div>
  </KintaiCard>
</template>
