/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth ,useClerk } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from "@clerk/clerk-react";


export default function Marketplace() {
  const [listings, setListings] = useState([]);
  const [materialType, setMaterialType] = useState("All Materials");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [purchasedListings, setPurchasedListings] = useState([]);
  const [discountCoins, setDiscountCoins] = useState({});
  const [finalPrices, setFinalPrices] = useState({});
  const { getToken } = useAuth(); 
  const [amount, setamount] = useState(10);
  const [orderDetails, setOrderDetails] = useState(null);
  const [userGreenCoins, setUserGreenCoins] = useState(0);
  const { user, isLoaded, isSignedIn } = useUser();
  const [userProfile, setUserProfile] = useState(null);


// Add this function to fetch user data including GreenCoins
useEffect(() => {
  const fetchUserData = async () => {
    if (!isLoaded || !isSignedIn) return;
    
    try {
      setLoading(true);
      
      // Get the Clerk ID of the currently logged-in user
      const clerkId = user.id;
      
      // Fetch user data from your backend API using the Clerk ID
      const response = await axios.get(
        `https://smartwaste-3smg.onrender.com/api/user/profile/${clerkId}`
      );
      
      setUserProfile(response.data);
      setUserGreenCoins(response.data.greenCoins);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  fetchUserData();
}, [isLoaded, isSignedIn, user]);


const handlePayment = async (listingId, finalPrice) => {
  // Check if user has enough GreenCoins for the discount
  const requestedCoins = discountCoins[listingId] || 0;
  
  if (requestedCoins > userGreenCoins) {
    toast.error(`You only have ${userGreenCoins} GreenCoins available.`);
    return;
  }
  
  try {
    const res = await fetch(`https://smartwaste-3smg.onrender.com/api/payment/order`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        amount: finalPrice
      })
    });

    const data = await res.json();
    handlePaymentVerify(data.data, listingId, finalPrice);
  } catch (error) {
    console.log(error);
  }
}
  // handlePaymentVerify Function
  const handlePaymentVerify = async (data, listingId, finalPrice) => {
    const options = {
      key: import.meta.env.RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Devknus",
      description: "Test Mode",
      order_id: data.id,
      handler: async (response) => {
        // console.log("response", response)
        try {
          const res = await fetch(`https://smartwaste-3smg.onrender.com/api/payment/verify`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
          });
  
          const verifyData = await res.json();
  
          if (verifyData.message) {
            toast.success(verifyData.message);
            // Call handlePurchase only after successful payment verification
            handlePurchase(listingId, finalPrice);
          }
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: "#5f63b8"
      }
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  }
  

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (materialType !== "All Materials") {
        params.materialType = materialType;
      }
      
      if (search) {
        params.search = search;
      }
      
      const response = await axios.get('https://smartwaste-3smg.onrender.com/api/listings', { params });
   
      const initialFinalPrices = {};
      response.data.forEach(listing => {
        initialFinalPrices[listing._id] = listing.amount;
      });
      setFinalPrices(initialFinalPrices);
      setListings(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch listings. Please try again.");
      console.error("Error fetching listings:", err);
    } finally {
      setLoading(false);
    }
  };
// Function to update listing price based on user-entered GreenCoins
const updateListingPrice = (listingId, coins) => {
  const safeCoins = parseInt(coins) || 0;
  
  // Update the discount coins state
  setDiscountCoins(prev => ({
    ...prev,
    [listingId]: safeCoins
  }));
  
  // Calculate final price based on new discount
  const listing = listings.find(l => l._id === listingId);
  if (listing) {
    setFinalPrices(prev => ({
      ...prev,
      [listingId]: Math.max(0, listing.amount - safeCoins)
    }));
    
    // Update the API
  }
};


 // Update the handleDiscountChange function to also update the listing price API
// Modify your handleDiscountChange function to validate against available coins
const handleDiscountChange = (listingId, coins, maxCoins) => {
  // First ensure discount doesn't exceed available coins or item price
  const safeCoins = Math.min(Math.max(0, coins), maxCoins);
  
  // Check if user has enough coins
  if (safeCoins > userGreenCoins) {
    toast.error(`You only have ${userGreenCoins} GreenCoins available.`);
    // Set the value to user's available coins or keep previous value
    const validCoins = Math.min(userGreenCoins, discountCoins[listingId] || 0);
    
    setDiscountCoins(prev => ({
      ...prev,
      [listingId]: validCoins
    }));
    
    // Recalculate final price with valid coins
    const listing = listings.find(item => item._id === listingId);
    if (listing) {
      const newFinalPrice = Math.max(0, listing.amount - validCoins);
      setFinalPrices(prev => ({
        ...prev,
        [listingId]: newFinalPrice
      }));
    }
    return;
  }
  
  // Continue with original functionality if validation passes
  setDiscountCoins(prev => ({
    ...prev,
    [listingId]: safeCoins
  }));
  
  // Recalculate final price
  const listing = listings.find(item => item._id === listingId);
  if (listing) {
    const newFinalPrice = Math.max(0, listing.amount - safeCoins);
    setFinalPrices(prev => ({
      ...prev,
      [listingId]: newFinalPrice
    }));
  }
};
// const updateListingPriceAPI = async (listingId, coins) => {
//   try {
//     const token = await getToken();
//     const response = await axios.patch(
//       `https://smartwaste-3smg.onrender.com/api/listings/${listingId}`,
//       { price: parseInt(coins) || 0 },
//       {
//         headers: { 
//           'Authorization': `Bearer ${token}`
//         }
//       }
//     );
    
//     console.log('Successfully updated listing price:', response.data);
    
//   } catch (error) {
//     console.error('Error updating listing price:', error);
//     toast.error('Failed to update listing price. Please try again.');
//   }
// };

  // Initial fetch and when filters change
  useEffect(() => {
    fetchListings();
    const loadUserData = async () => {
      const token = await getToken();
      if (token) {
        // fetchUserData();
        fetchPurchasedItems();
      }
    };
    
    loadUserData();
  }, [materialType, search ]);

  // Handle search input with debounce
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Format date to "X days ago"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else {
      return `${diffDays} days ago`;
    }
  };

  // Get appropriate icon based on material type
  const getMaterialIcon = (materialType) => {
    switch(materialType) {
      case "Plastic":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-600 dark:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case "Paper":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-600 dark:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "Metal":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-600 dark:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case "Glass":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-600 dark:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      case "Electronics":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-600 dark:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case "Organic":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-600 dark:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-600 dark:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleSaveNewListing = () => {
    // Trigger a refresh of listings
    setRefreshTrigger(prev => prev + 1);
  };

  const fetchPurchasedItems = async () => {
    try {
      const token = await getToken();
      
      if (!token) {
        console.log('No auth token available yet');
        return; // Exit if no token is available
      }
      
      const response = await axios.get('https://smartwaste-3smg.onrender.com/api/listings/purchased', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPurchasedListings(response.data);
      setPurchasedItems(response.data.map(item => item._id));
    } catch (error) {
      console.error('Error fetching purchased items:', error);
      // Check if it's a 401 error
      if (error.response && error.response.status === 401) {
        console.log('Authentication error, will retry when token is available');
      }
    }
  };
  // Add this useEffect to watch for auth changes
 // This will run when the auth token changes
  // Add this to your useEffect to fetch purchased items on load
  useEffect(() => {
    fetchListings();
    
    // Add a check for authentication before fetching purchased items
    const loadPurchasedItems = async () => {
      const token = await getToken();
      if (token) {
        fetchPurchasedItems();
      }
    };
    
    loadPurchasedItems();
  }, [materialType, search, refreshTrigger]);

  useEffect(() => {
    const checkAuthAndFetchItems = async () => {
      const token = await getToken();
      if (token) {
        fetchPurchasedItems();
      }
    };
    
    checkAuthAndFetchItems();
  }, [getToken]);

  const handlePurchase = async (listingId, finalPrice) => {
    try {
      const token = await getToken();
      
      // Add the listing ID to purchased items
      setPurchasedItems(prev => [...prev, listingId]);
      
      // Get the discount coins for this purchase
      const coinsUsed = discountCoins[listingId] || 0;
      
      console.log(`Purchasing item ${listingId} for Rs. ${finalPrice} with ${coinsUsed} GreenCoins discount`);
      
      // Send request to purchase the item and deduct coins
      const response = await axios.post(
        'https://smartwaste-3smg.onrender.com/api/listings/purchase',
        { 
          listingId,
          price: coinsUsed
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Show success message
      toast.success('Item purchased successfully!');
      try {
        const token = await getToken();
        const response = await axios.patch(
          `https://smartwaste-3smg.onrender.com/api/listings/${listingId}`,
          { price: parseInt(coinsUsed) || 0 },
          {
            headers: { 
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        console.log('Successfully updated listing price:', response.data);
        
      } catch (error) {
        console.error('Error updating listing price:', error);
        toast.error('Failed to update listing price. Please try again.');
      }
      // Refresh listings and purchased items
      fetchListings();
      fetchPurchasedItems();
      
    } catch (error) {
      console.error('Error purchasing item:', error);
      
      // Remove from purchased items if there was an error
      setPurchasedItems(prev => prev.filter(id => id !== listingId));
      
      toast.error(error.response?.data?.message || 'Failed to purchase item. Please try again.');
    }
  };
  








 






  return (
    <div>
<section
  id="recycling-marketplace"
  className="py-20 bg-white dark:bg-neutral-900"
>
  <div className="container mx-auto px-4">
    <div className="mb-16 text-center">
      <span className="inline-block px-3 py-1 text-sm font-semibold bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full mb-4">
        Connect &amp; Recycle
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
        Recycling Marketplace
      </h2>
      <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">
        Connect with buyers and sellers of recyclable waste materials through
        our community marketplace, turning waste into valuable resources.
      </p>
    </div>
    {/* Marketplace Interface */}
    <div className="flex flex-col lg:flex-row items-stretch gap-12 mb-16">






















    <div className="lg:w-2/3 bg-gray-50 dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden">
      {/* Marketplace Header */}
            {/* Marketplace Header */}
            <div className="bg-amber-600 dark:bg-amber-700 p-4 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Recyclable Materials Marketplace
            </h3>
            <button 
              className="bg-white text-amber-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-amber-50 transition duration-300"
              onClick={() => setShowModal(true)}
            >
              Shop it
            </button>
          </div>
        </div>
      
      {/* Marketplace Filter Bar */}
      <div className="bg-white dark:bg-neutral-700 p-4 border-b border-gray-200 dark:border-neutral-600">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <span className="text-gray-700 dark:text-gray-300 text-sm">
              Filter by:
            </span>
            <select 
              className="px-3 py-2 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value)}
            >
              <option>All Materials</option>
              <option>Plastic</option>
              <option>Paper</option>
              <option>Metal</option>
              <option>Glass</option>
              <option>Electronics</option>
              <option>Organic</option>
              <option>Other</option>
            </select>
          </div>
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search materials..."
              className="pl-9 pr-4 py-2 w-full md:w-64 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={search}
              onChange={handleSearchChange}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
      

      {/* <NewListingModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        onSave={handleSaveNewListing}
      /> */}
      {/* Marketplace Listings */}
      <div className="overflow-y-auto max-h-[750px] p-4">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 p-4 rounded-md">
            {error}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No listings found. Try changing your filters.
          </div>
        ) : (
          listings
          .filter(listing => !purchasedItems.includes(listing._id))
          .map((listing) => (
            <div key={listing._id} className="bg-white dark:bg-neutral-700 p-4 rounded-lg mb-3 shadow-sm hover:shadow-md transition duration-300">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-md">
                  {getMaterialIcon(listing.materialType)}
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {listing.title}
                    </h4>
                    {listing.isInDemand && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                        In Demand
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    {listing.description}
                  </p>
                  <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-3">
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
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
                      {listing.location}
                    </span>
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Posted {formatDate(listing.createdAt)}
                    </span>
                 {/* GreenCoin Input - Update this section */}
{/* In the input field section */}
<div className="flex justify-between items-center mb-2">
  <label htmlFor={`coins-${listing._id}`} className="text-gray-700 dark:text-gray-300">
    Apply GreenCoins: ({userGreenCoins} available)
  </label>
  <div className="flex items-center">
    <input
      id={`coins-${listing._id}`}
      type="number"
      max={listing.price} // Maximum coins should be limited
      value={discountCoins[listing._id]}
      onChange={(e) => handleDiscountChange(listing._id, parseInt(e.target.value), Math.min(listing.price, userGreenCoins))}
      className="w-16 p-1 border border-gray-300 dark:border-gray-600 rounded text-center mr-2"
    />
    <span className="text-sm">/ {listing.price} Maximum </span>
  </div>
</div>

{/* Updated pricing display */}
<div className="flex justify-between items-center font-bold">
  <span className="text-gray-700 dark:text-gray-300">Final Price:</span>
  <span className="text-amber-600 dark:text-amber-400">
    Rs. {finalPrices[listing._id] || listing.amount}
    {(discountCoins[listing._id] && discountCoins[listing._id] > 0) && 
      ` (${discountCoins[listing._id]} GreenCoins applied)`}
  </span>
</div>
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                        />
                      </svg>
                      {listing.quantity} {listing.unit}
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
               {/* Updated purchase button */}
               <button
  className={`px-4 py-2 ${
    purchasedItems.includes(listing._id)
      ? 'bg-green-600 hover:bg-green-700'
      : 'bg-amber-600 hover:bg-amber-700'
  } text-white rounded-md text-sm font-medium transition duration-300`}
  onClick={() => {
    if (!purchasedItems.includes(listing._id)) {
      // Only call handlePayment first, which will call handlePurchase after successful payment
      handlePayment(listing._id, finalPrices[listing._id] || listing.amount);
    }
  }}
  disabled={purchasedItems.includes(listing._id)}
>
  {purchasedItems.includes(listing._id) 
    ? 'Purchased' 
    : `Buy for Rs. ${finalPrices[listing._id] || listing.amount}`}
</button>
</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>

      {/* Marketplace Features */}
      <div className="lg:w-1/3">
        <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl border border-amber-100 dark:border-amber-800 mb-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            How It Works
          </h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                  Explore products
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Explore various ecofreindly recyclable products on marketplace.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                  Connect with Buyers
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Interested buyers will contact you through our secure
                  messaging system to arrange pickup.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                  Complete the Transaction
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Exchange materials for GreenCoins or direct payment and
                  confirm the completed transaction.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                  Chat With AI
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Use chatbot for more information and Contact us for any queries.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition duration-300 flex items-center justify-center">
            <Link
    to="/reward"
    className="hover:text-[#F39C12] transition-colors duration-300"
  >
    Check Balance
  </Link>
            </button>
          </div>
        </div>
        {/* Stats Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Marketplace Stats
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                15+
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                Active Listings
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                120
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                Registered Users
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                7+
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                Material Types
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                2k
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                Monthly Trades
              </div>
            </div>
          </div>
          {/* <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
            <div className="flex items-center text-amber-800 dark:text-amber-300">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">Most Active Areas</span>
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Downtown (32%), Industrial Zone (28%), University Area (18%), Tech
              Park (14%), Residential Areas (8%)
            </div>
          </div> */}
        </div>
      </div>
    </div>



    {/* Purchased Items Section */}
    <div className="lg:w-2/3 mx-auto">
  <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden h-full">
    <div className="bg-green-600 dark:bg-green-700 p-4 text-white">
      <h3 className="text-xl font-semibold">Your Purchased Items</h3>
    </div>
    
    <div className="overflow-y-auto max-h-[750px] p-4">
      {purchasedListings.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          You haven't purchased any items yet.
        </div>
      ) : (
        [...purchasedListings].reverse().map((listing) => (
          <div key={listing._id} className="bg-white dark:bg-neutral-700 p-4 rounded-lg mb-3 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-md">
                  {getMaterialIcon(listing.materialType)}
                </div>
                <div className="flex-grow">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {listing.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    {listing.description}

                    &nbsp;&nbsp;  {listing.quantity} {listing.unit}  &nbsp;&nbsp;  {listing.materialType}

                  </p>
                  <p></p>
                </div>
              </div>
              <div className="flex flex-col text-sm text-gray-500 dark:text-gray-400">
  <span className="flex items-center font-medium">
    <span className=" text-red-600 dark:text-red-400">-</span> 
    {listing.price}    <span >&nbsp; GreenCoins</span>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 ml-1 text-red-600 dark:text-red-400"
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
  </span>
  

  <span className="  font-medium" >    <span className=" text-red-600 dark:text-red-400 font-medium">-</span> 
  {listing.amount - listing.price } Rs</span>
</div>

            </div>
          </div>
        ))
      )}
    </div>
  </div>
</div>




    {/* CTA */}
    <div className="mt-16 text-center">
      <a
        href="/marketplace"
        className="inline-flex items-center px-6 py-4 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-lg transition duration-300 transform hover:-translate-y-1"
      >
        Start Recycling Today
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
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </a>
    </div>
  </div>
</section>
</div>
  )
}

