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
