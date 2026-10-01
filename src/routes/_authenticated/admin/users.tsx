import { createFileRoute } from "@tanstack/react-router";
import { Card, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { RoleGuard } from "@/components/common/RoleGuard";
import { userService } from "@/services/userService";
import type { User } from "@/types";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({
    meta: [
      { title: "Users & Roles — NosyAgentic" },
      { name: "description", content: "Manage who can view and approve AI code reviews." },
      { property: "og:title", content: "Users & Roles — NosyAgentic" },
      {
        property: "og:description",
        content: "Manage who can view and approve AI code reviews.",
      },
    ],
  }),
  component: () => (
    <RoleGuard roles={["admin"]}>
      <UsersPage />
    </RoleGuard>
  ),
});

const roleColor: Record<string, string> = {
  admin: "purple",
  approver: "cyan",
  viewer: "default",
};

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    userService.list().then((list) => {
      if (!active) return;
      setUsers(list);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHeader title="Users & Roles" subtitle="Who has access to NosyAgentic." />
      <Card>
        <Table<User>
          rowKey="id"
          loading={loading}
          dataSource={users}
          pagination={false}
          scroll={{ x: 600 }}
          columns={[
            { title: "Full name", dataIndex: "fullName", key: "fullName" },
            {
              title: "Username",
              dataIndex: "username",
              key: "username",
              render: (v: string) => <span className="na-mono">{v}</span>,
            },
            { title: "Email", dataIndex: "email", key: "email" },
            {
              title: "Role",
              dataIndex: "role",
              key: "role",
              render: (r: string) => (
                <Tag color={roleColor[r]} style={{ textTransform: "capitalize" }}>
                  {r}
                </Tag>
              ),
            },
          ]}
        />
      </Card>
    </>
  );
}
