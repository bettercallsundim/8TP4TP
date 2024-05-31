import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    image: String,
    status: {
      type: String,
      enum: ["pending", "sent","delivered","seen"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
