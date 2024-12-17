import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-12 shadow-lg rounded-lg max-w-lg w-full">
        <h1 className="text-6xl font-bold text-red-500 mb-4">Oops!</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">404 - Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="text-lg text-white bg-gray-800 text-white py-3 px-6 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;