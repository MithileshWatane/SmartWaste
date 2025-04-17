/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


const History = () => {

  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState(null);
  const API_URL = 'https://smartwaste-3smg.onrender.com/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
  
      // Fetch all users and listings concurrently
      const [usersResponse, listingsResponse] = await Promise.all([
        axios.get(`${API_URL}/allusers`),  // Your existing API for users
        axios.get(`${API_URL}/listings`)   // Your existing API for listings
      ]);
  
      let usersData = usersResponse.data;
  
      // Fetch user details from Clerk for each user
      const userDetailsPromises = usersData.map(async (user) => {
        try {
          const clerkResponse = await axios.get(
            `https://smartwaste-3smg.onrender.com/api/users/${user.clerkId}`, 
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.CLERK_SECRET_KEY}`,
              },
            }
          );
          return {
            ...user,
            displayName: clerkResponse.data.name || clerkResponse.data.username,
            email: clerkResponse.data.email || "No email",
          };
        } catch (error) {
          console.error(`Failed to fetch Clerk data for user ${user.clerkId}`);
          return { ...user, displayName: "Unknown", email: "No email" };
        }
      });
  
      usersData = await Promise.all(userDetailsPromises);
  
      setUsers(usersData);
      setListings(listingsResponse.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load data", {
        position: "top-right",
        theme: "dark",
      });
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get listing details by ID
  const getListingDetails = (listingId) => {
    return listings.find(listing => listing._id === listingId) || null;
  };

  // Toggle user expansion
  const toggleUserExpansion = (userId) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="text-white p-8  rounded-lg max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">All Users and Their Purchases</h2>
      
      <div className="space-y-4">
        {users.map(user => (
          <div key={user._id} className="bg-gray-700 rounded-lg overflow-hidden">
            {/* User Header */}
            <div 
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-600"
              onClick={() => toggleUserExpansion(user._id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-lg font-bold">
                  {user.displayName.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{user.displayName}</div>
                  <div className="text-sm text-gray-300">{user.email}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-teal-500 bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  {user.purchasedItems?.length || 0} Purchases
                </div>
                <div className="text-xl">{expandedUser === user._id ? '▼' : '▶'}</div>
              </div>
            </div>
            
            {/* User Purchases */}
            {expandedUser === user._id && user.purchasedItems?.length > 0 && (
              <div className="p-4 border-t border-gray-600">
                <h3 className="text-lg font-semibold mb-3">Purchased Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-600">
                        <th className="p-2 text-left">Item</th>
                        <th className="p-2 text-left">Material</th>
                        <th className="p-2 text-left">Quantity</th>
                        <th className="p-2 text-left">Green Coins Used</th>
                        <th className="p-2 text-left">Amount</th>
                        <th className="p-2 text-left">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.purchasedItems.map(itemId => {
                        const listing = getListingDetails(itemId);
                        if (!listing) return null;
                        
                        return (
                          <tr key={itemId} className="hover:bg-gray-600">
                            <td className="p-2">
                              <div className="font-medium">{listing.title}</div>
                              <div className="text-xs text-gray-400">{itemId.substring(itemId.length - 6)}</div>
                            </td>
                            <td className="p-2">{listing.materialType}</td>
                            <td className="p-2">{listing.quantity} {listing.unit}</td>
                            <td className="p-2">{listing.price} </td>
                            <td className="p-2">{listing.amount - listing.price} Rs</td>
                            <td className="p-2">{listing.location}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* No Purchases Message */}
            {expandedUser === user._id && (!user.purchasedItems || user.purchasedItems.length === 0) && (
              <div className="p-4 border-t border-gray-600 text-center text-gray-400">
                This user has not purchased any items yet.
              </div>
            )}
          </div>
        ))}
      </div>
      
      {users.length === 0 && (
        <div className="text-center p-8 text-gray-400">
          No users found.
        </div>
      )}
    </div>
  );
};

export default History;
