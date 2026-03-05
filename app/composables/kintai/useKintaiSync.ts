// app/composables/useKintaiSync.ts
export const useKintaiSync = () => {
  const store = useKintaiStore();

  const syncToCurrentDate = () => {
    const now = new Date();
    store.preset.year = now.getFullYear().toString();
    // Đảm bảo tháng luôn có 2 chữ số như logic Python yêu cầu
    store.preset.month = String(now.getMonth() + 1).padStart(2, "0");
    store.preset.day = String(now.getDate()).padStart(2, "0");
  };

  return { syncToCurrentDate };
};
