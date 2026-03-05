// server/utils/kintai/client.ts
import { $fetch } from "ofetch";
import {
  parseAllFormFields,
  findKintaiIndexForm,
  findRow_prefix_by_mmdd,
} from "./htmlParser";
import type { KintaiPreset } from "~/types/kintai";

const BASE = "https://ordia.dpt-inc.co.jp";
const ENDPOINTS = {
  LOGIN: BASE + "/webkintaistaff/auth/",
  STAFF_LIST: BASE + "/webkintai/staff/list/",
  KINTAI_INDEX: BASE + "/webkintai/kintai/index/",
  KINTAI_POST: BASE + "/webkintai/kintai/",
} as const;

export class KintaiClient {
  private cookieJar: Map<string, string> = new Map();

  /**
   * Cập nhật CookieJar từ headers (giống requests.Session trong Python)
   */
  private updateCookies(headers: Headers) {
    const setCookies =
      typeof headers.getSetCookie === "function"
        ? headers.getSetCookie()
        : headers.get("set-cookie")?.split(",") || [];

    for (const cookieStr of setCookies) {
      if (!cookieStr) continue;
      const pair = cookieStr.split(";")[0];
      if (pair && pair.includes("=")) {
        const [key, ...values] = pair.split("=");
        const value = values.join("=");
        if (key && value) this.cookieJar.set(key.trim(), value.trim());
      }
    }
  }

  private get cookieString(): string {
    return Array.from(this.cookieJar.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join("; ");
  }

  async login(
    loginId: string,
    pass: string,
  ): Promise<{ isSuccess: boolean; message: string }> {
    try {
      // 1. Khởi tạo session
      const res = await $fetch.raw(ENDPOINTS.LOGIN);
      this.updateCookies(res.headers);

      const payload = parseAllFormFields(res._data as string);
      payload.loginId = loginId;
      payload.password = pass;
      payload.login = "ログイン／Log In";
      payload.userLanguage = "JA";

      // 2. POST Login (Chặn redirect để cập nhật cookie từng bước)
      let loginRes = await $fetch.raw(ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          Cookie: this.cookieString,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(payload as Record<string, string>).toString(),
        redirect: "manual",
      });
      this.updateCookies(loginRes.headers);

      // Nếu là 302, đi theo location
      if (loginRes.status === 302) {
        const loc = loginRes.headers.get("location") || "";
        const finalUrl = loc.startsWith("http") ? loc : BASE + loc;
        const followRes = await $fetch.raw(finalUrl, {
          headers: { Cookie: this.cookieString },
        });
        this.updateCookies(followRes.headers);

        if (followRes.url.includes("/webkintai/")) {
          return { isSuccess: true, message: "Login OK" };
        }
      }

      return { isSuccess: false, message: `Login failed: ${loginRes.status}` };
    } catch (e) {
      return { isSuccess: false, message: (e as Error).message };
    }
  }

  async submit(preset: KintaiPreset): Promise<string> {
    // 1. GET staff/list
    const r3 = await $fetch.raw(ENDPOINTS.STAFF_LIST, {
      headers: { Cookie: this.cookieString, Referer: ENDPOINTS.LOGIN },
    });
    this.updateCookies(r3.headers);

    const staffFields = parseAllFormFields(r3._data as string);
    const token = staffFields["org.apache.struts.taglib.html.TOKEN"] || "";
    if (!token)
      throw new Error("Missing TOKEN on staff/list. Session might be invalid.");

    // 2. POST Search
    const r4 = await $fetch.raw(ENDPOINTS.STAFF_LIST, {
      method: "POST",
      headers: {
        Cookie: this.cookieString,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "org.apache.struts.taglib.html.TOKEN": token,
        searchYear: preset.year,
        searchMonth: preset.month.padStart(2, "0"),
        search: "検索",
      }).toString(),
    });
    this.updateCookies(r4.headers);

    // 3. Find Kintai Index Form
    const kintaiForm = findKintaiIndexForm(r4._data as string);
    if (!kintaiForm) throw new Error("Kintai button not found.");

    // 4. POST Kintai Index
    const rk = await $fetch.raw(ENDPOINTS.KINTAI_INDEX, {
      method: "POST",
      headers: {
        Cookie: this.cookieString,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(
        kintaiForm as Record<string, string>,
      ).toString(),
    });
    this.updateCookies(rk.headers);

    // 5. Fill Data
    const kPayload = parseAllFormFields(rk._data as string);
    const day = preset.day.trim() || String(new Date().getDate());
    const mmdd = `${preset.month.padStart(2, "0")}/${day.padStart(2, "0")}`;
    const prefix = findRow_prefix_by_mmdd(kPayload, mmdd);
    if (!prefix) throw new Error(`Date ${mmdd} not found.`);

    // Xóa telework flags khác (Giống Python logic)
    for (const k of Object.keys(kPayload)) {
      if (k.endsWith(".teleworkFlg")) delete kPayload[k];
    }

    kPayload[`${prefix}.workType`] = preset.workTypeCode;
    kPayload[`${prefix}.workStartTimeHour`] = preset.startHour.padStart(2, "0");
    kPayload[`${prefix}.workStartTimeMinute`] = preset.startMinute.padStart(
      2,
      "0",
    );
    kPayload[`${prefix}.workEndTimeHour`] = preset.endHour.padStart(2, "0");
    kPayload[`${prefix}.workEndTimeMinute`] = preset.endMinute.padStart(2, "0");
    kPayload[`${prefix}.restTimeHour`] = preset.restHour.padStart(2, "0");
    kPayload[`${prefix}.restTimeMinute`] = preset.restMinute.padStart(2, "0");
    if (preset.isTelework) kPayload[`${prefix}.teleworkFlg`] = "1";
    kPayload["register"] = "登録";

    // 6. Final POST
    const rp = await $fetch.raw(ENDPOINTS.KINTAI_POST, {
      method: "POST",
      headers: {
        Cookie: this.cookieString,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(kPayload as Record<string, string>).toString(),
    });

    if (rp.url?.includes("/auth/")) throw new Error("Session expired.");
    return `Success: ${mmdd}`;
  }
}
