import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserContext } from "../context/user.context";

const UserAuth = ({ children }) => {
  const { setUser } = useContext(UserContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Invalid token");

        const userData = await response.json();
        setUser(userData);

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication failed:", error);
        localStorage.removeItem("token");
        navigate("/landing");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Animated Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl flex flex-col items-center"
        >
          {/* Animated Loader */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
          ></motion.div>

          {/* Glowing Text Animation */}
          <motion.p
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300"
          >
            Authenticating...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

export default UserAuth;
