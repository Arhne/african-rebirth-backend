import { Schema, model, Document } from "mongoose";
import dotenv from "dotenv";
import { User, UserPublicData } from "../interfaces/user.interface.js";
import jwt from "jsonwebtoken";
dotenv.config();

interface UserDocument extends User, Document {
  generateToken: () => string;
  getPublicData: () => UserPublicData;
}

const userSchema = new Schema<UserDocument>(
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

userSchema.methods.getPublicData = function (): UserPublicData {
  return {
    id: this._id,
    firstname: this.firstname,
    image: this.image,
    qrcode: this.qrcode,
    email: this.email,
    type: this.type,
    status: this.status,
    lastname: this.lastname,
  };
};

userSchema.methods.generateToken = function (): string {
  if (!process.env.TOKEN_SECRET) {
    throw new Error(
      "TOKEN_SECRET is not defined in your environment variables."
    );
  }
  const token = jwt.sign(this.getPublicData(), process.env.TOKEN_SECRET, {
    expiresIn: "10d",
  });
  return token;
};

export const userModel = model<UserDocument>("User", userSchema);
