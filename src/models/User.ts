import mongoose, { Schema, Document } from "mongoose";

interface User extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: Date;
  role: string;
}

const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  birthday: { type: Date },
  role: { type: String, default: "user" },
}, { timestamps: true });

const UserModel = mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default UserModel;