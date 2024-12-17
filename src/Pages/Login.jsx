import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import wallpaper from "../Assets/formBg.png";
import Cookies from "js-cookie";
import UserContext from "../utils/CreateContext";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { token, setToken } = useContext(UserContext);

  // Error states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  //API base URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, []);

  // Validation functions
  const validateEmail = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  };

  const validatePassword = () => {
    if (!password) return "Password is required";
    return "";
  };

  // Handle form submit with validation and backend request
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const emailValidation = validateEmail();
    const passwordValidation = validatePassword();

    // Set error states
    setEmailError(emailValidation);
    setPasswordError(passwordValidation);

    // Exit if there are validation errors
    if (emailValidation || passwordValidation) return;

    try {
      // Send login request to the backend
      const response = await axios.post(
        `${API_BASE_URL}/api/user/signin`,
        {
          email,
          password,
          
        },{
          withCredentials: true
        }
      );

      if (response.status === 200) {
        if (response.data.message === "User not found") {
          setEmailError("User not found");
        }
        if (response.data.message === "Invalid password") {
          setPasswordError("Invalid password");
        }
      }
      if (response.status === 201) {
        Cookies.set("token", response.data.token, { expires: 1 });
        setToken(response.data.token);

        if (response.data.isAdmin) {
          toast.success("Logged in as Admin.");
          setTimeout(() => {
            navigate("/admin");
          }, 2000);
        } else {
          toast.success("Logged in successfully.");
          setTimeout(() =>
          navigate("/"), 2000);
        }
      } 
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setPasswordError("Invalid password");
      } else if (error.response && error.response.status === 404) {
        setEmailError("User not found");
      } else {
        setServerError("Error logging in. Please try again.");
      }
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
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        {serverError && (
          <p className="text-red-500 text-center mb-4">{serverError}</p>
        )}
        <form className="flex flex-col" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="email">
              Email
            </label>
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
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
        <div className="flex justify-between items-center mt-4 text-sm">
          <Link to="/" className="text-gray-600 hover:underline">
            Back
          </Link>
        </div>
        <p className="text-center mt-6 text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
