/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Form, Input, Typography } from "antd";
import { toast } from "sonner";

import bg from "@/assets/auth/Forgot password-amico 1.png";
import { useForgatPasswordMutation } from "@/redux/service/auth/authApi";

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
  const [forgatPassword, { isLoading }] = useForgatPasswordMutation();
  const [email, setEmail] = useState("");

  const onFinish = async (values: { email: string }) => {
    try {
      await forgatPassword({ email: values.email }).unwrap();
      toast.success("Please check your email!")
      // localStorage.setItem("email", email)
      // router.push("/otp");
    } catch (error: any) {
      const msg =
        error?.data?.message ||
        error?.error ||
        error?.message ||
        "Something went wrong";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="container min-h-[90vh] flex items-center justify-center py-10">
        <div className="flex flex-col md:flex-row items-center gap-12 max-w-7xl w-full p-8">
          {/* Left Side - Illustration */}
          <div className="md:w-1/2 flex items-center justify-center">
            <div className="w-full max-w-md">
              <Link href={'/login'}>
                <Image
                  width={600}
                  height={400}
                  src={bg}
                  alt="Forgot password illustration"
                  priority
                />
              </Link>
            </div>
          </div>

          {/* Right Side - Forgot Password Form */}
          <div className="md:w-1/2 w-full">
            <div className="text-center mb-8">
              <Title level={3} className="!mb-0">
                Forgot Password
              </Title>
              <Text type="secondary">
                Enter your email and we’ll send you an OTP / reset step.
              </Text>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <Form
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ email }}
                requiredMark={false}
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="jane.doe@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Item>

                <Button
                  loading={isLoading}
                  htmlType="submit"
                  size="large"
                  className="w-full bg-[#004E60] hover:!bg-[#003b49] hover:!text-white text-white font-medium border-none"
                >
                  Reset your password
                </Button>
              </Form>

              <div className="mt-6 text-center text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  Login
                </Link>
              </div>
            </div>

            {/* Optional: small note */}
            <div className="mt-3 text-center text-xs text-gray-400">
              If you don’t see the email, check your spam folder.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;