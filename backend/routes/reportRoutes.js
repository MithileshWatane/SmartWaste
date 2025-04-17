import express from 'express';
import { 
  createReport,
  getAllReports,
  getUserReports,
  getReportById,
  updateReport,
  deleteReport,
  updateReportStatus
} from '../controllers/reportController.js';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const router = express.Router();

// Apply Clerk authentication middleware to all routes
// This will ensure the user is authenticated via Clerk before accessing any route
const requireAuth = ClerkExpressRequireAuth();

// Create a new report
router.post('/', requireAuth, createReport);

// Get all reports
router.get('/', requireAuth, getAllReports);

// Get current user's reports
router.get('/user', requireAuth, getUserReports);

// Get a specific report by ID
router.get('/:id', requireAuth, getReportById);

// Update a report
router.put('/:id', requireAuth, updateReport);

// Delete a report
router.delete('/:id', requireAuth, deleteReport);

// Update report status (potentially admin-only)
router.put('/:id/:status', updateReportStatus);

export default router;