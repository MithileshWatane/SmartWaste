import Listing from "../Models/Listing.js";

// ✅ Get all listings
export const getListings = async (req, res) => {
  try {
    const { materialType, search } = req.query;
    let query = {};

    // Filter by material type
    if (materialType && materialType !== "All Materials") {
      query.materialType = materialType;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const listings = await Listing.find(query)
      .populate("user", "username displayName profileImageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get listing by ID
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "user",
      "username displayName profileImageUrl location"
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Create a new listing
export const createListing = async (req, res) => {
  try {
    const { title, description, materialType, quantity, unit, price, amount , location, imageUrl } = req.body;

  

    const newListing = await Listing.create({
      title,
      description,
      materialType,
      quantity,
      unit,
      price,
      amount,
      location,
      imageUrl,
      isInDemand: ["Plastic", "Metal"].includes(materialType), // Example logic for in-demand materials
    });


    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update listing
export const updateListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { price } = req.body;

    if (!listingId || price === undefined) {
        return res.status(400).json({ message: "Listing ID and price are required" });
    }

    // Find and update the listing
    const updatedListing = await Listing.findByIdAndUpdate(
        listingId,
        { price: parseInt(price) || 0 }, 
        { new: true } // Return updated document
    );

    if (!updatedListing) {
        return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({ message: "Price updated successfully", listing: updatedListing });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
}
};

// ✅ Delete listing
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if user owns this listing
    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this listing" });
    }

    await listing.deleteOne();

    res.status(200).json({ message: "Listing removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get user listings
export const getUserListings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const listings = await Listing.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Add this to your backend controllers
export const purchaseListing = async (req, res) => {
  try {
    const { listingId, price } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    // Check if user has enough coins
    if (req.user.greenCoins < price) {
      return res.status(400).json({ message: "Not enough GreenCoins" });
    }
    
   // In your purchaseListing controller
     req.user.greenCoins -= price;
     req.user.purchasedItems = req.user.purchasedItems || [];
     req.user.purchasedItems.push(listingId);
     await req.user.save();
    
    // Optional: Update the listing as sold or mark it as contacted
    // const listing = await Listing.findById(listingId);
    // listing.contacted = true;
    // await listing.save();
    
    res.status(200).json({ 
      message: "Purchase successful", 
      remainingCoins: req.user.greenCoins 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};// Controller function to get purchased items
export const getPurchasedListings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    // Fetch listings that the user has purchased
    const purchasedListings = await Listing.find({ 
      _id: { $in: req.user.purchasedItems || [] } 
    });
    
    res.status(200).json(purchasedListings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user's total green coins
export const updateGreenCoins = async (req, res) => {
  try {
    const { price } = req.body;
    
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Set the total coins rather than adding to them
    req.user.price = parseInt(amount);
    await req.user.save();
    
    res.status(200).json({ greenCoins: req.user.greenCoins });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
