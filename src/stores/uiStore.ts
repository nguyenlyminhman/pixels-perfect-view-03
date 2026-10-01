import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Mode = "dark" | "light";

interface UiState {
  mode: Mode;
  collapsed: boolean;
  toggleMode: () => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      mode: "dark",
      collapsed: false,
      toggleMode: () => set((s) => ({ mode: s.mode === "dark" ? "light" : "dark" })),
      setCollapsed: (collapsed) => set({ collapsed }),
      toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
    }),
    { name: "nosyagentic-ui", storage: createJSONStorage(() => localStorage) },
  ),
);
