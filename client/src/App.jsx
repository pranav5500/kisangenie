import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import Home from './pages/Home';
import Features from './pages/Features';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import DashboardLayout from './layouts/DashboardLayout';
import Chat from './pages/Chat';
import DiseaseDetection from './pages/DiseaseDetection';
import CropRecommendation from './pages/CropRecommendation';
import FertilizerRecommendation from './pages/FertilizerRecommendation';
import History from './pages/History';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import FieldsDashboard from './pages/FieldsDashboard';
import DeviceManagement from './pages/DeviceManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 font-['Inter']">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/refund-policy" element={<TermsOfService />} /> {/* Placeholder */}
              <Route path="/cookie-policy" element={<PrivacyPolicy />} /> {/* Placeholder */}
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/fields" element={<FieldsDashboard />} />
                <Route path="/devices" element={<DeviceManagement />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/disease" element={<DiseaseDetection />} />
                <Route path="/crop" element={<CropRecommendation />} />
                <Route path="/fertilizer" element={<FertilizerRecommendation />} />
                <Route path="/history" element={<History />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
