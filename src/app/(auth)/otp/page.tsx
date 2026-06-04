/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Typography } from "antd";
import type { InputRef } from "antd";
import { appAlert } from "@/utils/appAlert";
import bg from "@/assets/auth/Enter OTP-rafiki 1.png";
import { useResendOtpMutation, useVerifyUserMutation } from "@/redux/service/auth/authApi";
import { toast } from "sonner";

const { Title, Text } = Typography;

const OTPage = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [email, setEmail] = useState<string | null>(null);

  const inputRefs = useRef<(InputRef | null)[]>([]);

  const [verifyUser, { isLoading }] = useVerifyUserMutation();
  const [resendOtp, { isLoading: isResendingOtp }] = useResendOtpMutation()
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("email");
    setEmail(stored);
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const paste = e.clipboardData.getData("text").trim().slice(0, 6);
    if (!/^\d{1,6}$/.test(paste)) return;

    const digits = paste.split("");
    const filled = Array.from({ length: 6 }, (_, i) => digits[i] ?? "");
    setOtp(filled);

    const nextIndex = Math.min(digits.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const onFinish = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      appAlert.fire({
        icon: "error",
        title: "Invalid OTP",
        text: "Please enter the 6-digit OTP.",
      });
      return;
    }

    try {
      if (!email) {
        appAlert.fire({
          icon: "error",
          title: "Verification failed",
          text: "Email not found. Please register again.",
        });
        return;
      }

      const res = await verifyUser({ email, otp: otpValue }).unwrap();

      if (res?.success) {
        appAlert.fire({
          icon: "success",
          title: "Verification successful 🎉",
          text: res?.message || "Your email has been verified.",
          timer: 2000,
          showConfirmButton: false,
        });

        localStorage.removeItem("email");
        router.push("/login");
      } else {
        appAlert.fire({
          icon: "error",
          title: "Verification failed",
          text: res?.message || "Invalid OTP.",
        });
      }
    } catch (err: any) {
      appAlert.fire({
        icon: "error",
        title: "Verification failed",
        text: err?.data?.message || err?.message || "Something went wrong.",
      });
    }
  };
  const handleResendOtp = async () => {
    try {
      localStorage.getItem("email")
      await resendOtp(email).unwrap()
      toast.success("Opt resend success!")
    } catch (error: any) {
      const msg =
        error?.data?.message ||
        error?.error ||
        error?.message ||
        "Something went wrong. Please try again.";
      toast.error(msg);
    }
  }
  return (
    <div className=" flex items-center justify-center p-4">
      <div className="container min-h-[85vh] flex items-center justify-center py-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-7xl w-full p-4 md:p-8">
          {/* Illustration */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <Link href="/" className="w-full max-w-md">
              <Image
                width={600}
                height={400}
                src={bg}
                alt="OTP verification illustration"
                priority
                className="w-full h-auto"
              />
            </Link>
          </div>

          {/* OTP Form */}
          <div className="w-full md:w-1/2">
            <div className="text-center mb-6 md:mb-8">
              <Title level={3} className="!mb-1">
                Email Verification
              </Title>
              <Text type="secondary">Enter the 6-digit code sent to your email</Text>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <Form onFinish={onFinish}>
                {/* ✅ Responsive OTP Container */}
                <div
                  className="mx-auto mb-6 flex flex-wrap justify-center gap-2 sm:gap-3 max-w-[280px] sm:max-w-[360px]"
                  onPaste={handlePaste}
                >
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      size="large"
                      maxLength={1}
                      value={digit}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      inputMode="numeric"
                      //  responsive box sizes
                      className="!w-10 !h-10 sm:!w-12 sm:!h-12 text-center text-base sm:text-lg font-semibold"
                    />
                  ))}
                </div>

                <Button
                  htmlType="submit"
                  size="large"
                  loading={isLoading}
                  className="w-full bg-[#004E60] hover:!bg-[#003b49] !text-white border-none"
                >
                  Continue
                </Button>
              </Form>
              <div className="text-center underline mt-2">
                <button onClick={handleResendOtp} className="underline"> {
                  isResendingOtp ? "Resending" : "Resend again"
                }</button>
              </div>
              {!email && (
                <div className="mt-4 text-center text-sm text-red-500">
                  Email not found. Please register again.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPage;