<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getDb, type KintaiPresetDocType } from '~/utils/db.client';
import { WORK_TYPE_OPTIONS } from '~/constants/kintai';
import { useToast } from '#imports';

const presets = ref<KintaiPresetDocType[]>([]);
let subscription: any;
const toast = useToast();

const isEditing = ref(false);

const cardTitle = computed(() => {
  if (!isEditing.value) return 'Preset Manager';
  return editForm.value.id.startsWith('preset_') ? 'Add Preset' : 'Edit Preset';
});

const editForm = ref<KintaiPresetDocType>({
  id: '',
  name: '',
  workTypeCode: '10',
  startHour: '',
  startMinute: '',
  endHour: '',
  endMinute: '',
  isTelework: false
});

onMounted(async () => {
  if (import.meta.client) {
    const db = await getDb();
    subscription = db.presets.find().$.subscribe((docs: KintaiPresetDocType[]) => {
      presets.value = docs;
    });
  }
});

onUnmounted(() => {
  if (subscription) {
    subscription.unsubscribe();
  }
});

const startAdd = () => {
  editForm.value = {
    id: `preset_${Date.now()}`,
    name: '',
    workTypeCode: '10',
    startHour: '09',
    startMinute: '45',
    endHour: '18',
    endMinute: '45',
    isTelework: false
  };
  isEditing.value = true;
};

const startEdit = (p: any) => {
  const data = typeof p.toJSON === 'function' ? p.toJSON() : p;
  editForm.value = { 
    id: data.id,
    name: data.name,
    workTypeCode: data.workTypeCode,
    startHour: data.startHour || '',
    startMinute: data.startMinute || '',
    endHour: data.endHour || '',
    endMinute: data.endMinute || '',
    isTelework: !!data.isTelework
  };
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
};

const savePreset = async () => {
  if (!editForm.value.name.trim()) {
    toast.add({ title: 'Validation Error', description: 'Preset name is required.', color: 'error' });
    return;
  }
  try {
    const db = await getDb();
    const existing = await db.presets.findOne({ selector: { id: editForm.value.id } }).exec();
    if (existing) {
      // Use incrementalPatch to safely update existing document without overriding revision
      await existing.incrementalPatch({
        name: editForm.value.name,
        workTypeCode: editForm.value.workTypeCode,
        startHour: editForm.value.startHour,
        startMinute: editForm.value.startMinute,
        endHour: editForm.value.endHour,
        endMinute: editForm.value.endMinute,
        isTelework: editForm.value.isTelework
      });
    } else {
      // Insert new document completely
      await db.presets.insert({ ...editForm.value });
    }
    isEditing.value = false;
    toast.add({ title: 'Saved', description: 'Preset has been saved successfully.', color: 'success' });
  } catch (err: any) {
    console.error(err);
    toast.add({ title: 'Save Failed', description: err.message || 'Unknown error occurred.', color: 'error' });
  }
};

// Delete Modal State
const isDeleteModalOpen = ref(false);
const presetToDelete = ref<string | null>(null);

const confirmDelete = (id: string) => {
  presetToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const executeDelete = async () => {
  if (!presetToDelete.value) return;
  const db = await getDb();
  const doc = await db.presets.findOne({ selector: { id: presetToDelete.value } }).exec();
  if (doc) {
    await doc.remove();
    toast.add({ title: 'Deleted', description: 'Preset removed successfully.', color: 'success', icon: 'i-heroicons-trash' });
  }
  isDeleteModalOpen.value = false;
  presetToDelete.value = null;
};

// Export & Import Handlers
const fileInput = ref<HTMLInputElement | null>(null);

const exportJson = async () => {
  try {
    const db = await getDb();
    const docs = await db.presets.find().exec();
    const data = docs.map(d => {
      const json = d.toJSON();
      // Remove RxDB specific internal fields to prevent import conflicts natively
      const { _rev, _meta, _attachments, _deleted, ...cleanData } = json as any;
      return cleanData;
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kintai-presets-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.add({ title: 'Exported', description: 'Presets exported to JSON file.', color: 'success' });
  } catch (err: any) {
    console.error(err);
    toast.add({ title: 'Export Failed', description: err.message, color: 'error' });
  }
};

const importJson = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files || !target.files[0]) return;
  
  const file = target.files[0];
  const reader = new FileReader();
  reader.onload = async (ev) => {
    try {
      if (!ev.target?.result) throw new Error("Empty file content");
      const data = JSON.parse(ev.target.result as string);
      
      if (!Array.isArray(data)) throw new Error("Format is not a valid JSON array.");
      
      const db = await getDb();
      
      // Clear all existing presets before importing
      const allDocs = await db.presets.find().exec();
      for (const doc of allDocs) {
        await doc.remove();
      }

      // Insert new presets from backup
      for (const item of data) {
        if (!item.id || !item.name) continue; // Basic format validation
        await db.presets.insert(item);
      }
      toast.add({ title: 'Imported', description: 'Presets restored successfully. All previous data was replaced.', color: 'success' });
    } catch (err: any) {
      console.error(err);
      toast.add({ title: 'Import Failed', description: 'Invalid JSON backup format.', color: 'error' });
    }
    if (fileInput.value) fileInput.value.value = '';
  };
  reader.readAsText(file);
};
</script>

<template>
  <KintaiCard :title="cardTitle" icon="i-heroicons-bookmark-square" class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-xl ring-1 ring-gray-200 dark:ring-gray-800">
    <template #header-actions>
      <div class="flex items-center gap-2">
        <template v-if="!isEditing">
          <input type="file" ref="fileInput" class="hidden" accept=".json" @change="importJson" />
          <UButton color="neutral" variant="soft" icon="i-heroicons-arrow-up-tray" class="rounded-full w-10 h-10 flex items-center justify-center [&_svg]:w-5 [&_svg]:h-5 transition-transform hover:scale-105 active:scale-95" @click="fileInput?.click()" title="Import JSON" aria-label="Import JSON" />
          <UButton color="neutral" variant="soft" icon="i-heroicons-arrow-down-tray" class="rounded-full w-10 h-10 flex items-center justify-center [&_svg]:w-5 [&_svg]:h-5 transition-transform hover:scale-105 active:scale-95" @click="exportJson" title="Export JSON" aria-label="Export JSON" />
          <UButton color="primary" variant="solid" icon="i-heroicons-plus" class="rounded-full w-10 h-10 flex items-center justify-center [&_svg]:w-5 [&_svg]:h-5 shadow-sm transition-transform hover:scale-105 hover:shadow-md active:scale-95" @click="startAdd" title="New Preset" />
        </template>
        <template v-else>
          <UButton color="neutral" variant="soft" icon="i-heroicons-x-mark" class="rounded-full w-10 h-10 flex items-center justify-center [&_svg]:w-5 [&_svg]:h-5 transition-transform hover:scale-105 active:scale-95" @click="cancelEdit" title="Cancel" aria-label="Cancel" />
        </template>
      </div>
    </template>

    <!-- Set fixed height referencing the Edit form's maximum requirement -->
    <div class="h-[520px] md:h-[400px] flex flex-col relative">
      <Transition name="fade-slide" mode="out-in">
        <!-- List View -->
        <div v-if="!isEditing" key="list" class="flex flex-col h-full absolute inset-0">
          <!-- Fixed height scrollable list via flex column behavior -->
          <div class="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div v-for="p in presets" :key="p.id" 
               @click="startEdit(p)"
               class="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 shadow-sm hover:shadow-md hover:border-sky-300 dark:hover:border-sky-700 transition-all cursor-pointer">
            <div class="mb-3 sm:mb-0">
              <div class="font-bold text-gray-900 dark:text-gray-100">{{ p.name }}</div>
              <div class="text-xs text-gray-500 mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                <span class="flex items-center gap-1"><UIcon name="i-heroicons-tag" class="w-3.5 h-3.5" /> Type: {{ p.workTypeCode }}</span>
                <span class="flex items-center gap-1"><UIcon name="i-heroicons-clock" class="w-3.5 h-3.5" /> Time: {{ p.startHour || '--' }}:{{ p.startMinute || '--' }} - {{ p.endHour || '--' }}:{{ p.endMinute || '--' }}</span>
                <span class="flex items-center gap-1"><UIcon name="i-heroicons-computer-desktop" class="w-3.5 h-3.5" /> Telework: {{ p.isTelework ? 'Yes' : 'No' }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <UButton color="error" variant="soft" icon="i-heroicons-trash" class="rounded-full w-10 h-10 flex items-center justify-center [&_svg]:w-5 [&_svg]:h-5 transition-transform hover:scale-105 active:scale-95" @click.stop="confirmDelete(p.id)" title="Delete" aria-label="Delete" />
            </div>
          </div>
          <div v-if="presets.length === 0" class="text-center h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <UIcon name="i-heroicons-document-text" class="w-10 h-10 text-gray-400 mb-2" />
            <p class="text-gray-500 font-medium">No presets found</p>
            <p class="text-xs text-gray-400 mt-1">Create a new preset or import a backup.</p>
          </div>
        </div>
      </div>

        <!-- Edit Form View -->
        <div v-else key="edit" class="flex flex-col h-full justify-between absolute inset-0">
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model="editForm.name" label="Preset Name (*)" placeholder="e.g. Morning Shift" />
              <BaseSelect v-model="editForm.workTypeCode" :options="WORK_TYPE_OPTIONS" label="Work Type" />
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <BaseInput v-model="editForm.startHour" label="Start Hour" placeholder="09" />
              <BaseInput v-model="editForm.startMinute" label="Start Minute" placeholder="45" />
              <BaseInput v-model="editForm.endHour" label="End Hour" placeholder="18" />
              <BaseInput v-model="editForm.endMinute" label="End Minute" placeholder="45" />
            </div>

            <div class="pt-2">
              <BaseCheckbox v-model="editForm.isTelework" label="Telework (在宅)" />
            </div>
          </div>

          <div class="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-800 shrink-0">
            <BaseButton icon="i-heroicons-check" @click="savePreset">Save Preset</BaseButton>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Delete Confirmation Modal Using Native HTML / Nuxt UI Dialog styling -->
    <UModal v-model:open="isDeleteModalOpen">
      <template #content>
        <div class="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl max-w-sm w-full mx-auto border border-gray-200 dark:border-gray-800">
          <div class="flex flex-col items-center text-center">
            <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Preset?</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete this preset? This action cannot be undone.
            </p>
            <div class="flex gap-3 w-full">
              <UButton color="neutral" variant="soft" class="flex-1 justify-center" @click="isDeleteModalOpen = false">Cancel</UButton>
              <UButton color="error" variant="solid" class="flex-1 justify-center" @click="executeDelete">Delete</UButton>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </KintaiCard>
</template>

<style scoped>
/* Transition styles for swapping between List and Edit seamlessly */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Custom Webkit scrollbar for the scrollable areas */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 20px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
}
</style>
