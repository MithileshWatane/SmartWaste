import Report from "../Models/Report.js";
import User from "../Models/User.js";

// get all data for pie chart
export const getAllData = async (req, res) => {
  try {
    const reports = await Report.find({});

    if (!reports) {
      res.status(404).json({ message: "reports not found.!" });
    }
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all users 
export const getAllUsers  = async(req,res) => {
   try {
      const users = await User.find({});
  
      if (!users) {
        res.status(404).json("no user found!");
      }
  
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
}

// update the status of report for a user 
export const updateReportStatus = async(req,res) => {
  const { _id } = req.params;
  const { status } = req.params;

  try {
    const updatedReport = await Report.findByIdAndUpdate(
      _id,
      { status },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ message: "Failed to update report status" });
  }
}