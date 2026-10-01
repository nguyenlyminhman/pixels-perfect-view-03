import type { LoginPayload, LoginResponse, User } from "@/types";
import { mockUsers } from "./mockData";

const delay = (ms = 650) => new Promise((resolve) => setTimeout(resolve, ms));

function fakeJwt(user: User) {
  const body = btoa(
    JSON.stringify({ sub: user.id, username: user.username, role: user.role }),
  );
  return `mock.${body}.signature`;
}

export const authService = {
  async login({ username, password }: LoginPayload): Promise<LoginResponse> {
    await delay();
    const match = mockUsers.find(
      (u) => u.username === username.trim() && u.password === password,
    );
    if (!match) throw new Error("Invalid username or password.");
    const { password: _pw, ...user } = match;
    return { token: fakeJwt(user), user };
  },

  async logout(): Promise<void> {
    await delay(150);
  },
};
