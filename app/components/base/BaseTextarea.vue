<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  modelValue: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const isFocused = ref(false);

const onInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label v-if="label" class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
      <span>{{ label }} <span v-if="required" class="text-red-500">*</span></span>
    </label>
    <div 
      class="relative flex items-center w-full transition-all duration-300 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border rounded-xl overflow-hidden"
      :class="[
        isFocused 
          ? 'border-sky-500 ring-4 ring-sky-500/20 dark:border-sky-400 dark:ring-sky-400/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      ]"
    >
      <textarea
        :value="modelValue"
        @input="onInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :placeholder="placeholder"
        class="w-full min-h-[100px] py-2.5 px-3.5 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base resize-y"
      ></textarea>
    </div>
  </div>
</template>
