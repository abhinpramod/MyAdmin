import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  token: localStorage.getItem("token") || null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    loginAdmin: (state, action) => {
      state.admin = action.payload; // Store admin data
      state.token = action.payload.token; // Store token
      localStorage.setItem("token", action.payload.token);
    },
    logoutAdmin: (state) => {
      state.admin = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { loginAdmin, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
