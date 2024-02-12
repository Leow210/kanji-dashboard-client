import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { authToken } = useAuth(); // Use authToken or a similar flag that indicates authentication
  return authToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;