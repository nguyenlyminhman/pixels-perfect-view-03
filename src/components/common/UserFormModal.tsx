import { App, Button, Form, Input, Modal, Select } from "antd";
import {
  LockOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import type { Role, User } from "@/types";

interface Values {
  username: string;
  fullName: string;
  email: string;
  role: Role;
  password?: string;
}

const roleOptions: Array<{ value: Role; label: string; hint: string }> = [
  {
    value: "admin",
    label: "Admin",
    hint: "Full access — manages users, repositories and review policies.",
  },
  {
    value: "approver",
    label: "Approver",
    hint: "Can approve or reject findings flagged by the agent.",
  },
  {
    value: "viewer",
    label: "Viewer",
    hint: "Read-only access to runs, findings and dashboards.",
  },
];

const strengthLabels = ["Too short", "Weak", "Fair", "Strong", "Excellent"];

function scorePassword(pw: string): number {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (pw.length >= 12) score += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score += 1;
  return Math.min(score, 4);
}

export function UserFormModal({
  open,
  user,
  onClose,
  onSaved,
}: {
  open: boolean;
  /** When set, the modal shows/edits this user; otherwise it creates a new one. */
  user?: User | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form] = Form.useForm<Values>();
  const [saving, setSaving] = useState(false);
  const { message } = App.useApp();
  const isEdit = Boolean(user);

  const role = Form.useWatch("role", form);
  const password = Form.useWatch("password", form) ?? "";
  const roleHint = roleOptions.find((option) => option.value === role)?.hint;
  const score = scorePassword(password);

  useEffect(() => {
    if (!open) return;
    if (user) {
      form.setFieldsValue({
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      });
    } else {
      form.resetFields();
    }
  }, [open, user, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      if (isEdit && user) {
        await userService.update(user.id, {
          username: values.username,
          fullName: values.fullName,
          email: values.email,
          role: values.role,
        });
        message.success("User updated.");
      } else {
        await userService.create({
          username: values.username,
          fullName: values.fullName,
          email: values.email,
          role: values.role,
          password: values.password!,
        });
        message.success("User created.");
      }
      onSaved();
      onClose();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Could not save user.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      className="na-user-modal"
      title={
        <div className="na-um-head">
          <span className="na-um-accent" aria-hidden="true" />
          <div>
            <div className="na-um-title">{isEdit ? "User Details" : "Create User"}</div>
            <div className="na-um-sub">
              {isEdit
                ? "Review or update this account's identity and access level."
                : "Provision a new account and assign the level of access it needs."}
            </div>
          </div>
        </div>
      }
      footer={
        <div className="na-um-foot">
          <span className="na-um-foot-note">
            {isEdit ? `Editing @${user?.username}` : "All fields required"}
          </span>
          <div className="na-um-foot-actions">
            <Button className="na-um-ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="na-um-primary"
              type="primary"
              loading={saving}
              icon={isEdit ? undefined : <UserAddOutlined />}
              onClick={handleOk}
            >
              {isEdit ? "Save changes" : "Create user"}
            </Button>
          </div>
        </div>
      }
      width={560}
      centered
      destroyOnHidden
      onCancel={onClose}
    >
      <Form form={form} layout="vertical" requiredMark={false} className="na-um-form">
        <div className="na-um-grid">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input
              className="na-mono"
              prefix={<span className="na-um-at">@</span>}
              placeholder="jane.doe"
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item
            name="fullName"
            label="Full name"
            rules={[{ required: true, message: "Full name is required" }]}
          >
            <Input
              prefix={<UserOutlined className="na-um-prefix" />}
              placeholder="Ava Nguyen"
            />
          </Form.Item>
          <Form.Item
            className="na-um-span"
            name="email"
            label="Email address"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input
              className="na-mono"
              prefix={<MailOutlined className="na-um-prefix" />}
              placeholder="you@company.com"
            />
          </Form.Item>
          <Form.Item
            className="na-um-span"
            name="role"
            label="Access level"
            extra={roleHint}
            rules={[{ required: true, message: "Role is required" }]}
          >
            <Select
              placeholder="Select a role"
              suffixIcon={<SafetyCertificateOutlined className="na-um-prefix" />}
              options={roleOptions.map(({ value, label }) => ({ value, label }))}
            />
          </Form.Item>
          {!isEdit && (
            <Form.Item
              className="na-um-span"
              name="password"
              label="Password"
              extra={
                <div className="na-um-strength" data-score={score}>
                  <span className="na-um-strength-bars" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="na-um-strength-label">{strengthLabels[score]}</span>
                  <span className="na-um-strength-rule">min. 8 characters</span>
                </div>
              }
              rules={[
                { required: true, message: "Password is required" },
                { min: 8, message: "Use at least 8 characters" },
              ]}
            >
              <Input.Password
                className="na-mono"
                prefix={<LockOutlined className="na-um-prefix" />}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </Form.Item>
          )}
        </div>
      </Form>
    </Modal>
  );
}
