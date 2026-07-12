import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  defaultSOSSettings,
  SOSSettings,
} from "@/services/sos-settings.service";

const slice = createSlice({
  name: "sosSettings",
  initialState: defaultSOSSettings,

  reducers: {
    setSOSSettings: (_, action: PayloadAction<SOSSettings>) => action.payload,

    updateSOSSettings: (state, action: PayloadAction<Partial<SOSSettings>>) => {
      Object.assign(state, action.payload);
    },

    resetSOSSettings: () => defaultSOSSettings,
  },
});

export const { setSOSSettings, updateSOSSettings, resetSOSSettings } =
  slice.actions;

export default slice.reducer;
