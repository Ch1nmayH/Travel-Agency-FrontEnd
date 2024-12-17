import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import axios from "axios";
import LoadingSpinner from "../Components/LogingSpinner";

const BookingSuccess = () => {
  const bookingId = useParams().bookingId;
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);

   // API base URL
   const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/admin/bookings/${bookingId}`
        );
        setBookingDetails(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId]);

  // Generate PDF Invoice
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("TravelGo Booking Invoice", 20, 20);
    doc.setFont("helvetica", "normal");

    const {
      name,
      email,
      phone,
      numberOfTravelers,
      specialRequest,
      packageId,
      totalPrice,
      bookingDate,
    } = bookingDetails;

    doc.text(`Booking ID: ${bookingId}`, 20, 40);
    doc.text(`Name: ${name}`, 20, 50);
    doc.text(`Email: ${email}`, 20, 60);
    doc.text(`Phone: ${phone}`, 20, 70);
    doc.text(`Number of Travelers: ${numberOfTravelers}`, 20, 80);
    doc.text(`Special Request: ${specialRequest}`, 20, 90);
    doc.text(`Package: ${packageId.title}`, 20, 100);
    doc.text(`Description: ${packageId.description}`, 20, 110);
    doc.text(`Available Dates: ${packageId.availableDates}`, 20, 120);
    doc.text(`Price per Traveler: $${packageId.price}`, 20, 130);
    doc.text(`Total Price: $${totalPrice}`, 20, 140);
    doc.text(`Booking Date: ${new Date(bookingDate).toLocaleString()}`, 20, 150);

    doc.save(`booking_invoice_${bookingId}.pdf`);
  };

  if (loading) {
    return <LoadingSpinner/>;
  }

  if (!bookingDetails) {
    return (
      <div className="text-center mt-20 text-red-500 text-xl">
        Booking not found!
      </div>
    );
  }

  const {
    name,
    email,
    phone,
    numberOfTravelers,
    specialRequest,
    packageId,
    totalPrice,
    bookingDate,
  } = bookingDetails;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-green-600 mb-4 text-center">
        Booking Successful!
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Thank you for booking with us. Your booking details are as follows:
      </p>

      {/* Booking Details */}
      <div className="space-y-4 text-gray-700">
        <div>
          <span className="font-semibold">Booking ID:</span> {bookingId}
        </div>
        <div>
          <span className="font-semibold">Name:</span> {name}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {email}
        </div>
        <div>
          <span className="font-semibold">Phone:</span> {phone}
        </div>
        <div>
          <span className="font-semibold">Number of Travelers:</span>{" "}
          {numberOfTravelers}
        </div>
        <div>
          <span className="font-semibold">Special Request:</span>{" "}
          {specialRequest || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Package:</span> {packageId.title}
        </div>
        <div>
          <span className="font-semibold">Description:</span>{" "}
          {packageId.description}
        </div>
        <div>
          <span className="font-semibold">Available Dates:</span>{" "}
          {packageId.availableDates}
        </div>
        <div>
          <span className="font-semibold">Price per Traveler:</span> $
          {packageId.price}
        </div>
        <div>
          <span className="font-semibold">Total Price:</span> ${totalPrice}
        </div>
        <div>
          <span className="font-semibold">Booking Date:</span>{" "}
          {new Date(bookingDate).toLocaleString()}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => window.print()}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Print Invoice
        </button>
        <button
          onClick={generatePDF}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default BookingSuccess;
