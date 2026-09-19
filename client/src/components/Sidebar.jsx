import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaCommentDots, FaLeaf, FaSeedling, FaHistory, FaCog, FaTractor, FaMicrochip } from 'react-icons/fa';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
    { name: 'Soil Monitoring', path: '/fields', icon: <FaTractor className="text-emerald-600" /> },
    { name: 'Devices', path: '/devices', icon: <FaMicrochip className="text-gray-600" /> },
    { name: 'AI Chatbot', path: '/chat', icon: <FaCommentDots /> },
    { name: 'Disease Detection', path: '/disease', icon: <FaLeaf /> },
    { name: 'Crop Recommender', path: '/crop', icon: <FaSeedling /> },
    { name: 'Fertilizer Advisor', path: '/fertilizer', icon: <FaSeedling className="text-yellow-600" /> },
    { name: 'History', path: '/history', icon: <FaHistory /> },
    { name: 'Settings', path: '/settings', icon: <FaCog /> },
  ];

  return (
    <div className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col shrink-0 h-full overflow-y-auto">
      <div className="flex-col p-4 space-y-2 no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium whitespace-nowrap ${
                isActive
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
