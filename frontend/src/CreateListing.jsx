/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CreateListing = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    materialType: 'Plastic',
    quantity: '',
    unit: 'kg',
    price: '',
    amount: '',
    location: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const materialTypes = ['Plastic', 'Metal', 'Glass', 'Paper', 'Organic', 'Electronics', 'Other'];
  const unitTypes = ['kg', 'tons', 'pieces', 'cubic meters', 'liters'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Remove the automatic calculation logic that was here
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('https://smartwaste-3smg.onrender.com/api/listings', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 200 || response.status === 201) {
        toast.success('Listing created successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
        });

        setFormData({
          title: '',
          description: '',
          materialType: 'Plastic',
          quantity: '',
          unit: 'kg',
          price: '',
          amount: '',
          location: '',
        });
      } else {
        throw new Error('Failed to create listing');
      }
    } catch (error) {
      toast.error(`❌ ${error.response?.data?.message || 'An error occurred'}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 text-white p-8  mb-8 rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Create New Listing</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block mb-2">Listing Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-gray-700 p-3 rounded text-white"
              placeholder="Enter a title for your listing"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-700 p-3 rounded text-white min-h-24"
              placeholder="Provide details about the waste material you're listing"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Material Type</label>
            <select
              name="materialType"
              value={formData.materialType}
              onChange={handleChange}
              className="w-full bg-gray-700 p-3 rounded text-white appearance-none"
              required
            >
              {materialTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-gray-700 p-3 rounded text-white"
              placeholder="Enter collection location"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full bg-gray-700 p-3 rounded text-white"
              placeholder="Amount available"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block mb-2">Unit</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full bg-gray-700 p-3 rounded text-white appearance-none"
              required
            >
              {unitTypes.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Maximum Green Coins</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-gray-700 p-3 rounded text-white"
              placeholder="Enter price per unit"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
  <label className="block mb-2">Total Amount</label>
  <input
    type="number"
    name="amount"
    value={formData.amount}
    onChange={handleChange}
    className="w-full bg-gray-700 p-3 rounded text-white"
    placeholder="Enter total amount"
    required
    min="0"
    step="0.01"
  />
</div>
        </div>

        <div className="mt-8 text-center">
          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-600 text-white py-3 px-6 rounded inline-flex items-center justify-center w-full md:w-auto min-w-40"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>Submit Listing</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
