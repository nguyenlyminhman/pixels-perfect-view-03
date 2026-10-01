import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  Tag,
  Button,
  Popconfirm,
  Breadcrumb,
  Tooltip,
  Drawer,
  Typography,
  App,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LockOutlined,
  LogoutOutlined,
  BulbOutlined,
  MoonOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";
import { brandGradient, palette } from "@/theme/tokens";
import { menuForRole, findTrail, isGroup, type AppPath } from "./menuConfig";
import { ProfileModal } from "@/components/common/ProfileModal";
import { ChangePasswordModal } from "@/components/common/ChangePasswordModal";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 991px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mobile;
}

function Logo({ compact }: { compact?: boolean }) {
  return (
    <Space size={10} align="center">
      <span
        style={{
          width: 30,
          height: 30,
          borderRadius: 9,
          background: brandGradient,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#0B1020",
        }}
      >
        <ThunderboltFilled />
      </span>
      {!compact && (
        <span className="na-gradient-text" style={{ fontSize: 18, fontWeight: 700 }}>
          NosyAgentic
        </span>
      )}
    </Space>
  );
}

export function AppLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { mode, toggleMode, collapsed, toggleCollapsed, setCollapsed } = useUiStore();
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const { message } = App.useApp();

  const role = user?.role ?? "viewer";
  const items = useMemo(
    () =>
      menuForRole(role).map((node) =>
        isGroup(node)
          ? {
              key: node.key,
              icon: node.icon,
              label: node.label,
              children: node.children.map((c) => ({
                key: c.key,
                icon: c.icon,
                label: c.label,
              })),
            }
          : { key: node.key, icon: node.icon, label: node.label },
      ),
    [role],
  );

  const trail = findTrail(pathname);
  const openKeys = trail.group ? [trail.group.key] : [];
  const [stateOpenKeys, setStateOpenKeys] = useState<string[]>(openKeys);
  useEffect(() => {
    if (trail.group) setStateOpenKeys((prev) => Array.from(new Set([...prev, trail.group!.key])));
  }, [trail.group]);

  const handleSelect = ({ key }: { key: string }) => {
    navigate({ to: key as AppPath });
    if (isMobile) setDrawerOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    message.success("Signed out.");
    navigate({ to: "/login", replace: true });
  };

  const menuNode = (
    <Menu
      mode="inline"
      theme={mode === "dark" ? "dark" : "light"}
      items={items}
      selectedKeys={[pathname]}
      openKeys={isMobile ? stateOpenKeys : collapsed ? [] : stateOpenKeys}
      onOpenChange={(keys) => setStateOpenKeys(keys as string[])}
      onClick={handleSelect}
      style={{ borderInlineEnd: "none", paddingTop: 8 }}
    />
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          trigger={null}
          width={248}
          collapsedWidth={72}
          theme={mode === "dark" ? "dark" : "light"}
          style={{
            borderInlineEnd: `1px solid ${mode === "dark" ? palette.darkBorder : palette.lightBorder}`,
          }}
        >
          <div
            style={{
              height: 60,
              display: "flex",
              alignItems: "center",
              paddingInline: collapsed ? 20 : 20,
            }}
          >
            <Logo compact={collapsed} />
          </div>
          {menuNode}
        </Sider>
      )}

      <Drawer
        placement="left"
        open={isMobile && drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={260}
        styles={{ body: { padding: 0 } }}
        title={<Logo />}
      >
        {menuNode}
      </Drawer>

      <Layout>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingInline: 16,
            borderBottom: `1px solid ${mode === "dark" ? palette.darkBorder : palette.lightBorder}`,
          }}
        >
          <Space size={8}>
            <Button
              type="text"
              aria-label="Toggle navigation"
              icon={
                (isMobile ? drawerOpen : !collapsed) ? (
                  <MenuFoldOutlined />
                ) : (
                  <MenuUnfoldOutlined />
                )
              }
              onClick={() => {
                if (isMobile) setDrawerOpen((o) => !o);
                else toggleCollapsed();
              }}
            />
            {isMobile && <Logo compact />}
          </Space>

          <Space size={8}>
            <Tooltip title={mode === "dark" ? "Switch to light" : "Switch to dark"}>
              <Button
                type="text"
                aria-label="Toggle theme"
                icon={mode === "dark" ? <BulbOutlined /> : <MoonOutlined />}
                onClick={toggleMode}
              />
            </Tooltip>

            <Dropdown
              trigger={["click"]}
              menu={{
                items: [
                  { key: "profile", icon: <UserOutlined />, label: "My Profile" },
                  { key: "password", icon: <LockOutlined />, label: "Change Password" },
                  { type: "divider" as const },
                  {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: "Logout",
                    danger: true,
                  },
                ],
                onClick: ({ key }) => {
                  if (key === "profile") setProfileOpen(true);
                  if (key === "password") setPasswordOpen(true);
                  if (key === "logout") void handleLogout();
                },
              }}
            >
              <Space style={{ cursor: "pointer" }} size={8}>
                <Avatar src={user?.avatar || undefined} icon={<UserOutlined />} />
                {!isMobile && (
                  <Space size={6}>
                    <Text strong>{user?.fullName}</Text>
                    <Tag color="purple" style={{ textTransform: "capitalize" }}>
                      {user?.role}
                    </Tag>
                  </Space>
                )}
              </Space>
            </Dropdown>

            <Popconfirm
              title="Sign out?"
              description="You'll need to log in again."
              okText="Sign out"
              cancelText="Cancel"
              onConfirm={handleLogout}
            >
              <Button type="text" aria-label="Logout" icon={<LogoutOutlined />} danger />
            </Popconfirm>
          </Space>
        </Header>

        <Content style={{ padding: 24 }}>
          <Breadcrumb
            style={{ marginBottom: 16 }}
            items={[
              { title: "NosyAgentic" },
              ...(trail.group ? [{ title: trail.group.label }] : []),
              ...(trail.leaf ? [{ title: trail.leaf.label }] : []),
            ]}
          />
          <Outlet />
        </Content>
      </Layout>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <ChangePasswordModal open={passwordOpen} onClose={() => setPasswordOpen(false)} />

      {/* keep collapsed state sane when switching to desktop */}
      {isMobile && collapsed ? <HiddenReset onReset={() => setCollapsed(false)} /> : null}
    </Layout>
  );
}

function HiddenReset({ onReset }: { onReset: () => void }) {
  useEffect(() => {
    onReset();
  }, [onReset]);
  return null;
}
