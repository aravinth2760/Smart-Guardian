import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  firebaseUid: string;
  phoneNumber: string | null;

  name?: string;
  email?: string;
  role?: "parent" | "child" | "neighbour";
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setUser: (state, action: PayloadAction<Partial<User>>) => {
      state.user = {
        ...(state.user ?? {}),
        ...action.payload,
      } as User;
    },

    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
