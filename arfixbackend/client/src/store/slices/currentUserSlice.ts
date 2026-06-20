import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppUserRole } from "@/api/userApi";

export interface CurrentUserProfile {
  id: string;
  email: string;
  name: string;
  role: AppUserRole;
  mobile?: string | null;
}

interface CurrentUserState {
  user: CurrentUserProfile | null;
  token: string | null;
}

const initialState: CurrentUserState = {
  user: null,
  token: null,
};

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: CurrentUserProfile; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, logout } = currentUserSlice.actions;
export default currentUserSlice.reducer;
