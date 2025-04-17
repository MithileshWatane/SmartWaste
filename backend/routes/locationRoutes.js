import express from "express";
import { storeLocation, getAllLocations } from "../controllers/locationController.js";

const router = express.Router();

router.post("/store-location", storeLocation);
router.get("/get-location", getAllLocations);

export default router;
