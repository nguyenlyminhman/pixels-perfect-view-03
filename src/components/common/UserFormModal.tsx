import { Modal, Form, Input, Select, App } from "antd";
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

  useEffect(() => {
    if (!open) return;
    if (user) {
      form.setFieldsValue({
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        password: undefined,
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
      title={isEdit ? "User Details" : "Create User"}
      okText={isEdit ? "Save changes" : "Create user"}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={saving}
      destroyOnClose
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Username is required" }]}
        >
          <Input placeholder="e.g. jane.doe" autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="fullName"
          label="Full name"
          rules={[{ required: true, message: "Full name is required" }]}
        >
          <Input placeholder="Full name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input placeholder="you@company.com" />
        </Form.Item>
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Role is required" }]}
        >
          <Select
            placeholder="Select a role"
            options={[
              { value: "admin", label: "Admin" },
              { value: "approver", label: "Approver" },
              { value: "viewer", label: "Viewer" },
            ]}
          />
        </Form.Item>
        {!isEdit && (
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 8, message: "Use at least 8 characters" },
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
