import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  googleId: {
    type: String,
    unique: true,
  },
  picture: String,
  cover_picture: String,
  allowed_to_signin: {
    type: Boolean,
    default: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  follows: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followed_by: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  token: String,
  role: {
    type: String,
    enum: ["user", "admin", "visitor"],
    default: "visitor",
    required: true,
  },
});

export default mongoose.model("User", UserSchema); // export the model
