<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  label: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();
</script>

<template>
  <label class="flex items-center gap-3 cursor-pointer group select-none">
    <div class="relative flex items-center justify-center">
      <input
        type="checkbox"
        :checked="modelValue"
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
        class="peer sr-only"
      />
      <!-- Custom Checkbox Box -->
      <div 
        class="w-6 h-6 rounded-md border-2 transition-all duration-300 flex items-center justify-center overflow-hidden"
        :class="[
          modelValue 
            ? 'bg-sky-500 border-sky-500 dark:bg-sky-400 dark:border-sky-400' 
            : 'bg-white/50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 group-hover:border-sky-400 dark:group-hover:border-sky-500'
        ]"
      >
        <!-- Checkmark Icon -->
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor" 
          class="w-4 h-4 text-white transition-all duration-300"
          :class="modelValue ? 'scale-100 opacity-100 block' : 'scale-0 opacity-0 hidden'"
        >
          <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
        </svg>
      </div>
      
      <!-- Focus Ring Effect (simulated with an absolute element shown on peer-focus if we wanted to standard input, but we'll use a hover glow here instead for the group) -->
      <div v-if="modelValue" class="absolute inset-0 bg-sky-500/20 dark:bg-sky-400/20 rounded-md blur-md -z-10 animate-pulse"></div>
    </div>
    
    <span class="text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
      {{ label }}
    </span>
  </label>
</template>
