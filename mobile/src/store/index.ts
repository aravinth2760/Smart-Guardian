import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/store/slices/authSlice";
import sosSettingsReducer from "@/store/slices/sosSettingsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sosSettings: sosSettingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
