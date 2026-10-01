import { Typography, Space } from "antd";
import type { ReactNode } from "react";

const { Title, Text } = Typography;

export function PageHeader({
  title,
  subtitle,
  extra,
}: {
  title: string;
  subtitle?: string;
  extra?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
      }}
    >
      <Space direction="vertical" size={2}>
        <Title level={3} style={{ margin: 0 }}>
          {title}
        </Title>
        {subtitle ? <Text type="secondary">{subtitle}</Text> : null}
      </Space>
      {extra}
    </div>
  );
}
