import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, Form, Input, Button, Checkbox, Alert, Typography, Space } from "antd";
import { UserOutlined, LockOutlined, ThunderboltFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { brandGradient, palette } from "@/theme/tokens";

const { Title, Text } = Typography;

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — NosyAgentic" },
      {
        name: "description",
        content: "Sign in to NosyAgentic, the AI code review dashboard for your pull requests.",
      },
      { property: "og:title", content: "Sign in — NosyAgentic" },
      {
        property: "og:description",
        content: "Sign in to NosyAgentic, the AI code review dashboard for your pull requests.",
      },
    ],
  }),
  component: LoginPage,
});

interface Values {
  username: string;
  password: string;
  remember: boolean;
}

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/dashboard", replace: true });
  }, [isAuthenticated, navigate]);

  const onFinish = async (values: Values) => {
    setError(null);
    setLoading(true);
    try {
      await login(values);
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="na-login-bg">
      <Card className="na-login-card" variant="borderless">
        <Space direction="vertical" size={4} style={{ width: "100%", marginBottom: 20 }}>
          <Space size={10} align="center">
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: brandGradient,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: palette.darkBg,
                fontSize: 18,
              }}
            >
              <ThunderboltFilled />
            </span>
            <Title level={3} className="na-gradient-text" style={{ margin: 0 }}>
              NosyAgentic
            </Title>
          </Space>
          <Text type="secondary">AI code review for every pull request.</Text>
        </Space>

        {error && (
          <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />
        )}

        <Form<Values>
          layout="vertical"
          requiredMark={false}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder="admin"
              autoComplete="username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Button type="primary" size="large" htmlType="submit" block loading={loading}>
            Sign in
          </Button>
        </Form>

        <Text type="secondary" style={{ display: "block", marginTop: 16, fontSize: 12 }}>
          Demo accounts: <span className="na-mono">admin / admin123</span>,{" "}
          <span className="na-mono">approver / approver123</span>,{" "}
          <span className="na-mono">viewer / viewer123</span>
        </Text>
      </Card>
    </div>
  );
}
