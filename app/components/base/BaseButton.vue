<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  block?: boolean;
}>();

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const isDisabled = computed(() => props.disabled || props.loading);
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="isDisabled"
    @click="emit('click', $event)"
    class="relative flex justify-center items-center gap-2 px-6 py-3.5 text-base font-bold text-white rounded-xl shadow-md transition-all duration-300 overflow-hidden group"
    :class="[
      block ? 'w-full' : '',
      isDisabled
        ? 'opacity-70 cursor-not-allowed bg-sky-400 dark:bg-sky-500 scale-100'
        : 'bg-linear-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md cursor-pointer'
    ]"
  >
    <!-- Loading Spinner -->
    <UIcon 
      v-if="loading" 
      name="i-heroicons-arrow-path" 
      class="w-5 h-5 animate-spin shrink-0 block" 
    />
    
    <!-- Icon -->
    <UIcon 
      v-else-if="icon" 
      :name="icon" 
      class="w-5 h-5 shrink-0 block group-hover:scale-110 transition-transform duration-300" 
    />
    
    <!-- Content -->
    <span class="truncate block">
      <slot />
    </span>
  </button>
</template>
