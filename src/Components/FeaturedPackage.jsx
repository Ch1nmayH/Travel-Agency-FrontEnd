import React from "react";
import { useNavigate } from "react-router-dom";

const FeaturedPackage = ({ singlePackage }) => {
  const navigate = useNavigate();
  //API base URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const handleClick = () => {
    navigate(`/package/${singlePackage._id}`); // Navigate to the package's detail page
  };
  return (
    <div
      className="bg-gray-50 shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105 hover:bg-gray-100 cursor-pointer"
      onClick={handleClick}
    >
      {console.log(singlePackage)}
      <div className="flex flex-col items-center">
        <img
          src={`${API_BASE_URL}/${singlePackage.image}`}
          alt={singlePackage.title}
          className="w-full h-48 object-contain rounded-md mb-4"
        />
        <h3 className="text-xl font-semibold text-center">
          {singlePackage.title}
        </h3>
        <p className="text-gray-700 text-center">{singlePackage.description}</p>
        <p className="text-blue-600 mt-4 text-lg font-bold text-center">
          Rs {singlePackage.price}{" "}
        </p>
      </div>
    </div>
  );
};

export default FeaturedPackage;
