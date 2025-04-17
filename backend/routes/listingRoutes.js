import express from "express";
import { requireAuth, attachUser } from "../middleware/authMiddleware.js";
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getUserListings,
  purchaseListing,
  getPurchasedListings
} from "../controllers/listingController.js";

const router = express.Router();
router.get('/purchased', requireAuth, attachUser, getPurchasedListings);
router.patch("/:listingId",updateListing)
// Public routes
router.get("/", getListings);
router.get("/:id", getListingById);

// Protected routes
router.post("/", createListing);
router.delete("/:id", requireAuth, attachUser, deleteListing);
router.get("/user/me", requireAuth, attachUser, getUserListings);
router.post('/purchase', requireAuth, attachUser, purchaseListing);

export default router;

