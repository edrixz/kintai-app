<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  modelValue: string | number;
  options: { value: string | number; label: string }[];
  label?: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();

const isOpen = ref(false);
const selectRef = ref<HTMLElement | null>(null);

const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue);
});

const toggleSelect = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (value: string | number) => {
  emit('update:modelValue', value);
  isOpen.value = false;
};

// Close when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full relative" ref="selectRef">
    <label v-if="label" class="text-sm font-semibold text-gray-700 dark:text-gray-300">
      {{ label }}
    </label>
    
    <button
      type="button"
      @click="toggleSelect"
      class="relative flex items-center justify-between w-full py-2.5 px-3.5 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border rounded-xl transition-all duration-300 focus:outline-none text-left"
      :class="[
        isOpen 
          ? 'border-sky-500 ring-4 ring-sky-500/20 dark:border-sky-400 dark:ring-sky-400/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      ]"
    >
      <span v-if="selectedOption" class="text-gray-900 dark:text-gray-100 text-base font-medium truncate">
        {{ selectedOption.label }}
      </span>
      <span v-else class="text-gray-400 dark:text-gray-500 text-base truncate">
        {{ placeholder || 'Select an option' }}
      </span>
      
      <UIcon 
        name="i-heroicons-chevron-down-20-solid" 
        class="w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0 ml-2"
        :class="{ 'rotate-180 text-sky-500': isOpen }"
      />
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0 scale-95"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100 scale-100"
      leave-to-class="translate-y-1 opacity-0 scale-95"
    >
      <div 
        v-if="isOpen" 
        class="absolute z-50 w-full mt-1.5 top-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto"
      >
        <ul class="py-1">
          <li 
            v-for="option in options" 
            :key="option.value"
            @click="selectOption(option.value)"
            class="px-3.5 py-2.5 cursor-pointer flex items-center justify-between text-base transition-colors"
            :class="[
              modelValue === option.value 
                ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 font-semibold' 
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            ]"
          >
            <span class="truncate">{{ option.label }}</span>
            <UIcon 
              v-if="modelValue === option.value" 
              name="i-heroicons-check" 
              class="w-5 h-5 text-sky-500 shrink-0" 
            />
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>
