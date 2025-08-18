import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

const RouteProvider = ({ children }) => {
  return (
    <Router>
      {children}
    </Router>
  );
};

export default RouteProvider;
