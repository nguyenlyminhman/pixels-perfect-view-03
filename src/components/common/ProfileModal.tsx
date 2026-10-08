import { Modal, Form, Input, Avatar, Tag, Space, App } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";

interface Values {
  fullName: string;
  email: string;
  avatar?: string;
}

export function ProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [form] = Form.useForm<Values>();
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const { message } = App.useApp();

  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar ?? "",
      });
      setAvatar(user.avatar ?? "");
    }
  }, [open, user, form]);

  const handleSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      await updateProfile(values);
      message.success("Profile updated.");
      onClose();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title="My Profile"
      onCancel={onClose}
      onOk={handleSave}
      okText="Save changes"
      confirmLoading={saving}
      destroyOnClose
    >
      <Space align="center" size={16} style={{ marginBottom: 16 }}>
        <Avatar size={56} src={avatar || undefined} icon={<UserOutlined />} />
        <Space direction="vertical" size={0}>
          <strong>{user?.username}</strong>
          <Tag color="purple" style={{ textTransform: "capitalize" }}>
            {user?.role}
          </Tag>
        </Space>
      </Space>
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="fullName"
          label="Full name"
          rules={[{ required: true, message: "Full name is required" }]}
        >
          <Input placeholder="Your name" />
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
        <Form.Item name="avatar" label="Avatar URL">
          <Input
            placeholder="https://..."
            onChange={(e) => setAvatar(e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
