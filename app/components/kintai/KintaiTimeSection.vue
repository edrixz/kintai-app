<script setup lang="ts">
import { WORK_TYPE_OPTIONS } from "~/constants/kintai";

const store = useKintaiStore();
</script>

<template>
  <KintaiCard title="Time & Work Type" icon="i-heroicons-clock" class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/20 shadow-xl ring-1 ring-gray-200 dark:ring-gray-800">
    <div class="grid grid-cols-3 gap-6 mb-6">
      <UFormField label="Year" class="w-full">
        <UInput v-model="store.preset.year" size="lg" class="w-full" />
      </UFormField>
      <UFormField label="Month" class="w-full">
        <UInput v-model="store.preset.month" size="lg" class="w-full" />
      </UFormField>
      <UFormField label="Day" class="w-full">
        <UInput v-model="store.preset.day" placeholder="Today" size="lg" class="w-full" />
      </UFormField>
    </div>

    <div class="grid grid-cols-2 gap-6 mb-6">
      <UFormField label="Work Type" class="w-full">
        <USelectMenu
          v-model="store.preset.workTypeCode"
          :items="WORK_TYPE_OPTIONS"
          option-attribute="label"
          value-attribute="value"
          size="lg"
          class="w-full"
        />
      </UFormField>
      <div class="flex items-center pt-6"> <!-- Aligns with the input visually -->
        <UCheckbox
          v-model="store.preset.isTelework"
          label="Telework (在宅)"
          color="primary"
          class="font-medium"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-6 mb-6">
      <UFormField label="Start Time" class="w-full">
        <div class="flex items-center gap-3">
          <UInput
            v-model="store.preset.startHour"
            class="w-full text-center"
            size="lg"
            placeholder="09"
          />
          <span class="text-gray-500 font-bold">:</span>
          <UInput
            v-model="store.preset.startMinute"
            class="w-full text-center"
            size="lg"
            placeholder="45"
          />
        </div>
      </UFormField>
      <UFormField label="End Time" class="w-full">
        <div class="flex items-center gap-3">
          <UInput 
            v-model="store.preset.endHour" 
            class="w-full text-center" 
            size="lg" 
            placeholder="18"
          />
          <span class="text-gray-500 font-bold">:</span>
          <UInput
            v-model="store.preset.endMinute"
            class="w-full text-center"
            size="lg"
            placeholder="45"
          />
        </div>
      </UFormField>
    </div>

    <UFormField label="Comment">
      <UTextarea
        v-model="store.preset.comment"
        autoresize
        placeholder="Optional notes for today..."
        size="lg"
        class="transition-all duration-300 hover:ring-primary-500/50 focus:ring-primary-500"
      />
    </UFormField>
  </KintaiCard>
</template>
