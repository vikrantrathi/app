import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  // If loading, show a loading message or spinner.
  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is not logged in, redirect them to the login page.
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If a role is specified and the user's role does not match, redirect to the appropriate page.
  if (role && user.role !== role) {
    return <Navigate to={`/${user.role}`} />;
  }

  // If everything is okay, render the children components (the protected content).
  return children;
};

export default ProtectedRoute;
