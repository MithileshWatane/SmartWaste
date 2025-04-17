import Location from "../Models/Location.js";

// Store location in database
export const storeLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and Longitude are required." });
    }

    const newLocation = new Location({ latitude, longitude });
    await newLocation.save();

    res.status(201).json({ message: "Location stored successfully.", data: newLocation });
  } catch (error) {
    res.status(500).json({ message: "Error storing location.", error });
  }
};

// Get all stored locations
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json({ success: true, count: locations.length, locations });
  } catch (error) {
    res.status(500).json({ message: "Error fetching locations.", error });
  }
};
