import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "active",
    },
    type: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    qrcode: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
  },
  { versionKey: false, timestamps: true }
);

export const userModel = mongoose.model("User", userSchema);
