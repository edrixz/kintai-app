<script setup lang="ts">
import { reactive, watch, onMounted } from "vue";
import { z } from "zod";
import { useKintaiSubmit } from "~/composables/kintai/useKintaiSubmit";
import { useKintaiSync } from "~/composables/kintai/useKintaiSync";
import { WORK_TYPE_OPTIONS } from "~/constants/kintai";

const store = useKintaiStore();
const { submitKintai, isLoading, logs } = useKintaiSubmit();
const { syncToCurrentDate } = useKintaiSync();
const toast = useToast();

// Schema removed since validations are handled within components or prior to API call

onMounted(() => {
  syncToCurrentDate();
});

const onAction = async () => {
  const ok = await submitKintai();
  toast.add({
    title: ok ? "Success" : "Failed",
    color: ok ? "success" : "error",
    icon: ok ? "i-heroicons-check-circle" : "i-heroicons-x-circle",
  });
};
</script>

<template>
  <div class="animate-fade-in-up">
    <div class="mb-8">
      <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Submit Kintai</h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Fill in your work details below.</p>
    </div>

    <!-- State object can just be preset directly now for the form -->
    <UForm :state="store.preset" @submit="onAction" class="space-y-6">
      
      <KintaiTimeSection />

      <KintaiLogSection :logs="logs" :is-loading="isLoading" />

    </UForm>
  </div>
</template>
