import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";

function Aapp() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("https://randomuser.me/api/?page=1&results=1&seed=abc")
      .then((response) => {
        setUser(response.data.results[0]);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black min-h-screen flex justify-center items-center p-4">
    {user ? <Card user={user} /> : <p className="text-white">Loading...</p>}
  </div>
  );
}

export default Aapp;
