import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import UserContext from "../utils/CreateContext";
import { toast } from "react-toastify";

const Package = () => {
  const { packageId } = useParams();
  const [packageData, setPackageData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(UserContext);
  const Navigate = useNavigate();

   // API base URL
   const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/packages/${packageId}`,
          {}
        );
        setPackageData(response.data);
      } catch (err) {
        setError("Failed to fetch Package");
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [packageId, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!packageData) return <div>Package not found</div>;

  const handleBookNow = () => {
    if (!token) {
      toast.info("Redirecting to login page...");
      toast.error("Please login to book a package");
      
      setTimeout(() => {
        Navigate("/login");
      }, 2000);
      
    }
    else {

      Navigate(`/book/${packageId}`);
    }
    
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <motion.div
        className="flex flex-col lg:flex-row items-center lg:items-start gap-8 bg-white rounded-lg shadow-lg p-6 lg:p-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Package Image */}
        <div className="w-full lg:w-5/12 max-w-md">
          <motion.img
            src={`${API_BASE_URL}/${packageData.image}`}
            alt={packageData.title}
            className="w-full h-72 object-contain rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ maxWidth: "400px", height: "300px" }}
          />
        </div>

        {/* Package Details */}
        <div className="w-full lg:w-7/12 flex flex-col items-center lg:items-start gap-4">
          <h1 className="text-3xl font-bold text-gray-800 text-center lg:text-left">
            {packageData.title}
          </h1>
          <p className="text-gray-600 text-lg text-center lg:text-left">
            {packageData.description}
          </p>
          <div className="text-2xl font-semibold text-green-500">
            RS {packageData.price}
          </div>

          {/*Book Now Button */}
          <motion.button
            className={`mt-6 w-full lg:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-transform transform hover:scale-105`}
            whileHover={{ scale: 1.05 }}
            onClick={handleBookNow}
          >
            {/* <ShoppingCartIcon fontSize="small" /> */}
            Book Now
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Package;
