<script setup lang="ts">
import type { z } from "zod";

const store = useKintaiStore();
</script>

<template>
  <KintaiCard title="Authentication" icon="i-heroicons-lock-closed" class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/20 shadow-xl ring-1 ring-gray-200 dark:ring-gray-800">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <UFormField label="Staff ID" name="loginId" required class="w-full">
        <UInput
          v-model="store.preset.loginId"
          placeholder="E0001234"
          icon="i-heroicons-user"
          size="lg"
          variant="outline"
          class="w-full transition-all duration-300 hover:ring-primary-500/50 focus:ring-primary-500"
        />
      </UFormField>
      <UFormField label="Password" name="password" required class="w-full">
        <UInput
          type="password"
          placeholder="••••••••"
          icon="i-heroicons-key"
          size="lg"
          variant="outline"
          class="w-full transition-all duration-300 hover:ring-primary-500/50 focus:ring-primary-500"
          :model-value="$attrs.password as string"
          @update:model-value="$emit('update:password', $event)"
        />
      </UFormField>
    </div>
  </KintaiCard>
</template>
