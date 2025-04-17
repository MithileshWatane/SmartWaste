import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import reportRoutes from './routes/reportRoutes.js';
import chartRoutes from "./routes/chartRoutes.js";
import userRoutes from './routes/userRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import allUserRoutes from './routes/allUserRoutes.js';
import payment from './routes/payment.js';
import  locationRoutes from './routes/locationRoutes.js';


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Add Clerk authentication middleware
app.use(ClerkExpressWithAuth());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use("/api/reports/:id/:status",reportRoutes);
app.use('/api/reports', reportRoutes);
app.use("/api/charts", chartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use("/api/allusers", allUserRoutes);
app.use("/api/payment", payment);
app.use("/api/location", locationRoutes);
app.use('/api/user', userRoutes);




// Basic health check route
app.get('/', (req, res) => {
  res.send('Waste Management API is running');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Sign in ' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;