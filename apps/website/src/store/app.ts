import { create } from "zustand";

type AppStore = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
  startLoading: () => set({ loading: true }),
  stopLoading: () => set({ loading: false }),
}));
