import express from "express";
import { requireAuth, attachUser } from "../middleware/authMiddleware.js";
import { getCurrentUser, updateUserProfile, addGreenCoins ,updateTotalGreenCoins , getUserProfile , getUserProfileByClerkId} from "../controllers/userController.js";
import { Clerk } from "@clerk/clerk-sdk-node";
import dotenv from 'dotenv';

dotenv.config();

const clerk = new Clerk({ apiKey: process.env.CLERK_SECRET_KEY});

const router = express.Router();
router.get("/:clerkId", async (req, res) => {
    try {
        const { clerkId } = req.params;
        const clerkUser = await clerk.users.getUser(clerkId);

        console.log(clerkUser);

        res.json({
            name: clerkUser.firstName || "Unknown",
            email: clerkUser.emailAddresses?.[0]?.emailAddress || "No email",
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});
router.get('/profile/:clerkId',  getUserProfileByClerkId);

// ✅ Protected routes
router.get("/me", requireAuth, attachUser, getCurrentUser);
router.put("/profile", requireAuth, attachUser, updateUserProfile);
router.post("/green-coins", requireAuth, attachUser, addGreenCoins);
router.post('/update-coins',  requireAuth, attachUser, updateTotalGreenCoins);
router.get('/one', requireAuth, attachUser, getUserProfile);


export default router;
