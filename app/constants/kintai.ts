/**
 * Immutable mapping of work type codes to their Japanese labels.
 * Used as a single source of truth to replace Enums.
 */
export const WORK_TYPES = {
  "00": "稼無",
  "10": "出勤",
  "11": "欠勤",
  "12": "遅刻",
  "13": "早退",
  "20": "有給",
  "21": "半休",
  "30": "休出",
  "31": "法出",
  "32": "振出",
  "33": "振休",
  "34": "特休",
  "51": "休業",
  "52": "代休",
  "99": "(blank)",
} as const;

/**
 * Derived type representing the valid keys of WORK_TYPES.
 */
export type WorkTypeCode = keyof typeof WORK_TYPES;

/**
 * Array format for Nuxt UI Select component options.
 */
export const WORK_TYPE_OPTIONS: { value: string; label: string }[] = Object.entries(WORK_TYPES).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

/**
 * Pre-defined configurations for quick filling Kintai forms.
 */
export const QUICK_FILL_PRESETS = [
  {
    label: "Custom (Tùy chỉnh)",
    value: "custom",
    preset: null
  },
  {
    label: "通常勤務 (Normal Work)",
    value: "normal",
    preset: {
      workTypeCode: "10",
      startHour: "09",
      startMinute: "45",
      endHour: "18",
      endMinute: "45",
      isTelework: false,
    }
  },
  {
    label: "在宅勤務 (Telework)",
    value: "telework",
    preset: {
      workTypeCode: "10",
      startHour: "09",
      startMinute: "45",
      endHour: "18",
      endMinute: "45",
      isTelework: true,
    }
  },
  {
    label: "一日有給休暇 (Full Paid Leave)",
    value: "paid_leave",
    preset: {
      workTypeCode: "20",
      startHour: "",
      startMinute: "",
      endHour: "",
      endMinute: "",
      isTelework: false,
    }
  },
  {
    label: "午前半休 (Morning Leave)",
    value: "morning_leave",
    preset: {
      workTypeCode: "21",
      startHour: "14",
      startMinute: "00",
      endHour: "18",
      endMinute: "45",
      isTelework: false,
    }
  },
  {
    label: "午後半休 (Afternoon Leave)",
    value: "afternoon_leave",
    preset: {
      workTypeCode: "21",
      startHour: "09",
      startMinute: "45",
      endHour: "14",
      endMinute: "00",
      isTelework: false,
    }
  }
];
