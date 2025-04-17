const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");

exports.clerkAuthMiddleware = ClerkExpressWithAuth({
  onSuccess: async (req, res, next) => {
    req.userId = req.auth.userId; // Get user ID from Clerk
    next();
  },
  onFailure: (req, res) => {
    res.status(401).json({ success: false, message: "Unauthorized" });
  },
});
