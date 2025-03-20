import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import Landing from "../Pages/Landing";
import Project from "../Pages/Project";
import UserAuth from "../auth/UserAuth"; // Import UserAuth wrapper

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserAuth>
              <Home/>
            </UserAuth>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/landing" element={<Landing />} />

        {/* Protecting the Project route */}
        <Route
          path="/project"
          element={
            <UserAuth>
              <Project />
            </UserAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
