import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  post: String,
  photo: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  tags: [],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      comment_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: String,
      time: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  isPaid: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  time: {
    type: Date,
    default: Date.now(),
  },
  location: String,
  approved: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Post", PostSchema); // export the model
