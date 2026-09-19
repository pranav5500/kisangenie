import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <div className="prose prose-green max-w-none text-gray-600">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">1. Introduction</h2>
        <p className="mb-4">Welcome to KisanGenie. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
        
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">2. Data We Collect</h2>
        <p className="mb-4">We may collect, use, store and transfer different kinds of personal data about you, including:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Identity Data: Name, username.</li>
          <li>Contact Data: Email address, phone number.</li>
          <li>Agricultural Data: Farm location, crop details, soil parameters, and images uploaded for disease detection.</li>
          <li>Technical Data: IP address, browser type and version, time zone setting.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3. How We Use Your Data</h2>
        <p className="mb-4">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>To provide you with AI-driven crop and fertilizer recommendations.</li>
          <li>To analyze plant images for disease detection.</li>
          <li>To manage our relationship with you and improve our platform.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">4. Data Security</h2>
        <p className="mb-4">We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.</p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">5. Contact Us</h2>
        <p className="mb-4">If you have any questions about this privacy policy or our privacy practices, please contact us at support@kisangenie.in.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
