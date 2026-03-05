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

const state = reactive({
  loginId: store.preset.loginId,
  password: "satnhanVD12"
});

watch(() => state.loginId, (val) => {
  store.preset.loginId = val;
});

const schema = z.object({
  loginId: z.string().min(1, "Staff ID is required"),
  password: z.string().min(1, "Password is required")
});

onMounted(() => {
  syncToCurrentDate();
  state.loginId = store.preset.loginId; // sync from store logic
});

const onAction = async () => {
  const ok = await submitKintai(state.password);
  toast.add({
    title: ok ? "Success" : "Failed",
    color: ok ? "success" : "error",
    icon: ok ? "i-heroicons-check-circle" : "i-heroicons-x-circle",
  });
};
</script>

<template>
  <div class="min-h-screen relative overflow-hidden flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-950">
    <!-- Decorative Background Elements -->
    <div class="absolute top-0 inset-x-0 h-96 bg-linear-to-b from-primary-500/10 to-transparent pointer-events-none"></div>
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <UContainer class="relative z-10 max-w-2xl w-full">
      <header class="mb-10 text-center animate-fade-in-down">
        <h1 class="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 tracking-tight pb-2 drop-shadow-sm">
          Edrixx Space
        </h1>
        <p class="text-base md:text-lg text-gray-600 dark:text-gray-400 font-medium">Auto Kintai Tool for Windows & Web</p>
      </header>

      <UForm :schema="schema" :state="state" @submit="onAction" class="space-y-6 animate-fade-in-up">
        
        <KintaiAuthSection v-model:password="state.password" />

        <KintaiTimeSection />

        <KintaiLogSection :logs="logs" :is-loading="isLoading" />

      </UForm>
    </UContainer>
  </div>
</template>
