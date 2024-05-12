import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
  name: "globalSlice",
  initialState: {
    user: "",
    token: "",
    posts: [],
    commentRequestPostID: "",
    friendsConvo: {},
  },
  reducers: {
    setUser(state, { payload: { email, name, picture, googleId, _id } }) {
      state.user = {
        email,
        name,
        picture,
        googleId,
        _id,
      };
    },
    addPostRedux(state, { payload: { post, name, time, photo, authorPhoto } }) {
      state.posts.push({
        post,
        name,
        time,
        photo,
        authorPhoto,
      });
    },
    setToken(state, { payload: { token } }) {
      state.token = token;
    },
    setCommentRequestPostID(state, { payload: { id } }) {
      state.commentRequestPostID = id;
    },
    logOut(state) {
      state.user = null;
      state.token = "";


    },
    setFriendsConvoRedux(state, { payload: { friendsConvo } }) {
      state.friendsConvo = { ...friendsConvo };
    },
  },
});
export const {
  setUser,
  logOut,
  setToken,
  addPostRedux,
  setCommentRequestPostID,
  setFriendsConvoRedux,
} = globalSlice.actions;
export default globalSlice.reducer;
