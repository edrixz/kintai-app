// app/stores/useKintaiStore.ts
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import type { KintaiPreset } from "~/types/kintai";

/**
 * Pinia store for managing persistent Kintai settings.
 * Uses useLocalStorage to persist data across browser sessions.
 */
export const useKintaiStore = defineStore("kintai", () => {
  const defaultPreset: KintaiPreset = {
    loginId: "",
    year: new Date().getFullYear().toString(),
    month: String(new Date().getMonth() + 1).padStart(2, "0"),
    day: "",
    startHour: "09",
    startMinute: "45",
    endHour: "18",
    endMinute: "45",
    restHour: "01",
    restMinute: "00",
    workTypeCode: "10",
    comment: "",
    isTelework: false,
  };

  // Persist state to localStorage under the key 'edrixx-kintai-preset'
  const preset = useLocalStorage<KintaiPreset>(
    "edrixx-kintai-preset",
    defaultPreset,
  );

  const updatePreset = (patch: Partial<KintaiPreset>) => {
    preset.value = { ...preset.value, ...patch };
  };

  return {
    preset,
    updatePreset,
  };
});
