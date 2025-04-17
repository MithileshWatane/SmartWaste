import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import User from "../Models/User.js";

// ✅ Middleware to require Clerk authentication
export const requireAuth = ClerkExpressRequireAuth({});

// ✅ Middleware to attach user to request
export const attachUser = async (req, res, next) => {
  if (!req.auth || !req.auth.userId) {
    return next();
  }

  try {
    let user = await User.findOne({ clerkId: req.auth.userId });

    if (!user) {
      // If user doesn't exist in our database yet, create them
      const { userId } = req.auth;

      user = await User.create({
        clerkId: userId,
        username: `user_${userId.substring(0, 8)}`,
        email: `user_${userId.substring(0, 8)}@example.com`, // Placeholder
        displayName: `User ${userId.substring(0, 8)}`,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Error in attachUser middleware:", error);
    next(error);
  }
};
