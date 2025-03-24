import mongoose, { Schema, Document } from "mongoose";

interface Restaurant extends Document {
  name: string;
  address: string;
  phone: string;
  open_time: string;
  close_time: string;
  history: string;
  picture: string;
  discount_month: number;
}

const RestaurantSchema = new Schema<Restaurant>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  open_time: { type: String, required: true },
  close_time: { type: String, required: true },
  history: { type: String, required: true },
  picture: { type: String, required: true },
  discount_month: { type: Number, required: true },
}, { timestamps: true });

const RestaurantModel = mongoose.models.Restaurant || mongoose.model<Restaurant>("Restaurant", RestaurantSchema);

export default RestaurantModel;