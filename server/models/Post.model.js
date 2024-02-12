import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    post: String,
    photo: String,
    name: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    authorPhoto: String,
    category: {
      enum: ["Street Food", "Restaurant"],
      type: String,
      required: false,
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
        name: String,
        photo: String,
        comment: String,
        time: {
          type: Date,
          default: Date.now,
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
      default: Date.now,
    },
    location: String,
    approved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema); // export the model
