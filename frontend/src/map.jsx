/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import sampleImage from "./sample.png"// Adjust the path as needed
import OpenCameraButton from "./OpenCameraButton";
import OpenImageVideo from "./OpenImageVideo";
// Custom Red Marker Icon
const redIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1673/1673221.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
});

// Blue Marker Icon for detected locations
const blueIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// Map component to display garbage locations and detected locations
const MapControl = ({ detectedLocations }) => {
  const map = useMap();

  useEffect(() => {
    // Add detected locations to map
    detectedLocations.forEach(async (loc) => {
      const marker = L.marker([loc.latitude, loc.longitude], { icon: blueIcon }).addTo(map);
      
      // Format the timestamp to a readable date/time
      const detectionTime = new Date(loc.timestamp).toLocaleString();
      
      // Fetch city name using OpenStreetMap Nominatim API
      let cityName = 'Unknown location';
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.latitude}&lon=${loc.longitude}&zoom=10`
        );
        const data = await response.json();
        
        // Extract city name from the response
        if (data.address) {
          cityName = data.address.city || 
                    data.address.town || 
                    data.address.village || 
                    data.address.hamlet || 
                    'Unknown location';
        }
      } catch (error) {
        console.error('Error fetching location name:', error);
      }

      // Create popup with city name and formatted timestamp
      const popup = L.popup({ 
        autoClose: true, 
        closeOnClick: true
      })
      .setLatLng([loc.latitude, loc.longitude])
      .setContent(`
        <div>
          <span style="font-weight: bold;">📍 ${cityName}</span><br>
          <span>Detected: ${detectionTime}</span>
        </div>
      `);
      
      // Add event listeners for hover and click
      marker.bindPopup(popup);
      
      // Show popup on hover
      marker.on('mouseover', function() {
        this.openPopup();
      });
      
      // Hide popup when mouse leaves the marker
      marker.on('mouseout', function() {
        this.closePopup();
      });
      
      // Use flyTo for smooth transition when clicked
      marker.on('click', function() {
        map.flyTo([loc.latitude, loc.longitude], 15, {
          animate: true,
          duration: 1 // duration in seconds
        });
        
        // Update the selectedLocation info on UI
        const coordsDisplay = document.getElementById('coordinates-display');
        const latDisplay = document.getElementById('lat-display');
        const lngDisplay = document.getElementById('lng-display');
        
        if (coordsDisplay && latDisplay && lngDisplay) {
          coordsDisplay.classList.remove('hidden');
          latDisplay.textContent = loc.latitude;
          lngDisplay.textContent = loc.longitude;
        }
      });
    });
  }, [map, detectedLocations]);

  return null;
};



export default function Map() {


  const [file, setFile] = useState(null);
  const [detectedLocations, setDetectedLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([20, 78]);
  const [mapZoom, setMapZoom] = useState(5);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Function to fetch detected locations from the API
  const fetchDetectedLocations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('https://smartwaste-3smg.onrender.com/api/location/get-location');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
       console.log(data.locations)
      if ( data.locations) {
        setDetectedLocations(data.locations);
        
        // Update status text
        const statusElement = document.getElementById('location-status');
        if (statusElement) {
          statusElement.textContent = `${data.locations.length} locations detected`;
        }
      } else {
        throw new Error(data.message || 'Failed to fetch locations');
      }
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError(err.message);
      
      // Update status text
      const statusElement = document.getElementById('location-status');
      if (statusElement) {
        statusElement.textContent = 'Failed to fetch locations';
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle location selection from the list
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setMapCenter([location.latitude, location.longitude]);
    setMapZoom(15);
    
    // Update coordinates display
    const coordsDisplay = document.getElementById('coordinates-display');
    const latDisplay = document.getElementById('lat-display');
    const lngDisplay = document.getElementById('lng-display');
    
    if (coordsDisplay && latDisplay && lngDisplay) {
      coordsDisplay.classList.remove('hidden');
      latDisplay.textContent = location.latitude;
      lngDisplay.textContent = location.longitude;
    }
  };

  // Fetch locations when component mounts
  useEffect(() => {
    fetchDetectedLocations();
    
    // Set up interval to refresh locations every 30 seconds
    const intervalId = setInterval(fetchDetectedLocations, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <section id="map-interface" className="py-16 bg-white dark:bg-neutral-800">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
        Interactive Map Interface
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
        View and manage detected garbage locations with our intuitive mapping
        system.
      </p>
    </div>
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Map Demo Container */}
      <div className="lg:w-2/3 w-full bg-gray-100 dark:bg-neutral-700 rounded-xl shadow-lg overflow-hidden">
        {/* Map Header */}
        <div className="bg-gray-200 dark:bg-neutral-600 p-4 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            Live Map View
          </h3>
          <div className="flex items-center">
            <button
              id="map-refresh-btn"
              className="p-2 hover:bg-gray-300 dark:hover:bg-neutral-500 rounded-full transition"
              title="Refresh map"
            >
          
            </button>
            <button
              id="map-fullscreen-btn"
              className="p-2 hover:bg-gray-300 dark:hover:bg-neutral-500 rounded-full transition ml-2"
              title="Toggle fullscreen"
            >
             
            </button>
          </div>
        </div>
        {/* Map Container */}
<div
id="map"
className="h-96 w-full bg-gray-50 dark:bg-neutral-900 relative overflow-hidden z-10"
>
<MapContainer center={mapCenter} zoom={mapZoom} style={{ height: "100%", width: "100%" }}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  <MapControl detectedLocations={detectedLocations} />
</MapContainer>
</div>
{/* Map Info Panel */}
<div className="p-4 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700">
<div className="flex items-center justify-between">
  <div className="flex items-center">
    <div className={`w-3 h-3 rounded-full mr-2 ${isLoading ? 'bg-yellow-500 animate-pulse' : detectedLocations.length > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
    <span className="text-sm text-gray-600 dark:text-gray-300">
      Location status:{" "}
      <span id="location-status">
        {isLoading ? 'Loading...' : 
         error ? 'Error loading locations' : 
         detectedLocations.length > 0 ? `${detectedLocations.length} locations detected` : 
         'No locations detected'}
      </span>
    </span>
  </div>
</div>
{/* Coordinates Display */}
<div
  id="coordinates-display"
  className={`mt-3 p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 ${selectedLocation ? '' : 'hidden'}`}
>
  <div className="flex justify-between items-center mb-2">
    <span className="font-medium">Current Coordinates</span>
   
  </div>
  <div className="grid grid-cols-2 gap-2">
    <div>
      <span className="text-gray-500 dark:text-gray-400">
        Latitude:
      </span>
      <span id="lat-display">{selectedLocation ? selectedLocation.latitude.toFixed(6) : '--'}</span>
    </div>
    <div>
      <span className="text-gray-500 dark:text-gray-400">
        Longitude:
      </span>
      <span id="lng-display">{selectedLocation ? selectedLocation.longitude.toFixed(6) : '--'}</span>
    </div>
  </div>
</div>
</div>
</div>
      {/* Camera Interface */}
      <div className="lg:w-1/3 w-full">
        <div className="bg-white dark:bg-neutral-700 rounded-xl shadow-lg overflow-hidden h-full">
          <div className="bg-gray-200 dark:bg-neutral-600 p-4">
            <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green-500"
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
              Camera Control
            </h3>
          </div>
          {/* Camera Preview */}
          <div className="p-6 flex flex-col items-center">
          <div
      id="camera-placeholder"
      className="bg-gray-100 dark:bg-neutral-600 h-48 w-full rounded-lg flex items-center justify-center mb-6"
    >
      <img src={sampleImage} alt="Uploaded" className="h-full w-full object-cover rounded-lg" />
    </div>
            {/* Hidden video element for camera feed */}
            <video
              id="camera-feed"
              className="hidden h-48 w-full rounded-lg object-cover mb-6"
              autoPlay=""
            />
            {/* Captured image will be shown here */}
            <canvas
              id="capture-canvas"
              className="hidden h-48 w-full rounded-lg object-cover mb-6"
            />
            {/* Camera Controls */}
            <div className="grid grid-cols-1 gap-4 w-full">
            {/* <button
        id="open-camera-btn"
        className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition duration-300 transform hover:scale-105"
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
        Open Camera
      </button> */}
      <OpenCameraButton />
      
      <OpenImageVideo />
      {/* Capture Photo Button */}
      <button
        id="capture-btn"
        className="hidden bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition duration-300 transform hover:scale-105"
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
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
          />
        </svg>
        Take Photo
      </button>


      {/* Upload File Button */}
      {/* <label className="cursor-pointer bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition duration-300 transform hover:scale-105">
        <input
          type="file"
          accept=".png,.jpeg,.jpg,.mp4"
          onChange={handleFileChange}
          className="hidden"
        />
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
    d="M5 10l7-7m0 0l7 7m-7-7v14"
  />
</svg>

        Upload Image or Video (*.png/.jpeg/.jpg/.mp4)
      </label>

      {file && (
        <p className="text-white text-sm mt-2">
          Selected file: <strong>{file.name}</strong>
        </p>
      )} */}
              {/* <button
                id="detect-garbage-btn"
                className=" bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition duration-300 transform hover:scale-105"
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Detect &amp; Map
              </button> */}
              
            </div>
            {/* Status Messages */}
            <div
              id="camera-status"
              className="mt-4 w-full text-center text-sm text-gray-600 dark:text-gray-300"
            >
              Click "Open Camera" to begin the detection process
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Instructions */}
      <div id = "#how-to-use"className="mt-12 bg-gray-50 dark:bg-neutral-700 rounded-xl p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          How to Use This Interface
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500">
                <span className="text-lg font-bold">1</span>
              </div>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium text-gray-800 dark:text-white">
                Open Camera
              </h4>
              <p className="mt-1 text-gray-600 dark:text-gray-300">
                Click the "Open Camera" button to activate your device's camera.
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500">
                <span className="text-lg font-bold">2</span>
              </div>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium text-gray-800 dark:text-white">
                Capture Photo
              </h4>
              <p className="mt-1 text-gray-600 dark:text-gray-300">
                Take a photo of the garbage site with the "Take Photo" button.
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500">
                <span className="text-lg font-bold">3</span>
              </div>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium text-gray-800 dark:text-white">
                Detect &amp; Map
              </h4>
              <p className="mt-1 text-gray-600 dark:text-gray-300">
                The system will automatically fetch your location and add it to
                the map.
              </p>
            </div>
          </div>
        </div>
      </div>
  </div>
</section>

    </div>
  )
}

























// import React, { useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Custom Red Marker Icon
// const redIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/1673/1673221.png",
//   iconSize: [40, 40],
//   iconAnchor: [20, 40],
//   popupAnchor: [0, -35],
// });

// // Garbage dump locations in Amravati
// const garbageLocations = [
//   { id: 1, lat: 20.9374, lng: 77.7796, description: "Overflowing bins near Rajapeth" },
//   { id: 2, lat: 20.9245, lng: 77.7550, description: "Illegal dumping at Badnera Road" },
//   { id: 3, lat: 20.9270, lng: 77.7778, description: "Waste pileup near Maltekdi" },
//   { id: 4, lat: 20.9321, lng: 77.7633, description: "Garbage accumulation near Gadge Nagar" },
//   { id: 5, lat: 20.9423, lng: 77.7725, description: "Unattended waste near Rathi Nagar" },
// ];

// const OpenAllPopups = () => {
//   const map = useMap();

//   useEffect(() => {
//     garbageLocations.forEach((garbage) => {
//       const marker = L.marker([garbage.lat, garbage.lng], { icon: redIcon }).addTo(map);
//       const popup = L.popup({ autoClose: false, closeOnClick: false })
//         .setLatLng([garbage.lat, garbage.lng])
//         .setContent(`<span style="font-weight: bold;">🗑️ ${garbage.description}</span>`);
//       marker.bindPopup(popup).openPopup();
//     });
//   }, [map]);

//   return null;
// };

// export default function MapComponent() {
//   return (
//     <div className="flex justify-center items-center h-screen">
//       <MapContainer center={[20.9374, 77.7796]} zoom={13} style={{ height: "90vh", width: "90vw" }}>
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//         <OpenAllPopups />
//       </MapContainer>
//     </div>
//   );
// }
