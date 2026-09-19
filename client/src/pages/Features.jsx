import React from 'react';
import { FaRobot, FaLeaf, FaSeedling, FaCloudSun, FaFlask, FaMapMarkedAlt } from 'react-icons/fa';

const Features = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">KisanGenie Ecosystem</h2>
          <p className="mt-2 text-4xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Detailed Features Overview
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Explore how our AI-driven tools can revolutionize your farm management and increase your yields.
          </p>
        </div>

        <div className="mt-20 space-y-24">
          
          {/* Feature 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-2xl mb-6">
                <FaRobot className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">KisanGenie AI Chatbot</h3>
              <p className="text-lg text-gray-600 mb-6">
                Speak or type directly to our advanced AI, trained on vast agricultural datasets. It understands complex scenarios, localized farming practices, and provides instant advice on everything from pest control to irrigation strategies.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Voice & Text Input Support</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Context-Aware Responses</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Saved Chat History</li>
              </ul>
            </div>
            <div className="lg:w-1/2 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex gap-4">
                <FaRobot className="h-8 w-8 text-green-600 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">KisanGenie AI</p>
                  <p className="text-sm text-gray-600 mt-1">To protect your wheat crop from stem rust, I recommend applying a fungicide containing Tebuconazole. Ensure you apply it early in the morning when the wind is calm.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-2xl mb-6">
                <FaLeaf className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Vision AI Disease Detection</h3>
              <p className="text-lg text-gray-600 mb-6">
                Don't guess what's wrong with your plants. Simply upload a picture of a diseased leaf. Our Vision AI scans the anomalies, cross-references thousands of pathogens, and delivers a highly accurate diagnosis.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Identifies exact disease and confidence level</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Provides both Organic & Chemical Treatments</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Estimates recovery time</li>
              </ul>
            </div>
            <div className="lg:w-1/2 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
              <div className="border-4 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center">
                <FaLeaf className="text-6xl text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">Upload Leaf Image</p>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center justify-center p-4 bg-yellow-100 rounded-2xl mb-6">
                <FaSeedling className="h-10 w-10 text-yellow-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Precision Recommendations</h3>
              <p className="text-lg text-gray-600 mb-6">
                Maximize your yield and minimize costs. Input your soil NPK levels, pH, and local weather data. Our algorithms will recommend the absolute best crop to plant and the exact fertilizer blend required.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-yellow-500 rounded-full"></span> Smart Crop Selection</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-yellow-500 rounded-full"></span> Custom Fertilizer Planning</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-yellow-500 rounded-full"></span> Exportable PDF Reports</li>
              </ul>
            </div>
            <div className="lg:w-1/2 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <FaCloudSun className="text-2xl text-blue-500 mb-2" />
                  <p className="text-sm font-semibold">Climate Analysis</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <FaFlask className="text-2xl text-purple-500 mb-2" />
                  <p className="text-sm font-semibold">Soil NPK Data</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <FaMapMarkedAlt className="text-2xl text-red-500 mb-2" />
                  <p className="text-sm font-semibold">Location Based</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <FaSeedling className="text-2xl text-green-500 mb-2" />
                  <p className="text-sm font-semibold">Yield Prediction</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Features;
