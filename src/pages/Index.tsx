
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to login page by default
  return <Navigate to="/login" replace />;
};

export default Index;
