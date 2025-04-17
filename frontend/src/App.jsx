/* eslint-disable no-unused-vars */
import Landingpage from './landingpage'
import Navbar from './navbar'
import Footer from './footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Report from './report'; // Adjust the path as needed
import Reward from './reward'; // Adjust the path as needed
import Marketplace from './marketplace';
import { ClerkProvider,useUser } from '@clerk/clerk-react';
import AdminLogin from './adminLogin';
import AdminDashboard from './adminDashboard';
import "./index.css";  
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "./adminnavbar";
import React, { useState , useEffect } from "react";
import Chatbot from './Chatbot'; // Make sure this path is correct


function App() {
  const {user} = useUser();

  if(user) {
    console.log('user ID: ',user.id);
  }
// ✅ Retrieve stored login state from localStorage
const [isAdmin, setIsAdmin] = useState(() => {
  return localStorage.getItem("isAdmin") === "true"; 
});

// ✅ Update localStorage when isAdmin changes
useEffect(() => {
  localStorage.setItem("isAdmin", isAdmin);
}, [isAdmin]);
  return (
    <> 
    <Router>
    {isAdmin ? <AdminNavbar setIsAdmin={setIsAdmin} /> : <Navbar />}

      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/report" element={<Report />} />
        <Route path="/reward" element={<Reward />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/admin" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
         
      </Routes>
      <Chatbot />

      <Footer />
    <ToastContainer />
    </Router>
    </>
  )
}

export default App
