import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    resetPasswordToken: {
      type: String,
      default: null,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
      required: false,
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
