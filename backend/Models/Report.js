import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  user: { type: String, required: true }, // User who reported
  waste_type: {
    type: String,
    enum: [
      "plastic",
      "paper",
      "glass",
      "metal",
      "electronic",
      "organic",
      "construction",
      "hazardous",
      "Garbage",
      "other",
    ],
    required: true,
  },
  estimated_quantity: {
    type: String,
    enum: [
      "small", // < 5kg
      "medium", // 5-20kg
      "large", // 20-100kg
      "very-large", // > 100kg
    ],
    required: true,
  },
  location_type: {
    type: String,
    enum: [
      "street", // Street/Sidewalk
      "park", // Park/Garden
      "beach", // Beach/Waterfront
      "forest", // Forest/Natural Area
      "residential", // Residential Area
      "commercial", // Commercial Area
      "Public Place", 
      "other", // Other
    ],
    required: true,
  },
  description: { type: String, required: true },
  location: { type: String, required: true }, // Simple string for location
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  coinsEarned: { type: Number, default: 0 }, // Coins awarded for the report
  status: { type: String, enum: ["pending", "accepted"], default: "pending" }, // Report status
  reportedAt: { type: Date, default: Date.now }, // Date of reporting
});

const Report = mongoose.model("Report", ReportSchema);

export default Report;
