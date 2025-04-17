/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

export default function Reward() {
  const [reports, setReports] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [totalCoins, setTotalCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken, isLoaded } = useAuth();
  const [showAllReports, setShowAllReports] = useState(false);
  const [showAllPurchases, setShowAllPurchases] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded) return;
      
      try {
        const token = await getToken();
        
        // Fetch reports and purchased items in parallel
        const [reportsResponse, purchasesResponse] = await Promise.all([
          axios.get("https://smartwaste-3smg.onrender.com/api/reports/user", {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000
          }),
          axios.get("https://smartwaste-3smg.onrender.com/api/listings/purchased", {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000
          })
        ]);
        
        setReports(reportsResponse.data);
        setPurchasedItems(purchasesResponse.data);
        
        // Calculate total coins from accepted reports
        const earnedCoins = reportsResponse.data
          .filter(report => report.status === "accepted")
          .reduce((total, report) => total + (report.coinsEarned || 0), 0);
        
        // Calculate total spent coins from purchased items
        const spentCoins = purchasesResponse.data
          .reduce((total, item) => total + (item.price || 0), 0);
        
        // Calculate net coins (earned - spent)
        const netCoins = earnedCoins - spentCoins;
        
        // Update the user's greenCoins in the database
        await axios.post("https://smartwaste-3smg.onrender.com/api/users/update-coins", 
          { amount: netCoins },
          { 
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000
          }
        );
        
        setTotalCoins(netCoins);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };
  
    fetchData();
  }, [getToken, isLoaded]);

  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-6 h-6 border-4 border-t-purple-600 border-b-purple-600 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Accepted
          </span>
        );
      case 'pending':
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Coming Soon
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  const getWasteTypeIcon = (wasteType) => {
    switch (wasteType) {
      case 'plastic':
        return (
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
              <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
            </svg>
          </div>
        );
      case 'paper':
        return (
          <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  const getPurchasedItemIcon = () => {
    return (
      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
      </div>
    );
  };

  const displayedReports = showAllReports ? reports : reports.slice(0, 4);
  const displayedPurchases = showAllPurchases ? purchasedItems : purchasedItems.slice(0, 3);



  return (
     <>
<section
  id="rewards-system"
  className="py-20 bg-neutral-50 dark:bg-neutral-900"
>
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <div className="inline-block mb-2">
        <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 text-xs font-semibold px-3 py-1 rounded-full">
          Incentive Program
        </span>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
        Greencoin Rewards System
      </h2>
      <p className="mt-4 max-w-2xl mx-auto text-neutral-600 dark:text-neutral-400">
        Earn valuable Greencoins for your environmental contributions. Get
        rewarded for keeping your community clean and promoting sustainability.
      </p>
    </div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
<div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl overflow-hidden">
{/* Rewards Dashboard */}
<div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Greencoins Dashboard</h3>
            <p className="text-sm text-white/80">Your sustainability impact</p>
          </div>
          <div className="flex items-center bg-white/20 px-3 py-1 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            <span>Active</span>
          </div>
        </div>
      </div>

      {/* Coin Balance */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Available Balance</p>
            <div className="flex items-center mt-1">
              <div className="h-8 w-8 mr-2">
                <div className="w-full h-full rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-600 dark:text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <span className="text-3xl font-bold text-neutral-900 dark:text-white">{totalCoins}</span>
              <span className="ml-2 text-lg text-neutral-600 dark:text-neutral-400">Greencoins</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">Pending Reports</span>
            <span className="text-xl font-bold text-neutral-900 dark:text-white">
              {reports.filter(report => report.status === "pending").length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs: Reports and Purchases */}
      <div className="p-6">
        <div className="flex border-b border-neutral-200 dark:border-neutral-700 mb-4">
          <button 
            className="pb-2 px-4 border-b-2 border-purple-600 text-purple-600 font-medium"
          >
            Activity History
          </button>
        </div>
        </div>


        <div className="mb-6 p-6">
          <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Earnings</h4>
          <div className="space-y-4">
            {reports.length === 0 ? (
              <p className="text-center text-neutral-500 dark:text-neutral-400 py-4">
                No waste reports found. Start reporting waste to earn coins!
              </p>
            ) : (
              displayedReports.map((report) => (
                <div key={report._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getWasteTypeIcon(report.waste_type)}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-neutral-900 dark:text-white">
                          {report.waste_type.charAt(0).toUpperCase() + report.waste_type.slice(1)} Waste
                        </p>
                        {getStatusLabel(report.status)}
                      </div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {report.location} • {report.estimated_quantity} amount
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {report.status === "accepted" ? (
                      <p className="font-medium text-green-600 dark:text-green-400">
                        +{report.coinsEarned} GC
                      </p>
                    ) : (
                      <p className="font-medium text-yellow-600 dark:text-yellow-400">
                        Coming Soon
                      </p>
                    )}
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {new Date(report.reportedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {reports.length > 4 && (
            <button 
              className="w-full mt-4 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
              onClick={() => setShowAllReports(!showAllReports)}
            >
              {showAllReports ? "Show Less" : `View All Reports (${reports.length})`}
            </button>
          )}
        </div>

        {/* Purchases Section */}
        <div className="p-6">
          <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Purchases</h4>
          <div className="space-y-4">
            {purchasedItems.length === 0 ? (
              <p className="text-center text-neutral-500 dark:text-neutral-400 py-4">
                No items purchased yet. Visit the marketplace to spend your coins!
              </p>
            ) : (
              displayedPurchases.map((item) => (
                <div key={item._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getPurchasedItemIcon()}
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {item.title || "Marketplace Item"}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {item.category || "Item"} • {item.condition || "New"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600 dark:text-red-400">
                      -{item.price} GC
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {item.purchasedAt ? new Date(item.purchasedAt).toLocaleDateString() : new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {purchasedItems.length > 3 && (
            <button 
              className="w-full mt-4 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
              onClick={() => setShowAllPurchases(!showAllPurchases)}
            >
              {showAllPurchases ? "Show Less" : `View All Purchases (${purchasedItems.length})`}
            </button>
          )}
        </div>
      </div>



















      
      {/* Rewards Explanation */}
      <div className="order-1 lg:order-2">
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
          How to Earn Greencoins
        </h3>
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full text-purple-600 dark:text-purple-400 mr-4 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
            </div>
            <div>
              <h4 className="font-semibold text-lg text-neutral-900 dark:text-white">
                Report Waste
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                Submit reports of improper waste disposal through our platform.
                Verified reports earn you Greencoins based on the waste type and
                quantity.
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Earn 25-100 Greencoins per verified report
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full text-purple-600 dark:text-purple-400 mr-4 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-lg text-neutral-900 dark:text-white">
                Recycle Materials
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                Bring recyclable materials to designated collection points or
                sell them on our marketplace. Each transaction is rewarded with
                Greencoins.
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Earn 50-200 Greencoins based on material type and quantity
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full text-purple-600 dark:text-purple-400 mr-4 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-lg text-neutral-900 dark:text-white">
                Regular Reporting
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                Stay active on the platform by consistently reporting waste and
                participating in recycling activities.
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Earn Greencoins regularly on consistant reporting.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full text-purple-600 dark:text-purple-400 mr-4 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-lg text-neutral-900 dark:text-white">
               Discount
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                Get discount on purchase of ecofreindly recyclable products with a redeem of GreenCoins.
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Earn Benefits of GreenCoins in marketplace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
 
   




















    {/* CTA */}
    <div className="mt-16 text-center">
      <a
        href="/marketplace"
        className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
      >
        Redeem Your Greencoins
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 ml-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </a>
    </div>
  </div>
</section>

     
     
     </>
  )
}
