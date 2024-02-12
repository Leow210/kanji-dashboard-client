import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [user, setUser] = useState(null); // Add state for user

  useEffect(() => {
    const fetchUser = async () => {
      if (authToken) {
        try {
          const response = await fetch('http://localhost:8000/api/userinfo/', {
            headers: {
              'Authorization': `Token ${authToken}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData); // Set user data
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
    };

    fetchUser();
  }, [authToken]); // Re-fetch user info when authToken changes

  const login = (token) => {
    localStorage.setItem('authToken', token); // Save token in localStorage
    setAuthToken(token); // Update state
  };

  const logout = () => {
    localStorage.removeItem('authToken'); // Remove token from localStorage
    setAuthToken(null); // Update state
    setUser(null); // Clear user data
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
