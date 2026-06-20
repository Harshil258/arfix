import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import productReducer from "./slices/productSlice";
import currentUserReucer from "./slices/currentUserSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    currentUser: currentUserReucer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
