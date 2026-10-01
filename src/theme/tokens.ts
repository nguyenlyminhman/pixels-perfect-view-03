import { theme as antdTheme, type ThemeConfig } from "antd";
import type { Severity } from "@/types";

export const palette = {
  primary: "#7C5CFF",
  info: "#22D3EE",
  success: "#34D399",
  warning: "#FBBF24",
  error: "#F43F5E",
  darkBg: "#0B1020",
  darkChrome: "#11172A",
  darkCard: "#161D33",
  darkBorder: "#232B45",
  textPrimary: "#E6EAF5",
  textSecondary: "#8B95B3",
  lightBg: "#F5F7FB",
  lightCard: "#FFFFFF",
  lightBorder: "#E3E8F2",
  lightText: "#1A2036",
  lightTextSecondary: "#5A6480",
} as const;

export const severityColors: Record<Severity, string> = {
  critical: "#F43F5E",
  high: "#FB923C",
  medium: "#FBBF24",
  low: "#22D3EE",
  info: "#8B95B3",
};

export const brandGradient = `linear-gradient(90deg, ${palette.primary} 0%, ${palette.info} 100%)`;

const fontFamily =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
export const monoFontFamily = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

const shared: ThemeConfig["token"] = {
  colorPrimary: palette.primary,
  colorInfo: palette.info,
  colorSuccess: palette.success,
  colorWarning: palette.warning,
  colorError: palette.error,
  borderRadius: 10,
  fontFamily,
  wireframe: false,
};

export const darkTheme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    ...shared,
    colorBgLayout: palette.darkBg,
    colorBgContainer: palette.darkCard,
    colorBgElevated: palette.darkCard,
    colorBorder: palette.darkBorder,
    colorBorderSecondary: palette.darkBorder,
    colorText: palette.textPrimary,
    colorTextSecondary: palette.textSecondary,
  },
  components: {
    Layout: {
      headerBg: palette.darkChrome,
      siderBg: palette.darkChrome,
      bodyBg: palette.darkBg,
      headerHeight: 60,
    },
    Menu: {
      darkItemBg: palette.darkChrome,
      darkSubMenuItemBg: palette.darkChrome,
      darkItemSelectedBg: "rgba(124, 92, 255, 0.22)",
      darkItemSelectedColor: palette.textPrimary,
    },
    Card: { colorBorderSecondary: palette.darkBorder },
  },
};

export const lightTheme: ThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
    ...shared,
    colorBgLayout: palette.lightBg,
    colorBgContainer: palette.lightCard,
    colorBorder: palette.lightBorder,
    colorText: palette.lightText,
    colorTextSecondary: palette.lightTextSecondary,
  },
  components: {
    Layout: {
      headerBg: palette.lightCard,
      siderBg: palette.lightCard,
      bodyBg: palette.lightBg,
      headerHeight: 60,
    },
    Menu: {
      itemSelectedBg: "rgba(124, 92, 255, 0.12)",
      itemSelectedColor: palette.primary,
    },
  },
};
