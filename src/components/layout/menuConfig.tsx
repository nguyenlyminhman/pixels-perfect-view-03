import {
  AppstoreOutlined,
  BranchesOutlined,
  BugOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  FileSearchOutlined,
  PullRequestOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";
import type { Role } from "@/types";

export type AppPath =
  | "/dashboard"
  | "/reviews/pull-requests"
  | "/reviews/runs"
  | "/reviews/findings"
  | "/config/prompts"
  | "/config/repositories"
  | "/admin/users";

export interface MenuLeaf {
  key: AppPath;
  label: string;
  icon: ReactNode;
  roles?: Role[];
}

export interface MenuGroup {
  key: string;
  label: string;
  icon: ReactNode;
  roles?: Role[];
  children: MenuLeaf[];
}

export type MenuNode = MenuLeaf | MenuGroup;

export const isGroup = (node: MenuNode): node is MenuGroup => "children" in node;

export const menuTree: MenuNode[] = [
  { key: "/dashboard", label: "Dashboard", icon: <AppstoreOutlined /> },
  {
    key: "code-review",
    label: "Code Review",
    icon: <BranchesOutlined />,
    children: [
      {
        key: "/reviews/pull-requests",
        label: "Pull Requests",
        icon: <PullRequestOutlined />,
      },
      { key: "/reviews/runs", label: "Review Runs", icon: <DeploymentUnitOutlined /> },
      { key: "/reviews/findings", label: "Findings", icon: <BugOutlined /> },
    ],
  },
  {
    key: "configuration",
    label: "Configuration",
    icon: <SettingOutlined />,
    children: [
      {
        key: "/config/prompts",
        label: "Prompt Templates",
        icon: <FileSearchOutlined />,
        roles: ["admin"],
      },
      {
        key: "/config/repositories",
        label: "Repositories",
        icon: <DatabaseOutlined />,
      },
    ],
  },
  {
    key: "administration",
    label: "Administration",
    icon: <TeamOutlined />,
    roles: ["admin"],
    children: [{ key: "/admin/users", label: "Users & Roles", icon: <TeamOutlined /> }],
  },
];

const allowed = (roles: Role[] | undefined, role: Role) => !roles || roles.includes(role);

export function menuForRole(role: Role) {
  return menuTree
    .filter((node) => allowed(node.roles, role))
    .map((node) => {
      if (!isGroup(node)) return node;
      return { ...node, children: node.children.filter((c) => allowed(c.roles, role)) };
    })
    .filter((node) => !isGroup(node) || node.children.length > 0);
}

export function findTrail(pathname: string) {
  for (const node of menuTree) {
    if (!isGroup(node)) {
      if (node.key === pathname) return { group: null as MenuGroup | null, leaf: node };
      continue;
    }
    const leaf = node.children.find((c) => c.key === pathname);
    if (leaf) return { group: node, leaf };
  }
  return { group: null as MenuGroup | null, leaf: null as MenuLeaf | null };
}
