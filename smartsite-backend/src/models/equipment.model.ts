import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String },
    serialNumber: { type: String, unique: true },
    model: { type: String },
    brand: { type: String },
    purchaseDate: { type: Date },
    lastMaintenanceDate: { type: Date },
    location: { type: String },
    availability: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Equipment", equipmentSchema);
