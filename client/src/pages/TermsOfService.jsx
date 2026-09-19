import React from 'react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
      <div className="prose prose-green max-w-none text-gray-600">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">1. Acceptance of Terms</h2>
        <p className="mb-4">By accessing and using KisanGenie, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">2. Description of Service</h2>
        <p className="mb-4">KisanGenie provides AI-powered agricultural recommendations, including crop selection, fertilizer usage, and disease detection. These recommendations are based on algorithms and models and should be used as advisory information only.</p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3. Disclaimer of Warranties</h2>
        <p className="mb-4">The information provided by KisanGenie is for general informational purposes only. While we strive to provide accurate AI analysis, agriculture is subject to numerous unpredictable factors (weather, pests, market conditions). Therefore, KisanGenie makes no guarantees regarding crop yields or absolute accuracy of disease diagnosis. Users should exercise their own judgment and consult local agricultural experts when necessary.</p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">4. User Responsibilities</h2>
        <p className="mb-4">Users are responsible for providing accurate farm and soil data. Incorrect inputs will lead to inaccurate AI recommendations.</p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">5. Intellectual Property</h2>
        <p className="mb-4">All content, features, and functionality of the KisanGenie platform are owned by KisanGenie Technologies Pvt Ltd and are protected by international copyright, trademark, and other intellectual property laws.</p>
      </div>
    </div>
  );
};

export default TermsOfService;
