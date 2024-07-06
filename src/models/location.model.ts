import { Schema, model, Document } from "mongoose";

const locationSchema = new Schema(
  {
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: false, versionKey: false }
);

export const locationModel = model("Location", locationSchema);
