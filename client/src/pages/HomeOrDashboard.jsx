import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Home from './Home';
import UnifiedDashboard from './UnifiedDashboard';

const HomeOrDashboard = () => {
  const { user } = useContext(AuthContext);
  return user ? <UnifiedDashboard /> : <Home />;
};

export default HomeOrDashboard;
