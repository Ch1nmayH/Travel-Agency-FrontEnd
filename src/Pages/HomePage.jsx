import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from "framer-motion";
import FeaturedPackage from '../Components/FeaturedPackage';
import BannerImage from "../Assets/banner.jpeg";

const HomePage = () => {
  const [packages, setPackages] = useState([]); 
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  //API base URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/packages`);
        if (Array.isArray(response.data)) {
          setPackages(response.data);
        } else {
          setError('Unexpected data structure');
        }
      } catch (err) {
        setError('Failed to fetch Packages');
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Error state
  }
  
  return (
    <div className="bg-gray-100 min-h-screen">
    {/* Banner Section */}
    <div className="relative h-[400px] bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${BannerImage})` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <motion.div
        className="relative flex justify-center items-center h-full text-white text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold">Welcome to TravelGo</h1>
      </motion.div>
    </div>
  
    {/* Title Section */}
    <div className="text-center mt-8">
      <h2 className="text-3xl font-bold text-gray-800">Featured Packages</h2>
    </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
      {packages.slice(0, 3).map((singlePackage) => (
        <FeaturedPackage key={singlePackage._id} singlePackage={singlePackage}/>
        // console.log(singlePackage._id)
      ))}
    </div>

    </div>
  )
}

export default HomePage