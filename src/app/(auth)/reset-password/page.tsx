/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Form, Input, Typography } from "antd";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";

import bg from "@/assets/auth/Reset password-rafiki 1.png";
import { useResetPasswordMutation } from "@/redux/service/auth/authApi";
import Link from "next/link";

const { Title, Text } = Typography;

type ResetFormValues = {
  password: string;
  confirmPassword: string;
};

const SetNewPassWordPage = () => {
  const [form] = Form.useForm<ResetFormValues>();
  const [token, setToken] = useState<string | null>(null);

  const params = useSearchParams();
  const router = useRouter();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    setToken(params.get("token"));
  }, [params]);

  const onFinish = async (values: ResetFormValues) => {
    try {
      if (!token) {
        toast.error("Reset token not found. Please request a new reset link.");
        return;
      }

      const payload = { password: values.password, token };
      const res = await resetPassword(payload).unwrap();

      toast.success(res?.message || "Password reset successful!");
      router.push("/login");
    } catch (error: any) {
      const msg =
        error?.data?.message ||
        error?.error ||
        error?.message ||
        "Something went wrong. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="container min-h-[90vh] flex items-center justify-center py-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-7xl w-full p-4 md:p-8">
          {/* Left Side - Illustration */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="w-full max-w-md">
              <Link href="/login">
                <Image
                  width={600}
                  height={400}
                  src={bg}
                  alt="Set new password illustration"
                  priority
                  className="w-full h-auto"
                />
              </Link>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2">
            <div className="text-center mb-6 md:mb-8">
              <Title level={3} className="!mb-1">
                Set new password
              </Title>
              <Text type="secondary">Create a strong password for your account.</Text>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                onFinish={onFinish}
              >
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please enter your password" },
                    { min: 6, message: "Password must be at least 6 characters" },
                  ]}
                >
                  <Input.Password size="large" placeholder="••••••••••••" />
                </Form.Item>

                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Please confirm your password" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const pw = getFieldValue("password");
                        if (!value || value === pw) return Promise.resolve();
                        return Promise.reject(new Error("Passwords do not match"));
                      },
                    }),
                  ]}
                >
                  <Input.Password size="large" placeholder="••••••••••••" />
                </Form.Item>

                <Button
                  htmlType="submit"
                  size="large"
                  loading={isLoading}
                  disabled={!token}
                  className="w-full bg-[#004E60] hover:!bg-[#003b49] !text-white border-none"
                >
                  Continue
                </Button>

                {!token && (
                  <div className="mt-4 text-center text-sm text-red-500">
                    Reset token not found. Please request a new reset link.
                  </div>
                )}
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassWordPage;