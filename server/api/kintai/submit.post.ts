// server/api/kintai/submit.post.ts
import type { KintaiSubmitPayload, ApiResponse } from "~/types/kintai";

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  const body = await readBody<KintaiSubmitPayload>(event);
  const client = new KintaiClient();

  try {
    // loginResult now contains { isSuccess, message }
    const loginResult = await client.login(body.preset.loginId, body.password);

    if (!loginResult.isSuccess) {
      return { isSuccess: false, message: loginResult.message };
    }

    const result = await client.submit(body.preset);
    return { isSuccess: true, message: result };
  } catch (e) {
    return { isSuccess: false, message: (e as Error).message };
  }
});
