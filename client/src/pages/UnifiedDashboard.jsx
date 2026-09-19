import React, { useState } from 'react';
import { FaHome, FaCommentDots, FaLeaf, FaSeedling, FaHistory, FaCog, FaTractor, FaMicrochip } from 'react-icons/fa';

import Dashboard from './Dashboard';
import FieldsDashboard from './FieldsDashboard';
import DeviceManagement from './DeviceManagement';
import Chat from './Chat';
import DiseaseDetection from './DiseaseDetection';
import CropRecommendation from './CropRecommendation';
import FertilizerRecommendation from './FertilizerRecommendation';
import History from './History';

const UnifiedDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const tabs = [
    { name: 'Dashboard', icon: <FaHome />, component: <Dashboard setActiveTab={setActiveTab} /> },
    { name: 'Soil Monitoring', icon: <FaTractor className="text-emerald-600" />, component: <FieldsDashboard /> },
    { name: 'Devices', icon: <FaMicrochip className="text-gray-600" />, component: <DeviceManagement /> },
    { name: 'AI Chatbot', icon: <FaCommentDots />, component: <Chat /> },
    { name: 'Disease Detection', icon: <FaLeaf />, component: <DiseaseDetection /> },
    { name: 'Crop Recommender', icon: <FaSeedling />, component: <CropRecommendation /> },
    { name: 'Fertilizer Advisor', icon: <FaSeedling className="text-yellow-600" />, component: <FertilizerRecommendation /> },
    { name: 'History', icon: <FaHistory />, component: <History /> }
  ];

  const renderContent = () => {
    const tab = tabs.find(t => t.name === activeTab);
    return tab ? tab.component : <Dashboard />;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar / Tab Menu */}
      <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col shrink-0 md:h-full md:overflow-y-auto">
        <div className="flex md:block overflow-x-auto p-4 space-x-2 md:space-x-0 md:space-y-2 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 rounded-xl transition-colors font-medium whitespace-nowrap w-full text-left ${
                activeTab === tab.name
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default UnifiedDashboard;
