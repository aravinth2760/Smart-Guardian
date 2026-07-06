import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "@/types/auth";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isNewUser: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
        isNewUser: boolean;
      }>,
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isNewUser = action.payload.isNewUser;
    },

    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },

    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },

    setRefreshToken(state, action: PayloadAction<string>) {
      state.refreshToken = action.payload;
    },

    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isNewUser = false;
    },
  },
});

export const { login, setUser, setAccessToken, setRefreshToken, logout } =
  authSlice.actions;

export default authSlice.reducer;
