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
      unique: true,
    },
    password: {
      type: String,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    itineraryPlan: {
      type: String,
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
    passport: {
      type: String,
      default: "",
    },
    inAttendance: {
      type: String,
      default: false,
    },
    status: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.methods.getPublicData = function (): UserPublicData {
  return {
    id: this._id,
    firstname: this.firstname,
    passport: this.passport,
    email: this.email,
    type: this.type,
    itineraryPlan: this.itineraryPlan,
    lastname: this.lastname,
    inAttendance: this.inAttendance,
    status: this.status,
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
