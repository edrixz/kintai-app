<script setup lang="ts">
import { ref, watch } from 'vue';
import { WORK_TYPE_OPTIONS, QUICK_FILL_PRESETS } from "~/constants/kintai";

const store = useKintaiStore();
const selectedQuickFill = ref('custom');

watch(selectedQuickFill, (newVal) => {
  const presetEntry = QUICK_FILL_PRESETS.find(p => p.value === newVal);
  if (presetEntry && presetEntry.preset) {
    const p = presetEntry.preset;
    store.preset.workTypeCode = p.workTypeCode as any;
    store.preset.startHour = p.startHour;
    store.preset.startMinute = p.startMinute;
    store.preset.endHour = p.endHour;
    store.preset.endMinute = p.endMinute;
    store.preset.isTelework = p.isTelework;
  }
});
</script>

<template>
  <KintaiCard title="Time & Work Type" icon="i-heroicons-clock" class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/20 shadow-xl ring-1 ring-gray-200 dark:ring-gray-800">
    <div class="mb-6">
      <BaseSelect
        v-model="selectedQuickFill"
        :options="QUICK_FILL_PRESETS"
        label="Quick Fill Preset"
      />
    </div>
    
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

    <BaseTextarea
      v-model="store.preset.comment"
      label="Comment"
      placeholder="Optional notes for today..."
    />
  </KintaiCard>
</template>
