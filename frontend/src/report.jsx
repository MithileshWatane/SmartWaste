/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import  {useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';





export default function Report() {
  
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [token, setToken] = useState(null);

  
  const [formData, setFormData] = useState({
    waste_type: '',
    estimated_quantity: 'small',
    location_type: 'street',
    location: '',
    description: '',
    latitude: null,
    longitude: null,
    coinsEarned: 0 // Add this field to track the coins in the form data

  });


  // Custom icon to fix missing marker issue
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Component to handle map centering and updates
const MapController = ({ coordinates, setCoordinates, locateMe, resetLocateMe, setFormData }) => {
  const map = useMap();
  
  // Handle location button click
  useEffect(() => {
    if (locateMe) {
      map.locate({
        setView: true,
        maxZoom: 16
      });
      resetLocateMe(); // Reset the trigger after attempting to locate
    }
  }, [map, locateMe, resetLocateMe]);
  
  // Handle map events
  useMapEvents({
    locationfound(e) {
      const latitude = e.latlng.lat;
      const longitude = e.latlng.lng;
      setCoordinates({ latitude, longitude });
      // Update form data with new coordinates
      setFormData(prev => ({ ...prev, latitude, longitude }));
      map.flyTo(e.latlng, 16);
    },
    locationerror(e) {
      console.error("Location error:", e.message);
      alert("Could not access your location. Please allow location access or manually select a location on the map.");
      resetLocateMe();
    },
    click(e) {
      const latitude = e.latlng.lat;
      const longitude = e.latlng.lng;
      setCoordinates({ latitude, longitude });
      // Update form data with new coordinates
      setFormData(prev => ({ ...prev, latitude, longitude }));
    }
  });
  
  // Update map when coordinates change
  useEffect(() => {
    if (coordinates.latitude && coordinates.longitude) {
      map.flyTo([coordinates.latitude, coordinates.longitude], 16);
    }
  }, [map, coordinates]);
  
  return null;
};
    // Fetch user reports
    // Fetch token first and then trigger the API call
  useEffect(() => {
    const fetchToken = async () => {
      const fetchedToken = await getToken();
      if (fetchedToken) setToken(fetchedToken);
    };

    fetchToken();
  }, [getToken]); // Runs when `getToken` changes





  useEffect(() => {
    if (useCurrentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
          setFormData(prev => ({ ...prev, latitude, longitude }));
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your current location. Please enter location manually.');
          setUseCurrentLocation(false);
        }
      );
    }
  }, [useCurrentLocation]);
    // Calculate GreenCoins based on waste quantity whenever quantity changes
    useEffect(() => {
      // Calculate coins based on quantity
      const calculateCoins = () => {
        switch(formData.estimated_quantity) {
          case 'small': return 20;
          case 'medium': return 40;
          case 'large': return 60;
          case 'very-large': return 80;
          default: return 30;
        }
      };
      
      const coins = calculateCoins();
      setFormData(prev => ({ ...prev, coinsEarned: coins }));
    }, [formData.estimated_quantity]);
  
    // Debug log whenever formData changes
    useEffect(() => {
      console.log('Form data updated:', formData);
    }, [formData]);


  const handleWasteTypeChange = (e) => {
    setFormData({
      ...formData,
      waste_type: e.target.value
    });
  };

  const handleQuantityChange = (e) => {
    setFormData({
      ...formData,
      estimated_quantity: e.target.value
    });
  };

  const handleLocationTypeChange = (e) => {
    setFormData({
      ...formData,
      location_type: e.target.value
    });
  };

  const handleAddressChange = (e) => {
    setFormData({
      ...formData,
      location: e.target.value
    });
  };

  const handleDescriptionChange = (e) => {
    setFormData({
      ...formData,
      description: e.target.value
    });
  };

 // Create a reusable function to fetch reports
 const fetchReports = async (retryCount = 0) => {
  if (!token) {
    console.log("No token available, skipping fetch");
    return;
  }
  
  try {
    setLoading(true);
    console.log("Fetching reports with token:", token.substring(0, 10) + "...");
    
    const response = await axios.get("https://smartwaste-3smg.onrender.com/api/reports/user", {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000 // Set a timeout of 10 seconds
    });
    
    setReports(response.data);
    console.log("Successfully fetched reports:", response.data.length);
  } catch (err) {
    console.error("Error fetching reports:", err);
    
    // If we haven't retried too many times and it's a network error, retry
    if (retryCount < 3 && (err.code === 'ECONNABORTED' || !err.response)) {
      console.log(`Retrying fetch (attempt ${retryCount + 1}/3)...`);
      // Wait for 1 second before retrying
      setTimeout(() => fetchReports(retryCount + 1), 1000);
      return;
    }
    
    // You might want to set an error state to display to the user
    // setFetchError("Failed to load your reports. Please try again later.");
  } finally {
    setLoading(false);
  }
};

// Use the function in the useEffect
useEffect(() => {
  let isMounted = true;
  
  const initFetch = async () => {
    if (!token) {
      console.log("No token yet, waiting...");
      return;
    }
    
    // Verify the token is valid before fetching
    try {
      const currentToken = await getToken();
      if (currentToken && isMounted) {
        console.log("Token verified, starting fetch");
        fetchReports();
      }
    } catch (tokenErr) {
      console.error("Error verifying token:", tokenErr);
    }
  };
  
  initFetch();
  
  // Cleanup function
  return () => {
    isMounted = false;
  };
}, [token, getToken]); // Only depends on token now

// Modify handleSubmit to use the same function
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);
  
  try {
    // Validation and form submission code...
    
    // Get authentication token directly rather than from state
    const authToken = await getToken();
    
    const response = await axios.post(
      'https://smartwaste-3smg.onrender.com/api/reports',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    setSubmitSuccess(true);
    
    // Use the shared fetchReports function instead of duplicating code
    fetchReports();
    
    // Reset form after successful submission
    setTimeout(() => {
      setFormData({
        waste_type: '',
        estimated_quantity: 'small',
        location_type: 'street',
        location: '',
        description: '',
        latitude: null,
        longitude: null,
        coinsEarned: 10 // Default to small quantity coins

      });
      setSubmitSuccess(false);
    }, 3000);
    
  } catch (err) {
    console.error('Error creating report:', err);
    setError(err.response?.data?.message || err.message || 'An error occurred while submitting the report');
  } finally {
    setIsSubmitting(false);
  }
};
// Add these near your other state declarations
const [isSearching, setIsSearching] = useState(false);
const [locateMe, setLocateMe] = useState(false);

// Function to trigger location finding
const handleLocateMe = () => {
  setLocateMe(true);
};

// Function to reset location trigger
const resetLocateMe = () => {
  setLocateMe(false);
};

// Function to handle address change


// Function to handle location search
// Function to handle location search
const handleGeocoding = async (e) => {
  if (e) e.preventDefault(); // Prevent form submission
  
  if (!formData.location.trim()) return;
  
  setIsSearching(true);
  
  try {
    // Using Nominatim for geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.location)}&limit=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      const latitude = parseFloat(data[0].lat);
      const longitude = parseFloat(data[0].lon);
      
      // Update coordinates
      setCoordinates({
        latitude,
        longitude
      });
      
      // Update form data with new coordinates
      setFormData(prev => ({ ...prev, latitude, longitude }));
      
      console.log("Search successful:", { latitude, longitude });
    } else {
      setError('Location not found. Please try a different address or select on map.');
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    setError('Error finding location. Please try again or select on map.');
  } finally {
    setIsSearching(false);
  }
};


  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const reportsPerPage = 6;

  // Icons mapping for different waste types
  const wasteTypeIcons = {
    plastic: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    paper: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    glass: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    electronic: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    hazardous: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    construction: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    organic: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    metal: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    other: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  // Status badge styles
  const statusStyles = {
    pending: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300",
    accepted: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        return 'Just now';
      }
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get filtered reports
  const getFilteredReports = () => {
    if (filter === 'all') {
      return reports;
    }
    return reports.filter(report => report.status === filter);
  };

  // Get paginated reports
  const getPaginatedReports = () => {
    const filteredReports = getFilteredReports();
    const startIndex = (page - 1) * reportsPerPage;
    return filteredReports.slice(startIndex, startIndex + reportsPerPage);
  };

  // Calculate total pages
  const totalPages = Math.ceil(getFilteredReports().length / reportsPerPage);



  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1); // Reset to first page when filter changes
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };




// Calculate statistics
const totalCoins = reports
  .filter(report => report.status === 'accepted')
  .reduce((sum, report) => sum + report.coinsEarned, 0);

const pendingReports = reports.filter(report => report.status === 'pending').length;
const acceptedReports = reports.filter(report => report.status === 'accepted').length;






  // Fetch reports only when the token is available
  useEffect(() => {
    if (!token) return; // Wait for token

    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://smartwaste-3smg.onrender.com/api/reports/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReports(response.data);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]); // Runs only when token is set


  return (
     <>

     <section id="waste-reporting" className="py-20 bg-gray-50 dark:bg-neutral-900">
  <div className="container mx-auto px-4">
    <div className="mb-16 text-center">
      <span className="inline-block px-3 py-1 text-sm font-semibold bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-full mb-4">
        Community Participation
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
        Waste Reporting Platform
      </h2>
      <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">
        Empower citizens to report waste in public places and at home,
        contributing to cleaner communities while earning rewards.
      </p>
    </div>
    <div className="flex flex-col lg:flex-row items-stretch gap-12">
      {/* Reporting Form */}
      <div className="lg:w-1/2 order-2 lg:order-1">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl overflow-hidden">
          <div className="bg-teal-600 dark:bg-teal-700 p-4 text-white">
            <h3 className="text-xl font-semibold">Report Waste</h3>
            <p className="text-teal-100 text-sm mt-1">
              Fill out the form to report waste and earn GreenCoins
            </p>
          </div>

















          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}
      
      {submitSuccess && (
        <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md">
          Report submitted successfully! You'll receive GreenCoins once your report is verified.
        </div>
      )}
      
      <div>
        <label
          htmlFor="waste-type"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Waste Type
        </label>
        <select
          id="waste-type"
          value={formData.waste_type}
          onChange={handleWasteTypeChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="" disabled>Select waste type</option>
          <option value="plastic">Plastic</option>
          <option value="paper">Paper/Cardboard</option>
          <option value="glass">Glass</option>
          <option value="metal">Metal</option>
          <option value="electronic">Electronic Waste</option>
          <option value="organic">Organic Waste</option>
          <option value="construction">Construction Debris</option>
          <option value="hazardous">Hazardous Materials</option>
          <option value="Garbage">Garbage</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="waste-quantity"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Estimated Quantity
          </label>
          <select
            id="waste-quantity"
            value={formData.estimated_quantity}
            onChange={handleQuantityChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="small">Small (&lt; 5kg)</option>
            <option value="medium">Medium (5-20kg)</option>
            <option value="large">Large (20-100kg)</option>
            <option value="very-large">Very Large (&gt;100kg)</option>
          </select>
        </div>
        
        <div>
          <label
            htmlFor="location-type"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Location Type
          </label>
          <select
            id="location-type"
            value={formData.location_type}
            onChange={handleLocationTypeChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="street">Street/Sidewalk</option>
            <option value="park">Park/Garden</option>
            <option value="beach">Beach/Waterfront</option>
            <option value="forest">Forest/Natural Area</option>
            <option value="residential">Residential Area</option>
            <option value="commercial">Commercial Area</option>
            <option value="Public Place">Public Place</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      
      
      
      
      {/* Location Input and Map Section */}
<div>
  <label
    htmlFor="location-address"
    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
  >
    Location Address/Description
  </label>
  <div className="flex items-center gap-2 mb-2">
    <input
      type="text"
      id="location-address"
      value={formData.location}
      onChange={handleAddressChange}
      placeholder="Enter address or describe the location"
      className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
    />
    {/* <button
      type="button"
      onClick={handleGeocoding}
      disabled={isSearching || !formData.location}
      className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400 flex items-center justify-center"
    >
      {isSearching ? (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        "Search"
      )}
    </button> */}
  </div>

  {/* Map Container */}
  <div className="mt-3 mb-4 ">
    <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
    <MapContainer 
      center={coordinates.latitude && coordinates.longitude ? [coordinates.latitude, coordinates.longitude] : [28.7041, 77.1025]}
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
      className="h-full w-full z-10"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapController 
        coordinates={coordinates}
        setCoordinates={setCoordinates}
        locateMe={locateMe}
        resetLocateMe={resetLocateMe}
        setFormData={setFormData}
      />
      {coordinates.latitude && coordinates.longitude && (
        <Marker position={[coordinates.latitude, coordinates.longitude]} icon={customIcon} />
      )}
    </MapContainer>
    </div>
    <div className="flex items-center justify-between bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg mt-3">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-teal-600 dark:text-teal-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Use current location
          </span>
        </div>
        <div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={useCurrentLocation}
              onChange={() => setUseCurrentLocation(!useCurrentLocation)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-neutral-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-teal-600" />
          </label>
        </div>
      </div>
      
      {useCurrentLocation && coordinates.latitude && coordinates.longitude && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Location captured: {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
        </div>
      )}
    </div>
  </div>  

      <div>
        <label
          htmlFor="waste-description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Description
        </label>
        <textarea
          id="waste-description"
          value={formData.description}
          onChange={handleDescriptionChange}
          rows={3}
          placeholder="Provide any additional details about the waste"
          className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 ${isSubmitting ? 'bg-teal-400' : 'bg-teal-600 hover:bg-teal-700'} text-white font-medium rounded-lg transition duration-300 transform hover:-translate-y-1 shadow-md flex items-center justify-center`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Submit Report
            </>
          )}
        </button>
      </div>
      
      {/* <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        You'll earn approximately{" "}
        <span className="font-medium text-teal-600 dark:text-teal-400">
          {formData.estimated_quantity === 'small' ? '10' : 
           formData.estimated_quantity === 'medium' ? '20' : 
           formData.estimated_quantity === 'large' ? '30' : '50'} GreenCoins
        </span>{" "}
        based on your report details
      </div> */}
    </form>

















        </div>
      </div>





      {/* Features and Benefits */}
      <div className="lg:w-1/2 order-1 lg:order-2">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          How Waste Reporting Works
        </h3>
        <div className="space-y-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-teal-600 dark:text-teal-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Report Identification
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Create waste reports by providing details about type, location,
                and quantity, with the option to include photos for
                verification.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-teal-600 dark:text-teal-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Verification Process
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Reports are verified through AI analysis and
                authorities to verfiy by the verified authority.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-teal-600 dark:text-teal-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Automatic Mapping
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Verified reports are instantly added to our waste map, helping
                cleaning crews and municipal authorities prioritize their
                efforts.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-teal-600 dark:text-teal-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Reward Distribution
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Earn GreenCoins for verified reports. The reward amount varies
                based on waste quantity, and the quality of your
                submission.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-teal-600 dark:text-teal-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Cleanup Tracking
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Follow the status of your reports from submission to cleanup
                completion, with notifications when action is taken.
              </p>
            </div>
          </div>
        </div>
        {/* Report Metrics */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Community Impact Metrics
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                85
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                Reports Submitted
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                76%
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                Cleanup Rate
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                32h
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                Avg. Response Time
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                5K
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                GreenCoins Awarded
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 text-center px-6">
            Join over 350 active citizens who are making a difference in their
            communities through waste reporting
          </div>
        </div>
      </div>
    </div>





















    
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-4">
        Your Waste Reports
      </h3>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-teal-100 dark:bg-teal-900 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Reports</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{reports.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Coins Earned</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{totalCoins}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Accepted Reports</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{acceptedReports} of {reports.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter tabs */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm bg-gray-100 dark:bg-neutral-800 p-1">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              filter === 'all'
                ? 'bg-teal-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
            }`}
          >
            All Reports
          </button>
          <button
            onClick={() => handleFilterChange('pending')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              filter === 'pending'
                ? 'bg-teal-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
            }`}
          >
            Pending ({pendingReports})
          </button>
          <button
            onClick={() => handleFilterChange('accepted')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              filter === 'accepted'
                ? 'bg-teal-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
            }`}
          >
            Accepted ({acceptedReports})
          </button>
        </div>
      </div>
      
      {/* Reports grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getPaginatedReports().map((report) => (
          <div key={report._id} className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden transition-transform hover:transform hover:scale-[1.02]">
            <div className="h-48 bg-gray-200 dark:bg-neutral-700 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  {wasteTypeIcons[report.waste_type] || wasteTypeIcons.default}
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  {report.waste_type.charAt(0).toUpperCase() + report.waste_type.slice(1)} Waste
                </p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-800 dark:text-white">
                  {report.location_type.charAt(0).toUpperCase() + report.location_type.slice(1)} Waste
                </h4>
                <div className="flex items-center">
                  <span className={`px-2 py-1 ${statusStyles[report.status]} rounded-full text-xs mr-2`}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                  {report.status === 'accepted' && (
                    <span className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                      +{report.coinsEarned} coins
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                {report.description}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {report.location}
                </span>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDate(report.reportedAt)}
                </span>
              </div>
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  Quantity: {report.estimated_quantity.charAt(0).toUpperCase() + report.estimated_quantity.slice(1)}
                </span>
              </div>
              
              {/* View details link */}
              {/* <div className="mt-4 flex justify-end">
                <a 
                  href={`/reports/${report._id}`} 
                  className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 text-sm font-medium flex items-center"
                >
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div> */}
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty state for filtered results */}
      {getFilteredReports().length === 0 && (
        <div className="bg-gray-50 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-700 p-6 rounded-lg text-center mt-4">
          <p className="text-gray-600 dark:text-gray-400">No {filter} reports found.</p>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`p-2 rounded-md ${
                page === 1
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-4 py-2 rounded-md ${
                  page === pageNum
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
                }`}
              >
                {pageNum}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`p-2 rounded-md ${
                page === totalPages
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      )}
      
      {/* Create new report button */}
      <div className="text-center mt-8">
        <a
          href="/report"
          className="inline-flex items-center px-5 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition duration-300"
        >
          Create New Report
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </a>
      </div>
    </div>
   
  </div>
</section>

     </>
  )
}
