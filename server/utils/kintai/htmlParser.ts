// server/utils/kintai/htmlParser.ts
import * as cheerio from "cheerio";

export const parseAllFormFields = (html: string): Record<string, string> => {
  const $ = cheerio.load(html);
  const payload: Record<string, string> = {};

  $("input").each((_, el) => {
    const name = $(el).attr("name");
    if (!name) return;
    const itype = ($(el).attr("type") || "").toLowerCase();
    if (itype === "checkbox" || itype === "radio") {
      if ($(el).attr("checked") !== undefined) {
        payload[name] = ($(el).val() as string) || "on";
      }
      return;
    }
    if (itype === "submit") return;
    payload[name] = ($(el).val() as string) || "";
  });

  $("textarea").each((_, el) => {
    const name = $(el).attr("name");
    if (name) payload[name] = $(el).text() || "";
  });

  $("select").each((_, el) => {
    const name = $(el).attr("name");
    if (!name) return;
    const opt = $(el).find("option[selected]").length
      ? $(el).find("option[selected]")
      : $(el).find("option").first();
    payload[name] = (opt.val() as string) || "";
  });

  return payload;
};

export const findKintaiIndexForm = (
  html: string,
): Record<string, string> | null => {
  const $ = cheerio.load(html);
  let data: Record<string, string> | null = null;
  $("form").each((_, form) => {
    const action = $(form).attr("action") || "";
    if (action.includes("kintai/index")) {
      data = {};
      $(form)
        .find("input")
        .each((__, inp) => {
          const name = $(inp).attr("name");
          if (name) data![name] = ($(inp).val() as string) || "";
        });
      return false;
    }
  });
  return data;
};

export const findRow_prefix_by_mmdd = (
  payload: Record<string, string>,
  mmdd: string,
): string | null => {
  const suffix = ".workDate";
  for (const [k, v] of Object.entries(payload)) {
    if (k.startsWith("workDataDetailList[") && k.endsWith(suffix)) {
      if ((v || "").trim() === mmdd) {
        return k.slice(0, -suffix.length);
      }
    }
  }
  return null;
};
