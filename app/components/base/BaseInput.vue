<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  modelValue: string | number;
  label?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  placeholder?: string;
  icon?: string;
  required?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();

const isFocused = ref(false);
const showPassword = ref(false);

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password';
  }
  return props.type || 'text';
});

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
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
      <div v-if="icon" class="pl-3.5 pr-1.5 flex items-center justify-center text-gray-400 dark:text-gray-500">
        <UIcon :name="icon" class="w-5 h-5 transition-colors duration-300" :class="{ 'text-sky-500 dark:text-sky-400': isFocused }" />
      </div>
      <input
        :type="inputType"
        :value="modelValue"
        @input="onInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :placeholder="placeholder"
        class="w-full py-2.5 px-3.5 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base"
        :class="{ 'pl-0': icon }"
      />
      
      <!-- Password Toggle -->
      <button 
        v-if="type === 'password'" 
        type="button" 
        @click="showPassword = !showPassword"
        class="pr-3.5 pl-1.5 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
      >
        <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>
