import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import type { LoginPayload, User } from "@/types";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (patch: Pick<User, "fullName" | "email" | "avatar">) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      hydrated: false,

      login: async (payload) => {
        const { token, user } = await authService.login(payload);
        set({ token, user, isAuthenticated: true });
      },

      logout: async () => {
        await authService.logout();
        set({ token: null, user: null, isAuthenticated: false });
      },

      updateProfile: async (patch) => {
        const current = get().user;
        if (!current) throw new Error("Not signed in.");
        const user = await userService.updateProfile(current.id, patch);
        set({ user });
      },

      changePassword: async (currentPassword, newPassword) => {
        const current = get().user;
        if (!current) throw new Error("Not signed in.");
        await userService.changePassword(current.id, currentPassword, newPassword);
      },

      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "nosyagentic-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        token: s.token,
        user: s.user,
        isAuthenticated: s.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
