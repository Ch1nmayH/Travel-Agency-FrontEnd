import React, { use, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import wallpaper from "../Assets/formBg.png";
import UserContext from "../utils/CreateContext";
import { toast } from "react-toastify";

const Book = () => {
  const { token, setToken } = useContext(UserContext);
  const navigate = useNavigate();
  const packageId = useParams().packageId;
  const [packageData, setPackageData] = useState({});

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [numberOfTravellers, setNumberOfTravellers] = useState(1);
  const [specialRequest, setSpecialRequest] = useState("");
  const [totalPrice, setTotalPrice] = useState("");

  // Individual error states
  const [fullNameError, setFirstNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [numberOfTravellersError, setNumberOfTravellersError] = useState("");
  const [specialRequestError, setSpecialRequestError] = useState("");
  const [serverError, setServerError] = useState("");

  // Validation functions
  const validateFullName = () => {
    if (!fullName) return "Full name is required";
    return "";
  };

  const validateEmail = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  };

  const validateNumberOfTravellers = () => {
    if (!numberOfTravellers) return "Number of Travellers Field is required";
    if (numberOfTravellers.length < 1)
      return "Number Of Travellers must be at least 1";
    return "";
  };

  const ValidateMobileNumber = () => {
    if (!mobile) return "Mobile Number is required";
    if (mobile.length < 10) return "Enter A valid Mobile Number ( 10 digits )";
    return "";
  };

  // Handle submit with field validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Update error states individually
    const fullNameValidation = validateFullName();
    const emailValidation = validateEmail();
    const mobileValidation = ValidateMobileNumber();
    const numberOfTravellersValidation = validateNumberOfTravellers();

    setFirstNameError(fullNameValidation);
    setEmailError(emailValidation);
    setMobileError(mobileValidation);
    setNumberOfTravellersError(numberOfTravellersValidation);

    // Check if there are any errors
    if (
      fullNameValidation ||
      emailValidation ||
      mobileValidation ||
      numberOfTravellersValidation
    ) {
      return; // Exit if there are validation errors
    }

    try {
      // Backend request using Axios
      const valiDateUser = await axios.post(
        `${API_BASE_URL}/api/user/validateUser`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(valiDateUser);

      if (
        valiDateUser.status === 200 &&
        valiDateUser.data.error === "User not found"
      ) {
        navigate("/login");
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/api/bookings`,
          {
            name: fullName,
            email: email,
            phone: mobile,
            numberOfTravelers: numberOfTravellers,
            specialRequest: specialRequest,
            user: valiDateUser.data._id,
            bookingDate: new Date().toISOString(),
            packageId: packageId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response.data);
        toast.success("Booking Successful.");
        if (response.status === 201) {
          setTimeout(() => {
            navigate(`/bookingSuccess/${response.data._id}`);
          }, 2000);
        } else {
          setServerError(
            "Due to unforseen circumstances, booking failed. Please try again."
          );
        }
      }
    } catch (error) {
      setServerError(
        "Due to unforseen circumstances, booking failed. Please try again."
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          navigate("/unauthenticated");
        }
        const response = await axios.get(
          `${API_BASE_URL}/api/packages/${packageId}`
        );
        setPackageData(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [packageId]);

  return (
    <div
      className="flex flex-col justify-center items-center min-h-[calc(100vh-120px)] bg-cover bg-center"
      style={{
        backgroundImage: `url(${wallpaper})`,
      }}
    >
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg mt-7 md:mt-20 mb-10">
        <h2 className="text-2xl font-semibold text-center mb-6">Book Now</h2>
        {serverError && (
          <p className="text-red-500 text-center mb-4">{serverError}</p>
        )}
        <form className="flex flex-col" onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="fname">
              Full Name
            </label>
            <input
              type="text"
              id="fname"
              name="fname"
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => setFullName(e.target.value)}
            />
            {fullNameError && (
              <p className="text-red-500 text-sm">{fullNameError}</p>
            )}
          </div>

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
          {/* Phone Number */}
          <div className="mb-4">
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor="mobile"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="lname"
              name="lname"
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => setMobile(e.target.value)}
            />
            {mobileError && (
              <p className="text-red-500 text-sm">{mobileError}</p>
            )}
          </div>

          {/* numberOfTravelers */}
          <div className="mb-4">
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor="numberOfTravelers"
            >
              Number Of Travelers
            </label>
            <input
              type="number"
              id="numberOfTravelers"
              name="numberOfTravelers"
              className="w-full px-3 py-2 border rounded-md"
              value={numberOfTravellers}
              onChange={(e) => setNumberOfTravellers(e.target.value)}
            />
            {numberOfTravellersError && (
              <p className="text-red-500 text-sm">{numberOfTravellersError}</p>
            )}
          </div>

          {/* specialRequest */}
          <div className="mb-4">
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor="cpassword"
            >
              SpecialRequest
            </label>
            <input
              type="text"
              id="specialRequest"
              name="specialRequest"
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => setSpecialRequest(e.target.value)}
            />
            {specialRequestError && (
              <p className="text-red-500 text-sm">{specialRequestError}</p>
            )}
          </div>

          {/* Package Details */}
          <div className="mb-4">
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor="numberOfTravelers"
            >
              Package Name
            </label>
            <input
              type="text"
              id="packageName"
              name="packageName"
              className="w-full px-3 py-2 border rounded-md"
              readOnly
              value={packageData.title}
            />
          </div>

          {/* Total Price */}
          <div className="mb-4">
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor="numberOfTravelers"
            >
              Total Price
            </label>
            <input
              type="number"
              id="totalPrice"
              name="totalPrice"
              className="w-full px-3 py-2 border rounded-md"
              readOnly
              value={packageData.price * numberOfTravellers}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white font-semibold rounded-md"
          >
            Book Now
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          <Link to="/" className="text-gray-600 hover:underline">
            Go back to Homepage?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Book;
