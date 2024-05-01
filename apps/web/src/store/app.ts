import { create } from "zustand";

type AppStore = {
  foo: string;
};

export const useAppStore = create<AppStore>((set) => ({
  foo: "bar",
  setFoo: (foo: string) => set({ foo }),
}));
