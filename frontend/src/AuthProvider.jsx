// Create a new file (e.g., AuthProvider.js)
import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

// API base URL - adjust this to match your environment
const API_BASE_URL ='https://smartwaste-3smg.onrender.com';

// Configure axios with default headers
const api = axios.create({
  baseURL: API_BASE_URL
});

// Auth Provider component to handle user sync
export const AuthProvider = ({ children }) => {
  const { isSignedIn, getToken } = useAuth();

  useEffect(() => {
    // Function to sync user with backend
    const syncUser = async () => {
      if (!isSignedIn) return;
      
      try {
        // Get Clerk token
        const token = await getToken();
        
        // Set auth header for all future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        try {
          // Try fetching current user (will succeed if user exists)
          await api.get('/api/users/me');
          console.log('User exists in backend');
        } catch (error) {
          if (error.response?.status === 404) {
            // User doesn't exist in our backend, send profile update to create them
            console.log('Creating new user in backend');
            await api.put('/api/users/profile', {});
          }
        }
      } catch (error) {
        console.error('Error synchronizing user with backend:', error);
      }
    };

    // Call sync function when auth state changes
    syncUser();
  }, [isSignedIn, getToken]);

  // Return children without wrapping in additional elements
  return children;
};

// API utility functions
export const userService = {
  getProfile: async () => {
    const response = await api.get('/api/users/me');
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await api.put('/api/users/profile', profileData);
    return response.data;
  },
  
  getGreenCoins: async () => {
    const response = await api.get('/api/users/me');
    return response.data.greenCoins;
  },
  
  addGreenCoins: async (amount) => {
    const response = await api.post('/api/users/green-coins', { amount });
    return response.data;
  }
};

export const listingService = {
  getListings: async (filters = {}) => {
    const response = await api.get('/api/listings', { params: filters });
    return response.data;
  },
  
  getListingById: async (id) => {
    const response = await api.get(`/api/listings/${id}`);
    return response.data;
  },
  
  createListing: async (listingData) => {
    const response = await api.post('/api/listings', listingData);
    return response.data;
  },
  
  updateListing: async (id, listingData) => {
    const response = await api.put(`/api/listings/${id}`, listingData);
    return response.data;
  },
  
  deleteListing: async (id) => {
    const response = await api.delete(`/api/listings/${id}`);
    return response.data;
  },
  
  getUserListings: async () => {
    const response = await api.get('/api/listings/user/me');
    return response.data;
  },
  getPurchasedListings: async () => {
    try {
      const response = await api.get('/api/listings/purchased');
      return response.data;
    } catch (error) {
      console.error('Error fetching purchased listings:', error);
      throw error;
    }
  },
  
  purchaseListing: async (listingId, price) => {
    try {
      const response = await api.post('/api/listings/purchase', { 
        listingId, 
        price 
      });
      return response.data;
    } catch (error) {
      console.error('Error purchasing listing:', error);
      throw error;
    }
  },
  
  updateListingPrice: async (listingId, price) => {
    try {
      const response = await api.patch(`/api/listings/${listingId}`, { 
        price: parseInt(price) || 0 
      });
      return response.data;
    } catch (error) {
      console.error('Error updating listing price:', error);
    }

  }
};

// Example of how to set up axios interceptor for token refreshes
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get a fresh token from Clerk
        const { getToken } = useAuth();
        const token = await getToken();
        
        // Update the authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);