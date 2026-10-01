import { Card, Empty } from "antd";
import { PageHeader } from "./PageHeader";

export function PlaceholderPage({
  title,
  subtitle,
  description,
}: {
  title: string;
  subtitle?: string | undefined;
  description: string;
}) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <Card>
        <Empty description={description} style={{ padding: "48px 0" }} />
      </Card>
    </>
  );
}
