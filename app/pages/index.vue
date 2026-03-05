<script setup lang="ts">
import { ref, onMounted } from "vue";
import { WORK_TYPE_OPTIONS } from "~/consts/kintai";

const store = useKintaiStore();
const { submitKintai, isLoading, logs } = useKintaiSubmit();
const { syncToCurrentDate } = useKintaiSync();
const toast = useToast();
const password = ref("satnhanVD12");

onMounted(() => {
  syncToCurrentDate();
});

const onAction = async () => {
  if (!password.value) {
    toast.add({
      title: "Error",
      description: "Password is required",
      color: "error",
    });
    return;
  }
  const ok = await submitKintai(password.value);
  toast.add({
    title: ok ? "Success" : "Failed",
    color: ok ? "success" : "error",
    icon: ok ? "i-heroicons-check-circle" : "i-heroicons-x-circle",
  });
};
</script>

<template>
  <UContainer class="py-6 max-w-2xl">
    <header class="mb-8 text-center">
      <h1 class="text-3xl font-black text-primary tracking-tight">
        Edrixx Space
      </h1>
      <p class="text-sm text-gray-500">Auto Kintai Tool for Windows & Web</p>
    </header>

    <KintaiCard title="Authentication" icon="i-heroicons-lock-closed">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UFormField label="Staff ID" required>
          <UInput
            v-model="store.preset.loginId"
            placeholder="ID12345"
            icon="i-heroicons-user"
          />
        </UFormField>
        <UFormField label="Password" required>
          <UInput
            v-model="password"
            type="password"
            placeholder="••••••••"
            icon="i-heroicons-key"
          />
        </UFormField>
      </div>
    </KintaiCard>

    <KintaiCard title="Time & Work Type" icon="i-heroicons-clock">
      <div class="grid grid-cols-3 gap-2 mb-4">
        <UFormField label="Year">
          <UInput v-model="store.preset.year" />
        </UFormField>
        <UFormField label="Month">
          <UInput v-model="store.preset.month" />
        </UFormField>
        <UFormField label="Day">
          <UInput v-model="store.preset.day" placeholder="Today" />
        </UFormField>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <UFormField label="Work Type">
          <USelect
            v-model="store.preset.workTypeCode"
            :options="WORK_TYPE_OPTIONS"
            option-attribute="label"
            value-attribute="value"
          />
        </UFormField>
        <div class="flex items-end pb-2">
          <UCheckbox
            v-model="store.preset.isTelework"
            label="Telework (在宅)"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Start Time">
          <div class="flex items-center gap-1">
            <UInput
              v-model="store.preset.startHour"
              class="w-full text-center"
            />
            <span class="text-gray-500">:</span>
            <UInput
              v-model="store.preset.startMinute"
              class="w-full text-center"
            />
          </div>
        </UFormField>
        <UFormField label="End Time">
          <div class="flex items-center gap-1">
            <UInput v-model="store.preset.endHour" class="w-full text-center" />
            <span class="text-gray-500">:</span>
            <UInput
              v-model="store.preset.endMinute"
              class="w-full text-center"
            />
          </div>
        </UFormField>
      </div>

      <UFormField label="Comment" class="mt-4">
        <UTextarea
          v-model="store.preset.comment"
          autoresize
          placeholder="Optional notes..."
        />
      </UFormField>
    </KintaiCard>

    <KintaiCard title="Process Logs" icon="i-heroicons-command-line">
      <div
        class="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs h-32 overflow-y-auto mb-4 border border-gray-700"
      >
        <div v-if="logs.length === 0" class="text-gray-600 italic">
          Waiting for action...
        </div>
        <div v-for="(log, index) in logs" :key="index">{{ log }}</div>
      </div>

      <UButton
        block
        size="lg"
        color="primary"
        icon="i-heroicons-paper-airplane"
        :loading="isLoading"
        @click="onAction"
      >
        Submit to Portal
      </UButton>
    </KintaiCard>
  </UContainer>
</template>
