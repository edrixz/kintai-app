<script setup lang="ts">
import { WORK_TYPE_OPTIONS } from "~/constants/kintai";

const store = useKintaiStore();
</script>

<template>
  <KintaiCard title="Time & Work Type" icon="i-heroicons-clock" class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/20 shadow-xl ring-1 ring-gray-200 dark:ring-gray-800">
    <div class="grid grid-cols-3 gap-6 mb-6">
      <BaseInput
        v-model="store.preset.year"
        label="Year"
      />
      <BaseInput
        v-model="store.preset.month"
        label="Month"
      />
      <BaseInput
        v-model="store.preset.day"
        label="Day"
        placeholder="Today"
      />
    </div>

    <div class="grid grid-cols-2 gap-6 mb-6">
      <BaseSelect
        v-model="store.preset.workTypeCode"
        :options="WORK_TYPE_OPTIONS"
        label="Work Type"
      />
      <div class="flex items-center pt-6"> <!-- Aligns with the input visually -->
        <BaseCheckbox
          v-model="store.preset.isTelework"
          label="Telework (在宅)"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-6 mb-6">
      <div class="flex flex-col gap-1.5 w-full">
        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
          <span>Start Time</span>
        </label>
        <div class="flex items-center gap-3">
          <BaseInput
            v-model="store.preset.startHour"
            placeholder="09"
          />
          <span class="text-gray-500 font-bold">:</span>
          <BaseInput
            v-model="store.preset.startMinute"
            placeholder="45"
          />
        </div>
      </div>
      
      <div class="flex flex-col gap-1.5 w-full">
        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
          <span>End Time</span>
        </label>
        <div class="flex items-center gap-3">
          <BaseInput 
            v-model="store.preset.endHour" 
            placeholder="18"
          />
          <span class="text-gray-500 font-bold">:</span>
          <BaseInput
            v-model="store.preset.endMinute"
            placeholder="45"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-1.5 w-full">
      <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
        <span>Comment</span>
      </label>
      <div class="relative flex items-center w-full transition-all duration-300 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border rounded-xl overflow-hidden border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/20">
        <textarea
          v-model="store.preset.comment"
          class="w-full min-h-[100px] py-2.5 px-3.5 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base resize-y"
          placeholder="Optional notes for today..."
        ></textarea>
      </div>
    </div>
  </KintaiCard>
</template>
