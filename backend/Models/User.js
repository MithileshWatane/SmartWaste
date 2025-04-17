import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "",
    },
    profileImageUrl: {
      type: String,
      default: "",
    },
    greenCoins: {
      type: Number,
      default: 0,
    },
    // Add to your User schema
purchasedItems: {
  type: [mongoose.Schema.Types.ObjectId],
  ref: 'Listing',
  default: []
},
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
