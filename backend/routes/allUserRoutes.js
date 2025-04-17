import express from 'express';
import { getAllUsers } from "../controllers/adminController.js";

const router = express.Router();

// get all users 
router.get("/",getAllUsers);

export default router;
