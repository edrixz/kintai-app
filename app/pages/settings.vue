<script setup lang="ts">
import { useToast } from '#imports'

const toast = useToast()

const saveSettings = () => {
  // Pinia store is automatically persisted to local storage via useLocalStorage
  toast.add({
    title: 'Settings Saved',
    description: 'Your configuration has been saved locally.',
    icon: 'i-heroicons-check-circle',
    color: 'success'
  })
}
</script>

<template>
  <div class="space-y-6 animate-fade-in-up">
    <div>
      <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Settings</h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Manage your Kintai credentials and persistent configurations.</p>
    </div>

    <!-- The Auth section binds directly to the persistent store now -->
    <KintaiAuthSection />

    <!-- The Preset Management section binds directly to RxDB -->
    <KintaiPresetManagementSection />

    <div class="flex justify-end pt-4">
      <BaseButton
        type="button"
        icon="i-heroicons-document-check"
        @click="saveSettings"
      >
        Save Configuration
      </BaseButton>
    </div>
  </div>
</template>
