import React from "react";
import { Phone, Email, LocationOn, Female } from "@mui/icons-material";

const Card = ({ user }) => {
  return (
    <div className="relative p-1 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-border">
    {/* Inner Card */}
    <div className="bg-black rounded-xl p-6 shadow-lg text-white">
      <div className="flex flex-col items-center">
        {/* Profile Image */}
        <img
          src={user.picture.large}
          alt="User"
          className="w-28 h-28 rounded-full border-4 border-purple-500 shadow-lg"
        />
        {/* Name */}
        <h2 className="mt-4 text-2xl font-bold tracking-wider text-white drop-shadow-lg">
          {user.name.first} {user.name.last}
        </h2>
        {/* Gender */}
        <p className="text-sm text-pink-300 flex items-center mt-1">
          <Female className="mr-2 text-pink-500" /> {user.gender.toUpperCase()}
        </p>
        {/* Divider */}
        <div className="w-full border-t border-purple-500 my-4"></div>
        {/* Contact Info */}
        <div className="w-full space-y-3">
          {/* Phone */}
          <div className="flex items-center">
            <Phone className="text-pink-400 mr-3" />
            <p className="text-sm">{user.phone}</p>
          </div>
          {/* Email */}
          <div className="flex items-center">
            <Email className="text-pink-400 mr-3" />
            <p className="text-sm truncate">{user.email}</p>
          </div>
          {/* Location */}
          <div className="flex items-center">
            <LocationOn className="text-pink-400 mr-3" />
            <p className="text-sm">
              {user.location.city}, {user.location.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Card;
