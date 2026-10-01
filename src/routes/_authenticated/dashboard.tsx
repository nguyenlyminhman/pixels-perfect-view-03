import { createFileRoute } from "@tanstack/react-router";
import { Card, Col, Row, Statistic, Table, Tag, Typography } from "antd";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  PullRequestOutlined,
  ThunderboltOutlined,
  BugOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { PageHeader } from "@/components/common/PageHeader";
import { palette, severityColors } from "@/theme/tokens";
import {
  dashboardStats,
  recentRuns,
  reviewTrend,
  severityBreakdown,
} from "@/services/mockData";
import type { ReviewRun, RunStatus, Provider } from "@/types";
import { useUiStore } from "@/stores/uiStore";

const { Text } = Typography;

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — NosyAgentic" },
      {
        name: "description",
        content: "Review activity, findings by severity and recent AI review runs.",
      },
      { property: "og:title", content: "Dashboard — NosyAgentic" },
      {
        property: "og:description",
        content: "Review activity, findings by severity and recent AI review runs.",
      },
    ],
  }),
  component: DashboardPage,
});

const statusColor: Record<RunStatus, string> = {
  pending: "default",
  running: "processing",
  completed: "success",
  failed: "error",
};

const providerColor: Record<Provider, string> = {
  bitbucket: "blue",
  gitlab: "orange",
};

function DashboardPage() {
  const mode = useUiStore((s) => s.mode);
  const axisColor = mode === "dark" ? palette.textSecondary : palette.lightTextSecondary;
  const gridColor = mode === "dark" ? palette.darkBorder : palette.lightBorder;

  const columns = [
    {
      title: "PR title",
      dataIndex: "prTitle",
      key: "prTitle",
      render: (value: string, row: ReviewRun) => (
        <div>
          <div style={{ fontWeight: 600 }}>{value}</div>
          <Text type="secondary" className="na-mono" style={{ fontSize: 12 }}>
            {row.id}
          </Text>
        </div>
      ),
    },
    {
      title: "Repository",
      dataIndex: "repo",
      key: "repo",
      render: (v: string) => <span className="na-mono">{v}</span>,
    },
    {
      title: "Provider",
      dataIndex: "provider",
      key: "provider",
      render: (p: Provider) => (
        <Tag color={providerColor[p]} style={{ textTransform: "capitalize" }}>
          {p}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s: RunStatus) => (
        <Tag color={statusColor[s]} style={{ textTransform: "capitalize" }}>
          {s}
        </Tag>
      ),
    },
    { title: "Findings", dataIndex: "findings", key: "findings", align: "right" as const },
    { title: "Time", dataIndex: "time", key: "time" },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="How your AI reviewers performed across connected repositories."
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Statistic
              title="PRs reviewed"
              value={dashboardStats.prsReviewed}
              prefix={<PullRequestOutlined style={{ color: palette.primary }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Statistic
              title="Review runs today"
              value={dashboardStats.runsToday}
              prefix={<ThunderboltOutlined style={{ color: palette.info }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Statistic
              title="Open findings"
              value={dashboardStats.openFindings}
              prefix={<BugOutlined style={{ color: palette.warning }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Statistic
              title="Avg review time"
              value={dashboardStats.avgReviewSeconds}
              suffix="s"
              prefix={<ClockCircleOutlined style={{ color: palette.success }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} xl={16}>
          <Card title="Reviews — last 14 days">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reviewTrend} margin={{ left: -16, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="naReviews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={palette.primary} stopOpacity={0.7} />
                      <stop offset="100%" stopColor={palette.primary} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="naFindings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={palette.info} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={palette.info} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke={axisColor} fontSize={12} />
                  <YAxis stroke={axisColor} fontSize={12} />
                  <RTooltip
                    contentStyle={{
                      background: mode === "dark" ? palette.darkCard : palette.lightCard,
                      border: `1px solid ${gridColor}`,
                      borderRadius: 10,
                      color: mode === "dark" ? palette.textPrimary : palette.lightText,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="reviews"
                    stroke={palette.primary}
                    fill="url(#naReviews)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="findings"
                    stroke={palette.info}
                    fill="url(#naFindings)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card title="Findings by severity">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityBreakdown}
                    dataKey="count"
                    nameKey="severity"
                    innerRadius={66}
                    outerRadius={100}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {severityBreakdown.map((slice) => (
                      <Cell key={slice.severity} fill={severityColors[slice.severity]} />
                    ))}
                  </Pie>
                  <RTooltip
                    contentStyle={{
                      background: mode === "dark" ? palette.darkCard : palette.lightCard,
                      border: `1px solid ${gridColor}`,
                      borderRadius: 10,
                      color: mode === "dark" ? palette.textPrimary : palette.lightText,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {severityBreakdown.map((s) => (
                <Tag
                  key={s.severity}
                  color={severityColors[s.severity]}
                  style={{ textTransform: "capitalize" }}
                >
                  {s.severity} · {s.count}
                </Tag>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Recent review runs" style={{ marginTop: 16 }}>
        <Table<ReviewRun>
          rowKey="id"
          columns={columns}
          dataSource={recentRuns}
          pagination={false}
          scroll={{ x: 760 }}
        />
      </Card>
    </>
  );
}
