import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../types/types";

export interface InitialAuthState {
  user: IUser | null;
  accessToken: string | null;
}

const initialState: InitialAuthState = {
  user: null,
  accessToken: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: IUser }>) => {
      state.user = action.payload.user;
    },
    removeCredentials: (state) => {
      state.user = null;
    },
    updateUserProperties: (
      state,
      action: PayloadAction<{
        username: string;
        website: string;
        city: string;
        coverPicture: string;
        profilePicture: string;
      }>,
    ) => {
      state.user!.username = action.payload.username;
      state.user!.website = action.payload.website;
      state.user!.city = action.payload.city;
    },
  },
});

export const { setCredentials, removeCredentials, updateUserProperties } =
  slice.actions;

export default slice.reducer;
