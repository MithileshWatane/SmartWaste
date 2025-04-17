import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Location = mongoose.model("Location", LocationSchema);
export default Location;