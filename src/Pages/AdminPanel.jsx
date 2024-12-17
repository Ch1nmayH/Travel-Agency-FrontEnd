import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import UserContext from "../utils/CreateContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const { token, setToken } = useContext(UserContext);

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const Navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    availableDates: "",
    image: null,
  });
  const [selectedSection, setSelectedSection] = useState("add"); // 'add', 'manage', 'bookings'

  useEffect(() => {
    if (!token) {
      toast.error("Unauthorized access. Redirecting to login page...");
      setTimeout(() => {
        Navigate("/unAuthenticated");
      }, 2000);
    } else {
      
        const adminValidation =  axios.get(
          `${API_BASE_URL}/api/admin/verify`,
          {},
          {
            withCredentials: true,
          }
        ).then(adminValidation =>{
          console.log("Admin validation:", adminValidation);
          if (adminValidation.status === 201 && adminValidation.data.isAdmin) {
            toast.success("Welcome Admin!");
          } else {
            toast.error("Unauthorized access. Redirecting to login page...");
            Navigate("/notAuthorized");
          }
        }).catch(error => {
        console.error("Error validating admin:", error);
        toast.error("Unauthorized access. Redirecting to login page...");
        Navigate("/notAuthorized");
      })
    }
  }, [token]);

  useEffect(() => {
    // Fetch packages when the component mounts
    axios
      .get(`${API_BASE_URL}/api/packages`)
      .then((response) => setPackages(response.data))
      .catch((error) => console.error("Error fetching packages:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setFormData((prevData) => ({
        ...prevData,
        image: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleAddPackage = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("availableDates", formData.availableDates);
    formDataToSend.append("image", formData.image);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/packages`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPackages([...packages, response.data]);
      setFormData({
        title: "",
        description: "",
        price: "",
        availableDates: "",
        image: null,
      });
      toast.success("Package added successfully!");
    } catch (error) {
      toast.error("Failed to add package");
    }
  };

  const handleUpdatePackage = async (id) => {
    const updatedPackage = packages.find((pkg) => pkg._id === id);
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/packages/${id}`,
        updatedPackage
      );
      toast.success("Package updated successfully!");
    } catch (error) {
      toast.error("Failed to update package");
    }
  };

  const handleDeletePackage = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/packages/${id}`);
      setPackages(packages.filter((pkg) => pkg._id !== id));
      toast.success("Package deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete package");
    }
  };

  const handleViewBookings = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/bookings`
      );
      setBookings(response.data);
    } catch (error) {
      toast.error("Failed to fetch bookings");
    }
  };

  return (
    <div className="flex p-4 space-x-8 flex-wrap">
      {/* Sidebar */}
      <div className="w-full sm:w-1/4 bg-gray-800 text-white p-4 rounded-lg mb-8 sm:mb-0">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <ul className="space-y-4">
          <li>
            <button
              className={`w-full text-left p-2 rounded ${
                selectedSection === "add" ? "bg-blue-600" : "hover:bg-blue-500"
              }`}
              onClick={() => setSelectedSection("add")}
            >
              Add Package
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left p-2 rounded ${
                selectedSection === "manage"
                  ? "bg-blue-600"
                  : "hover:bg-blue-500"
              }`}
              onClick={() => setSelectedSection("manage")}
            >
              Manage Packages
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left p-2 rounded ${
                selectedSection === "bookings"
                  ? "bg-blue-600"
                  : "hover:bg-blue-500"
              }`}
              onClick={() => setSelectedSection("bookings")}
            >
              View Bookings
            </button>
          </li>
          <li>
            <button
              className="w-full text-left p-2 rounded hover:bg-blue-500"
              onClick={() => {
                toast.info("Logging out...");
                if (token) {
                  setTimeout(() => {
                    setToken(null);
                    Cookies.remove("token");
                  }, 2000);
                }
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Add Package Form */}
        {selectedSection === "add" && (
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-4">Add New Package</h3>
            <form onSubmit={handleAddPackage} className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Package Title"
                className="p-2 w-full border rounded"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Package Description"
                className="p-2 w-full border rounded"
                required
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                className="p-2 w-full border rounded"
                required
              />
              <input
                type="text"
                name="availableDates"
                value={formData.availableDates}
                onChange={handleChange}
                placeholder="Available Dates"
                className="p-2 w-full border rounded"
                required
              />
              {/* Image Upload */}
              <div className="flex flex-col">
                <label className="font-semibold">Image Upload</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="p-2 w-full border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Package
              </button>
            </form>
          </div>
        )}

        {/* Manage Packages */}
        {selectedSection === "manage" && (
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-4">Manage Packages</h3>
            <div className="space-y-4">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="flex justify-between items-center p-4 border rounded mb-4"
                >
                  <div>
                    <h4 className="font-semibold">{pkg.title}</h4>
                    <p>{pkg.description}</p>
                    <p>
                      <strong>Price:</strong> ${pkg.price}
                    </p>
                    <p>
                      <strong>Available Dates:</strong> {pkg.availableDates}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdatePackage(pkg._id)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View Bookings */}
        {selectedSection === "bookings" && (
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-4">View Bookings</h3>
            <button
              onClick={handleViewBookings}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Fetch Bookings
            </button>
            <div className="mt-6">
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="border p-4 rounded mb-4">
                      <h3 className="font-semibold">ID : {booking._id}</h3>
                      <h4 className="font-semibold">{booking.name}</h4>
                      <p>
                        <strong>Email:</strong> {booking.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {booking.phone}
                      </p>
                      <p>
                        <strong>Package:</strong> {booking.packageId.title}
                      </p>
                      <p>
                        <strong>Number of Travelers:</strong>{" "}
                        {booking.numberOfTravelers}
                      </p>
                      <p>
                        <strong>Special Requests:</strong>{" "}
                        {booking.specialRequest}
                      </p>
                      <p>
                        <strong>Booking Date:</strong> {booking.bookingDate}
                      </p>
                      <p>
                        <strong>Total Price:</strong> ${booking.totalPrice}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No bookings found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
