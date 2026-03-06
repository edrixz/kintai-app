<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { getDb, type KintaiPresetDocType } from '~/utils/db.client';
import { WORK_TYPE_OPTIONS } from '~/constants/kintai';
import { useToast } from '#imports';

const presets = ref<KintaiPresetDocType[]>([]);
let subscription: any;
const toast = useToast();

const isEditing = ref(false);
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

const deletePreset = async (id: string) => {
  if (!confirm('Are you sure you want to delete this preset?')) return;
  const db = await getDb();
  const doc = await db.presets.findOne({ selector: { id } }).exec();
  if (doc) {
    await doc.remove();
    toast.add({ title: 'Deleted', description: 'Preset removed.', color: 'neutral' });
  }
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
  <KintaiCard title="Preset Management" icon="i-heroicons-bookmark-square" class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-xl ring-1 ring-gray-200 dark:ring-gray-800">
    <!-- List View -->
    <div v-if="!isEditing">
      <div class="flex items-center justify-between mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Manage your custom time presets, or export/import them for backup.
        </p>
        <div class="flex items-center gap-2">
          <input type="file" ref="fileInput" class="hidden" accept=".json" @change="importJson" />
          <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-up-tray" @click="fileInput?.click()" title="Import JSON" aria-label="Import JSON" />
          <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-down-tray" @click="exportJson" title="Export JSON" aria-label="Export JSON" />
          <BaseButton icon="i-heroicons-plus" @click="startAdd">New Preset</BaseButton>
        </div>
      </div>

      <div class="space-y-3">
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
            <UButton color="error" variant="soft" icon="i-heroicons-trash" @click.stop="deletePreset(p.id)" title="Delete" aria-label="Delete" />
          </div>
        </div>
        <div v-if="presets.length === 0" class="text-center py-10 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <UIcon name="i-heroicons-document-text" class="w-10 h-10 mx-auto text-gray-400 mb-2" />
          <p class="text-gray-500 font-medium">No presets found</p>
          <p class="text-xs text-gray-400 mt-1">Create a new preset or import a backup.</p>
        </div>
      </div>
    </div>

    <!-- Edit Form View -->
    <div v-else class="space-y-6 animate-fade-in-up">
      <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <UIcon :name="editForm.id.startsWith('preset_') ? 'i-heroicons-plus-circle' : 'i-heroicons-pencil-square'" class="w-6 h-6 text-sky-500" />
          {{ editForm.id.startsWith('preset_') ? 'Create New Preset' : 'Edit Preset' }}
        </h3>
        <button @click="cancelEdit" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
          <UIcon name="i-heroicons-x-mark" class="w-5 h-5 block" />
        </button>
      </div>

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

      <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
        <UButton color="neutral" variant="ghost" @click="cancelEdit">Cancel</UButton>
        <BaseButton icon="i-heroicons-check" @click="savePreset">Save Preset</BaseButton>
      </div>
    </div>
  </KintaiCard>
</template>
