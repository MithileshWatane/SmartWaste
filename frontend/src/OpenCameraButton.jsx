/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from 'axios'

const OpenCameraButton = () => {
  const API_URL = import.meta.env.VITE_FLASK_API_URL; // Flask API URL from .env
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null); // Store coordinates

  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toISOString(),
          };
          setLocation(coords); // Store location in state
          console.log("Current Location:", coords);
        },
        (error) => {
          console.error("Error getting location:", error);
          // alert("Please allow location access.");
        }
      );
    } else {
      // alert("Geolocation is not supported by this browser.");
    }
  };

  const handleOpenCamera = async () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        console.log("Captured Location:", latitude, longitude);
        
        // Store location in MongoDB
        await storeLocation(latitude, longitude);

        // alert("Location stored in database!");
      });
    } else {
      // alert("Geolocation is not supported.");
    }

    setLoading(false);

    // now call the backend 
    setLoading(true);
    try {
      await fetch(`${API_URL}/open_camera`, { method: "GET" });
    } catch (error) {
      console.error("Error opening camera:", error);
    }
    setLoading(false);
  };

  const storeLocation = async (latitude, longitude) => {
    try {
      const response = await axios.post(`https://smartwaste-3smg.onrender.com/api/location/store-location`, { latitude, longitude });
      return response.data;
    } catch (error) {
      console.error("Error storing location:", error);
    }
  };
  
  const getAllLocations = async () => {
    try {
      const response = await axios.get(`${API_URL}/locations`);
      return response.data;
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  return (
    <button
    id="open-camera-btn"
    className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
    onClick={handleOpenCamera}
    disabled={loading} // Disable while API is being called
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
    {loading ? "Opening..." : "Open Camera"}
  </button>
  
  );
};

export default OpenCameraButton;
