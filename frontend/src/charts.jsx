/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';


const API_URL = import.meta.env.VITE_API_URL;


const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  
  // Fix Leaflet's default icon issue
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIconRetina,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
  });
const Charts = () => {
    const [wasteTypeData, setWasteTypeData] = useState(null);
    const [wasteFrequencyData, setWasteFrequencyData] = useState(null);
    const [wasteQuantityData, setWasteQuantityData] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const [locationPieData, setLocationPieData] = useState(null);
    const [heatmapData, setHeatmapData] = useState(null);
    const [cityMarkers, setCityMarkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Custom color palette for a cohesive look
    const colorPalette = {
        primary: ["#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE"],
        secondary: ["#10B981", "#34D399", "#6EE7B7", "#A7F3D0", "#D1FAE5"],
        accent: ["#F59E0B", "#FBBF24", "#FCD34D", "#FDE68A", "#FEF3C7"],
        neutral: ["#1F2937", "#374151", "#4B5563", "#6B7280", "#9CA3AF"]
    };

    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/charts`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                const wasteCounts = {};
                const cityCounts = {};
                const wasteTypeCounts = {};
                const locationCounts = {};
                const heatmapCounts = {};
                const cityMap = {};

                data.forEach((report) => {
                    wasteTypeCounts[report.waste_type] = (wasteTypeCounts[report.waste_type] || 0) + 1;
                    wasteCounts[report.waste_type] = (wasteCounts[report.waste_type] || 0) + 1;

                    cityCounts[report.location] = (cityCounts[report.location] || 0) + 1;

                    const quantityKey = `${report.waste_type}-${report.estimated_quantity}`;
                    wasteCounts[quantityKey] = (wasteCounts[quantityKey] || 0) + 1;

                    const locationKey = `${report.location_type}-${report.waste_type}`;
                    locationCounts[locationKey] = (locationCounts[locationKey] || 0) + 1;

                    const heatKey = `${report.location_type}-${report.waste_type}`;
                    heatmapCounts[heatKey] = (heatmapCounts[heatKey] || 0) + 1;

                    if (report.latitude && report.longitude) {
                        if (!cityMap[report.location]) {
                            cityMap[report.location] = {
                                name: report.location,
                                lat: report.latitude,
                                lng: report.longitude,
                                reports: 1,
                                types: new Set([report.waste_type]),
                            };
                        } else {
                            cityMap[report.location].reports += 1;
                            cityMap[report.location].types.add(report.waste_type);
                        }
                    }
                });

                setWasteTypeData({
                    labels: Object.keys(wasteTypeCounts),
                    datasets: [
                        {
                            label: "Waste Type Distribution",
                            data: Object.values(wasteTypeCounts),
                            backgroundColor: colorPalette.primary,
                            borderColor: "#ffffff",
                            borderWidth: 1,
                        },
                    ],
                });

                setLocationPieData({
                    labels: Object.keys(cityCounts),
                    datasets: [
                        {
                            label: "Waste Report Location Distribution",
                            data: Object.values(cityCounts),
                            backgroundColor: colorPalette.secondary,
                            borderColor: "#ffffff",
                            borderWidth: 1,
                        },
                    ],
                });

                setWasteFrequencyData({
                    labels: Object.keys(wasteCounts),
                    datasets: [
                        {
                            label: "Waste Frequency",
                            data: Object.values(wasteCounts),
                            backgroundColor: colorPalette.primary[0],
                            borderColor: colorPalette.primary[1],
                            borderWidth: 1,
                        },
                    ],
                });

                const wasteTypes = [...new Set(data.map((report) => report.waste_type))];
                
                setWasteQuantityData({
                    labels: wasteTypes,
                    datasets: [
                        {
                            label: "Small",
                            data: wasteTypes.map(type => 
                                data.filter(report => report.waste_type === type && report.estimated_quantity === "small").length
                            ),
                            backgroundColor: colorPalette.accent[0],
                        },
                        {
                            label: "Medium",
                            data: wasteTypes.map(type => 
                                data.filter(report => report.waste_type === type && report.estimated_quantity === "medium").length
                            ),
                            backgroundColor: colorPalette.accent[1],
                        },
                        {
                            label: "Large",
                            data: wasteTypes.map(type => 
                                data.filter(report => report.waste_type === type && report.estimated_quantity === "large").length
                            ),
                            backgroundColor: colorPalette.accent[2],
                        },
                        {
                            label: "Very Large",
                            data: wasteTypes.map(type => 
                                data.filter(report => report.waste_type === type && report.estimated_quantity === "very large").length
                            ),
                            backgroundColor: colorPalette.accent[3],
                        },
                    ],
                });

                const locationTypes = [...new Set(data.map((report) => report.location_type))];
                
                setLocationData({
                    labels: locationTypes,
                    datasets: wasteTypes.map((wasteType, index) => ({
                        label: wasteType,
                        data: locationTypes.map(locType => 
                            data.filter(report => report.location_type === locType && report.waste_type === wasteType).length
                        ),
                        backgroundColor: colorPalette.primary[index % colorPalette.primary.length],
                    })),
                });

                // Create proper heatmap data
                const heatmapLabels = locationTypes;
                const heatmapDatasets = wasteTypes.map(wasteType => {
                    return {
                        label: wasteType,
                        data: locationTypes.map(locType => {
                            const key = `${locType}-${wasteType}`;
                            return heatmapCounts[key] || 0;
                        }),
                        backgroundColor: colorPalette.secondary[wasteTypes.indexOf(wasteType) % colorPalette.secondary.length],
                    };
                });

                setHeatmapData({
                    labels: heatmapLabels,
                    datasets: heatmapDatasets,
                });

                setCityMarkers(Object.values(cityMap));
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError("Failed to load dashboard data. Please try again later.");
                setLoading(false);
            });
    }, []);

    // Chart configurations
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: "#E5E7EB",
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12
                    },
                    boxWidth: 12,
                    padding: 16
                }
            },
            tooltip: {
                backgroundColor: "rgba(17, 24, 39, 0.8)",
                titleColor: "#F9FAFB",
                bodyColor: "#F3F4F6",
                borderColor: "#4B5563",
                borderWidth: 1,
                padding: 12,
                bodySpacing: 6,
                titleFont: {
                    family: "'Inter', sans-serif",
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    family: "'Inter', sans-serif",
                    size: 13
                },
                cornerRadius: 6
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(107, 114, 128, 0.2)",
                    borderDash: [5, 5]
                },
                ticks: {
                    color: "#D1D5DB",
                    font: {
                        family: "'Inter', sans-serif",
                        size: 11
                    }
                }
            },
            x: {
                grid: {
                    color: "rgba(107, 114, 128, 0.2)",
                    display: false
                },
                ticks: {
                    color: "#D1D5DB",
                    font: {
                        family: "'Inter', sans-serif",
                        size: 11
                    },
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-black">
                <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-red-400 mb-4">Error</h2>
                    <p className="text-gray-300">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  bg-black">
            <header className=" bg-black shadow-md">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                        <svg className="w-8 h-8 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Waste Management Analytics Dashboard
                    </h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96">
                        <div className="w-16 h-16 border-t-4 border-b-4 border-green-500 rounded-full animate-spin"></div>
                        <p className="mt-4 text-lg text-gray-300">Loading dashboard data...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl">
                                <div className="p-4 border-b border-gray-700">
                                    <h2 className="text-lg font-bold text-white flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Waste Type Distribution
                                    </h2>
                                </div>
                                <div className="p-5 h-64">
                                    {wasteTypeData ? <Doughnut data={wasteTypeData} options={{...chartOptions, cutout: '60%'}} /> : <p className="text-center">No data available</p>}
                                </div>
                            </div>

                            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl">
                                <div className="p-4 border-b border-gray-700">
                                    <h2 className="text-lg font-bold text-white flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Location Distribution
                                    </h2>
                                </div>
                                <div className="p-5 h-64">
                                    {locationPieData ? <Pie data={locationPieData} options={chartOptions} /> : <p className="text-center">No data available</p>}
                                </div>
                            </div>

                            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl">
                                <div className="p-4 border-b border-gray-700">
                                    <h2 className="text-lg font-bold text-white flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Waste Frequency
                                    </h2>
                                </div>
                                <div className="p-5 h-64">
                                    {wasteFrequencyData ? <Bar data={wasteFrequencyData} options={chartOptions} /> : <p className="text-center">No data available</p>}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl">
                                <div className="p-4 border-b border-gray-700">
                                    <h2 className="text-lg font-bold text-white flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Waste Quantity Distribution
                                    </h2>
                                </div>
                                <div className="p-5 h-80">
                                    {wasteQuantityData ? <Bar data={wasteQuantityData} options={{
                                        ...chartOptions,
                                        plugins: {
                                            ...chartOptions.plugins,
                                            title: {
                                                display: true,
                                                text: 'Distribution by Quantity and Type',
                                                color: '#E5E7EB',
                                                font: {
                                                    size: 14
                                                }
                                            }
                                        }
                                    }} /> : <p className="text-center">No data available</p>}
                                </div>
                            </div>

                            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl">
                                <div className="p-4 border-b border-gray-700">
                                    <h2 className="text-lg font-bold text-white flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        </svg>
                                        Location Type vs Waste Reports
                                    </h2>
                                </div>
                                <div className="p-5 h-80">
                                    {locationData ? <Bar data={locationData} options={{
                                        ...chartOptions,
                                        scales: {
                                            ...chartOptions.scales,
                                            x: {
                                                ...chartOptions.scales.x,
                                                stacked: true,
                                            },
                                            y: {
                                                ...chartOptions.scales.y,
                                                stacked: true,
                                                title: {
                                                    display: true,
                                                    text: 'Number of Reports',
                                                    color: '#E5E7EB'
                                                }
                                            }
                                        }
                                    }} /> : <p className="text-center">No data available</p>}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl">
                                <div className="p-4 border-b border-gray-700">
                                    <h2 className="text-lg font-bold text-white flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Waste Type vs Location Type (Heatmap)
                                    </h2>
                                </div>
                                <div className="p-5 h-80">
                                    {heatmapData ? <Bar data={heatmapData} options={{
                                        ...chartOptions,
                                        plugins: {
                                            ...chartOptions.plugins,
                                            title: {
                                                display: true,
                                                text: 'Waste Distribution by Location Type',
                                                color: '#E5E7EB',
                                                font: {
                                                    size: 14
                                                }
                                            },
                                            legend: {
                                                ...chartOptions.plugins.legend,
                                                position: 'right'
                                            }
                                        },
                                        scales: {
                                            ...chartOptions.scales,
                                            x: {
                                                ...chartOptions.scales.x,
                                                title: {
                                                    display: true,
                                                    text: 'Location Type',
                                                    color: '#E5E7EB'
                                                }
                                            },
                                            y: {
                                                ...chartOptions.scales.y,
                                                title: {
                                                    display: true,
                                                    text: 'Report Count',
                                                    color: '#E5E7EB'
                                                }
                                            }
                                        }
                                    }} /> : <p className="text-center">No data available</p>}
                                </div>
                            </div>

                            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl">
                                <div className="p-4 border-b border-gray-700">
                                    <h2 className="text-lg font-bold text-white flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Reported Waste Locations (Map)
                                    </h2>
                                </div>
                                <div className="p-5 h-96">
                                <MapContainer center={[20, 78]} zoom={5} className="h-96 w-full rounded-lg">
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  {cityMarkers.map((city, index) => (
    <Marker 
      key={index} 
      position={[city.lat, city.lng]} 
      icon={redIcon}
      eventHandlers={{
        popupopen: (e) => {
          e.target._map.flyTo([city.lat, city.lng], 10, { duration: 1.5 });
        }
      }}
    >
      <Popup>
        <strong>City:</strong> {city.name} <br />
        <strong>Total Reports:</strong> {city.reports} <br />
        <strong>Waste Types:</strong> {Array.from(city.types).join(", ")}
      </Popup>
    </Marker>
  ))}
</MapContainer>

                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>

           
        </div>
    );
};

export default Charts;