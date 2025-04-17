import Report from '../Models/Report.js';

// Create a new report
export const createReport = async (req, res) => {
  try {
    // Get the authenticated user's Clerk ID from the request
    const userId = req.auth.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const reportData = {
      ...req.body,
      user: userId
    };
    
    const report = new Report(reportData);
    await report.save();
    
    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get all reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get reports by user
export const getUserReports = async (req, res) => {
  try {
    const userId = req.auth.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const reports = await Report.find({ user: userId });
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching user reports:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get a specific report
export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.status(200).json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update a report
export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.auth.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const report = await Report.findById(id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Check if the user owns this report
    if (report.user.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own reports' });
    }
    
    const updatedReport = await Report.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedReport);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete a report
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.auth.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const report = await Report.findById(id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Check if the user owns this report
    if (report.user.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own reports' });
    }
    
    await Report.findByIdAndDelete(id);
    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update report status (for admin)
export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'accepted'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const report = await Report.findById(id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // You might want to add additional admin check here
    
    report.status = status;
    
    // If status is changing to accepted and coins haven't been awarded yet
    if (status === 'accepted' && report.coinsEarned === 0) {
      // Simple algorithm for coins: small=10, medium=20, large=30, very-large=50
      const coinMapping = {
        'small': 10,
        'medium': 20,
        'large': 30,
        'very-large': 50
      };
      
      report.coinsEarned = coinMapping[report.estimated_quantity] || 10;
    }
    
    await report.save();
    res.status(200).json(report);
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(400).json({ message: error.message });
  }
};