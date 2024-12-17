import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import UserContext from "../utils/CreateContext";
import LoadingSpinner from "../Components/LogingSpinner";
import PackageCard from "../Components/PackageCard";


const Packages = () => {

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(UserContext);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/packages`,
          {}
        );
        setPackages(response.data);
      } catch (err) {
        setError("Failed to fetch Package");
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [packages, token]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!packages.length) {
    return <p className="text-center text-lg mt-5">No packages available.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:mt-[40px]">
      <h1 className="text-3xl font-bold mb-8 text-center">Featured Packages</h1>

      {/* Packages Grid */}
      <div className="flex flex-wrap justify-center">
        {packages.map((singlePackage) => ( console.log(singlePackage),
          
          <PackageCard
            key={singlePackage._id}
            singlePackage={singlePackage}
          />
        ))
        }
      </div>
    </div>
  );
  
}

export default Packages