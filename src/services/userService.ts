import type { User } from "@/types";
import { mockUsers } from "./mockData";

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const userService = {
  async updateProfile(
    userId: string,
    patch: Pick<User, "fullName" | "email" | "avatar">,
  ): Promise<User> {
    await delay();
    const found = mockUsers.find((u) => u.id === userId);
    if (!found) throw new Error("User not found.");
    const { password: _pw, ...user } = { ...found, ...patch };
    return user;
  },

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await delay();
    const found = mockUsers.find((u) => u.id === userId);
    if (!found || found.password !== currentPassword) {
      throw new Error("Current password is incorrect.");
    }
    found.password = newPassword;
  },

  async list(): Promise<User[]> {
    await delay(300);
    return mockUsers.map(({ password: _pw, ...u }) => u);
  },
};
