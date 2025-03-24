import mongoose, { Schema, Document } from "mongoose";

interface Reservation extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  restaurantId: mongoose.Schema.Types.ObjectId;
  restaurantName: string;
  restaurantPicture: string;
  reservationDate: Date;
  people: number;
  discount: string;
  createdAt: Date;
}

const ReservationSchema = new Schema<Reservation>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  restaurantName: { type: String, required: true },
  restaurantPicture: { type: String, required: true },
  reservationDate: { type: Date, required: true },
  people: { type: Number, required: true },
  discount: { type: String, required: true, default: "0%" },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const ReservationModel = mongoose.models.Reservation || mongoose.model<Reservation>("Reservation", ReservationSchema);

export default ReservationModel;