import express from 'express';
import { getAllData } from "../controllers/adminController.js";

const router = express.Router();

// get reports data 
router.get("/",getAllData);

export default router;
