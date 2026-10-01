import { Result } from "antd";
import type { ReactNode } from "react";
import { useAuthStore } from "@/stores/authStore";
import type { Role } from "@/types";

export function RoleGuard({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const role = useAuthStore((s) => s.user?.role);
  if (!role || !roles.includes(role)) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="You don't have permission to view this page."
      />
    );
  }
  return <>{children}</>;
}
