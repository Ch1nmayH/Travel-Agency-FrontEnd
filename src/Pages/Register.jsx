import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import wallpaper from "../Assets/formBg.png";
import {toast} from "react-toastify";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Individual error states
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [cpasswordError, setCPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  // Validation functions
  const validateFirstName = () => {
    if (!firstName) return "First name is required";
    return "";
  };

  const validateLastName = () => {
    if (!lastName) return "Last name is required";
    return "";
  };

  const validateEmail = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  };

  const validatePassword = () => {
    if (!password) return "Password is required";
    if (password.length < 6)
      return "Password must be at least 6 characters long";
    return "";
  };

  const validateCPassword = () => {
    if (cpassword !== password) return "Passwords do not match";
    return "";
  };
  // Handle submit with field validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Update error states individually
    const firstNameValidation = validateFirstName();
    const lastNameValidation = validateLastName();
    const emailValidation = validateEmail();
    const passwordValidation = validatePassword();
    const cpasswordValidation = validateCPassword();

    setFirstNameError(firstNameValidation);
    setLastNameError(lastNameValidation);
    setEmailError(emailValidation);
    setPasswordError(passwordValidation);
    setCPasswordError(cpasswordValidation);

    // Check if there are any errors
    if (
      firstNameValidation ||
      lastNameValidation ||
      emailValidation ||
      passwordValidation ||
      cpasswordValidation
    ) {
      return; // Exit if there are validation errors
    }

    try {
      // Backend request using Axios
      const response = await axios.post(
        `${API_BASE_URL}/api/user/signup`,
        {
          name: firstName + " " + lastName,
          email,
          password,
        }
      );

      if (response.status === 200 && response.data.error === "User already exists with this email") {
        setEmailError("Email already exists");
      } 
      else if (response.status === 201) {
        toast.success("User registered successfully. Redirecting to login page...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) { 
      setServerError("Error registering user. Please try again.");
    }
  };

 
  return (
    <div
      className="flex flex-col justify-center items-center min-h-[calc(100vh-120px)] bg-cover bg-center"
      style={{
        backgroundImage: `url(${wallpaper})`,
      }}
    >
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg mt-7 md:mt-20 mb-10">
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
        {serverError && <p className="text-red-500 text-center mb-4">{serverError}</p>}
        <form className="flex flex-col" onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="fname">First Name</label>
            <input
              type="text"
              id="fname"
              name="fname"
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => setFirstName(e.target.value)}
            />
            {firstNameError && <p className="text-red-500 text-sm">{firstNameError}</p>}
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="lname">Last Name</label>
            <input
              type="text"
              id="lname"
              name="lname"
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => setLastName(e.target.value)}
            />
            {lastNameError && <p className="text-red-500 text-sm">{lastNameError}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="cpassword">Confirm Password</label>
            <input
              type="password"
              id="cpassword"
              name="cpassword"
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => setCPassword(e.target.value)}
            />
            {cpasswordError && <p className="text-red-500 text-sm">{cpasswordError}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white font-semibold rounded-md"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          <Link to="/" className="text-gray-600 hover:underline">Go back to Homepage?</Link>
        </p>
        <p className="text-center mt-4 text-sm">
          Already have an account? <Link to="/login" className="font-semibold text-indigo-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register