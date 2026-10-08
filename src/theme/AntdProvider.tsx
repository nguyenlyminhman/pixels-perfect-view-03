import { ConfigProvider, App as AntdApp } from "antd";
import { useEffect, type ReactNode } from "react";
import { useUiStore } from "@/stores/uiStore";
import { darkTheme, lightTheme } from "./tokens";

export function AntdProvider({ children }: { children: ReactNode }) {
  const mode = useUiStore((s) => s.mode);

  // Mirrors the active theme onto <html> so plain-CSS surfaces (modals, login)
  // can pick light values instead of the dark defaults.
  useEffect(() => {
    document.documentElement.dataset.naTheme = mode;
  }, [mode]);

  return (
    <ConfigProvider theme={mode === "dark" ? darkTheme : lightTheme}>
      <AntdApp style={{ minHeight: "100vh" }}>{children}</AntdApp>
    </ConfigProvider>
  );
}
