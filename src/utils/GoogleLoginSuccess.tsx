"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/auth";
import { getDashboardPathByRole, normalizeRole } from "@/utils/roles";

interface UserType {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const GoogleLoginSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken) {
      router.push("/login");
      return;
    }

    try {
      const decodedUser = jwtDecode<UserType>(accessToken);
      const normalizedUser = {
        ...decodedUser,
        role: normalizeRole(decodedUser.role),
      };

      // Save in Redux
      dispatch(
        setUser({
          user: normalizedUser,
          accessToken,
          refreshToken,
        })
      );

      // Save in Cookies
      const accessTokenExpiry = new Date(normalizedUser.exp * 1000);
      const refreshTokenExpiry = new Date();
      refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 30);

      Cookies.set("accessToken", accessToken, {
        expires: accessTokenExpiry,
        path: "/",
      });

      if (refreshToken) {
        Cookies.set("refreshToken", refreshToken, {
          expires: refreshTokenExpiry,
          path: "/",
        });
      }

      router.push(getDashboardPathByRole(normalizedUser.role));
    } catch (error) {
      console.error("Google login failed:", error);
      router.push("/login");
    }
  }, [dispatch, router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold">Signing you in with Google...</h2>
        <p className="text-gray-500">Please wait</p>
      </div>
    </div>
  );
};

export default GoogleLoginSuccess;
