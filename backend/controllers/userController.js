import User from "../Models/User.js";

// ✅ Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserProfileByClerkId = async (req, res) => {
  try {
    const { clerkId } = req.params;
    
    const user = await User.findOne({ clerkId }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error in getUserProfileByClerkId:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getUserProfile = async (req, res) => {
  try {
    // req.user should be set by your auth middleware
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { username, email, displayName, location, profileImageUrl } = req.body;

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) req.user.username = username;
    if (email) req.user.email = email;
    if (displayName) req.user.displayName = displayName;
    if (location) req.user.location = location;
    if (profileImageUrl) req.user.profileImageUrl = profileImageUrl;

    await req.user.save();

    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Add green coins to user
export const addGreenCoins = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user.greenCoins += parseInt(amount);
    await req.user.save();

    res.status(200).json({ greenCoins: req.user.greenCoins });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Update user's total green coins
export const updateTotalGreenCoins = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Set the total coins rather than adding to them
    req.user.greenCoins = parseInt(amount);
    await req.user.save();
    
    res.status(200).json({ greenCoins: req.user.greenCoins });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
