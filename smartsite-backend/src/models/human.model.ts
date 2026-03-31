import mongoose from "mongoose";

const humanSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    cin: { type: String, required: true, unique: true },
    birthDate: { type: Date, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true },
    cvUrl: { type: String },
    imageUrl: { type: String },
    availability: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Human", humanSchema);
