// types/kintai.ts
import type { WorkTypeCode } from "~/constants/kintai";

/**
 * Represents the user's customized preset for Kintai submission.
 * This replaces the Python preset.json structure.
 */
export type KintaiPreset = {
  loginId: string;
  year: string;
  month: string;
  day: string;
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
  restHour: string;
  restMinute: string;
  workTypeCode: WorkTypeCode;
  comment: string;
  isTelework: boolean;
};

/**
 * Represents the structured payload expected by the Nuxt API server route.
 */
export type KintaiSubmitPayload = {
  preset: KintaiPreset;
  password: string; // Password is never saved in the preset, only passed during submission
};

/**
 * Standardized API response format for the application.
 */
export type ApiResponse<T = unknown> = {
  isSuccess: boolean;
  message: string;
  data?: T;
};
