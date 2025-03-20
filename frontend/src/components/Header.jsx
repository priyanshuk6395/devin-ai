import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios"
const Header = ({ projectName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.get('/users/logout')
    navigate("/landing");
  };

  return (
    <header className="fixed top-0 w-full bg-white dark:bg-gray-800 shadow-sm z-40">
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        {/* Logo and Home Link */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img src="/images/logo.jpg" alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-gray-800 dark:text-white">
            DevinAi
          </span>
        </Link>

        {/* Project Name and Logout Button */}
        <div className="flex items-center gap-6">
          {projectName && (
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              {projectName}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
          >
            <i className="ri-logout-box-r-line"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;