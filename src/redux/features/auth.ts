import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { normalizeRole } from "@/utils/roles";

export type UserType = {
  name?: string;
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

interface AuthState {
  user: UserType | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{
        user: UserType | null;
        accessToken: string | null;
        refreshToken: string | null;
      }>,
    ) {
      state.user = action.payload.user
        ? { ...action.payload.user, role: normalizeRole(action.payload.user.role) }
        : null;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoading = false;
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
    setRefreshToken(state, action: PayloadAction<string | null>) {
      state.refreshToken = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    logout(state) {
      // 1. Clear Redux state
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;

      // 2. Clear Local Storage (if used)
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // 3. Clear Auth Cookies
        // We set the date to 1970 to force immediate expiration
        const cookiesToClear = ["accessToken", "refreshToken", "roll"];
        cookiesToClear.forEach((cookieName) => {
          document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`;
        });
        // 4. Hard redirect to clear all cache and reset the app state
        window.location.href = "/login";
      }
    },
  },
});

export const {
  setUser,
  setAccessToken,
  setRefreshToken,
  setIsLoading,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
