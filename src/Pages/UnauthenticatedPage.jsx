import React from 'react'
import { Link } from 'react-router-dom'


const UnauthenticatedPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center bg-white p-12 shadow-lg rounded-lg max-w-lg w-full">
            <h1 className="text-5xl font-bold text-red-500 mb-4">Unauthenticated</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">403 - Access Denied</h2>
            <p className="text-lg text-gray-600 mb-8">
              You do not have permission to view this page. Please contact your administrator if you believe this is an error.
            </p>
            <Link
              to="/login"
              className="text-lg text-white bg-gray-800 py-3 px-6 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Login Now
            </Link>
          </div>
        </div>
      );
    };


export default UnauthenticatedPage