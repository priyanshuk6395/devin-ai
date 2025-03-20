import React, { createContext, useState, useContext } from 'react';

// Create the context
export const UserContext = createContext();


// Create the provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data here

  // Function to log in the user
  const login = (userData) => {
    setUser(userData);
  };

  // Function to log out the user
  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user,setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};