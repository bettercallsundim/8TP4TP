import { combineReducers, configureStore } from "@reduxjs/toolkit";
import globalSlice from "./globalSlice";

export const rootReducer = combineReducers({
  globalSlice,
});
export const store = configureStore({
  reducer: rootReducer,
});
