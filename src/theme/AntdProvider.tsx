import { ConfigProvider, App as AntdApp } from "antd";
import type { ReactNode } from "react";
import { useUiStore } from "@/stores/uiStore";
import { darkTheme, lightTheme } from "./tokens";

export function AntdProvider({ children }: { children: ReactNode }) {
  const mode = useUiStore((s) => s.mode);
  return (
    <ConfigProvider theme={mode === "dark" ? darkTheme : lightTheme}>
      <AntdApp style={{ minHeight: "100vh" }}>{children}</AntdApp>
    </ConfigProvider>
  );
}
