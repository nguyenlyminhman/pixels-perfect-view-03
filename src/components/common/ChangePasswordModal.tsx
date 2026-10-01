import { Modal, Form, Input, App } from "antd";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";

interface Values {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ChangePasswordModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const changePassword = useAuthStore((s) => s.changePassword);
  const [form] = Form.useForm<Values>();
  const [saving, setSaving] = useState(false);
  const { message } = App.useApp();

  const handleOk = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      await changePassword(values.currentPassword, values.newPassword);
      message.success("Password changed.");
      form.resetFields();
      onClose();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Could not change password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Change Password"
      okText="Update password"
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleOk}
      confirmLoading={saving}
      destroyOnClose
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="currentPassword"
          label="Current password"
          rules={[{ required: true, message: "Current password is required" }]}
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="New password"
          rules={[
            { required: true, message: "New password is required" },
            { min: 8, message: "Use at least 8 characters" },
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm new password"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm the new password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
