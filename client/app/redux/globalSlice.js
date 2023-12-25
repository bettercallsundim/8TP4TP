import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
  name: "globalSlice",
  initialState: {
    user: "",
    token: "",
  },
  reducers: {
    setUser(state, { payload: { email, name, picture, sub } }) {
      state.user = {
        email,
        name,
        picture,
        id: sub,
      };
      console.log(state.user, "from redux");
    },
    setToken(state, { payload: { token } }) {
      state.token = token;
    },
    logOut(state) {
      state.user = "";
      console.log("from redux : logout called");
    },
  },
});
export const { setUser, logOut, setToken } = globalSlice.actions;
export default globalSlice.reducer;
