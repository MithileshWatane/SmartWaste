import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    materialType: {
      type: String,
      required: true,
      enum: ["Plastic", "Paper", "Metal", "Glass", "Electronics", "Organic", "Other"],
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
      default: "kg",
    },
    price: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Pending", "Sold"],
      default: "Available",
    },
    isInDemand: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
