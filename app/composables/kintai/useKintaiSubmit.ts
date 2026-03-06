// app/composables/useKintaiSubmit.ts
import type { ApiResponse, KintaiSubmitPayload } from "~/types/kintai";

/**
 * Composable to handle the submission logic and logging.
 */
export const useKintaiSubmit = () => {
  const store = useKintaiStore();
  const isLoading = ref(false);
  const logs = ref<string[]>([]);

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString();
    logs.value.push(`[${time}] ${message}`);
  };

  const submitKintai = async () => {
    const password = store.preset.password;
    if (!password) {
      addLog("Error: Password is required. Please set it in Settings.");
      return;
    }

    isLoading.value = true;
    logs.value = []; // Clear previous logs
    addLog("Starting automation process...");

    try {
      addLog("Sending request to server proxy...");

      const { data, error } = await useFetch<ApiResponse>(
        "/api/kintai/submit",
        {
          method: "POST",
          body: {
            preset: store.preset,
            password,
          } as KintaiSubmitPayload,
        },
      );

      if (error.value) {
        throw new Error(error.value.statusMessage || "Network error occurred");
      }

      if (data.value?.isSuccess) {
        addLog(`Success: ${data.value.message}`);
        return true;
      } else {
        addLog(`Failed: ${data.value?.message || "Unknown error"}`);
        return false;
      }
    } catch (err) {
      addLog(`Critical Error: ${(err as Error).message}`);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    submitKintai,
    isLoading,
    logs,
  };
};
