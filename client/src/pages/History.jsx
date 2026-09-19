import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaHistory, FaLeaf, FaSeedling, FaFlask, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const History = () => {
  const [activeTab, setActiveTab] = useState('disease');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoryData();
  }, [activeTab]);

  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      const { data: resData } = await api.get(`/${activeTab}/history`);
      setData(resData);
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/${activeTab}/${id}`);
      setData(data.filter(item => item._id !== id));
      toast.success('Record deleted');
    } catch (error) {
      toast.error('Failed to delete record');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <FaHistory className="text-3xl text-gray-800" />
        <h1 className="text-3xl font-bold text-gray-800">Your Farming History</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 mb-8">
        {[
          { id: 'disease', label: 'Disease Checks', icon: <FaLeaf /> },
          { id: 'crop', label: 'Crop Recommendations', icon: <FaSeedling /> },
          { id: 'fertilizer', label: 'Fertilizer Plans', icon: <FaFlask /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-green-600 text-green-700 bg-green-50/50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            No records found for {activeTab}.
          </div>
        ) : (
          data.map((item) => (
            <div key={item._id} className="glass-card p-5 flex justify-between items-start hover:shadow-lg transition-shadow">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    {activeTab === 'disease' && (item.plantName ? `${item.plantName} - ${item.diseaseName}` : item.diseaseName)}
                    {activeTab === 'crop' && item.recommendedCrop}
                    {activeTab === 'fertilizer' && item.recommendedFertilizer}
                  </h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
                
                {activeTab === 'disease' && (
                  <p className="text-sm text-gray-600 max-w-3xl">Treatment: {item.organicTreatment}</p>
                )}
                {activeTab === 'crop' && (
                  <p className="text-sm text-gray-600 max-w-3xl">Expected Yield: {item.expectedYield} | Profit: {item.estimatedProfit}</p>
                )}
                {activeTab === 'fertilizer' && (
                  <p className="text-sm text-gray-600 max-w-3xl">Quantity: {item.quantity} | Cost: {item.estimatedCost}</p>
                )}
              </div>
              
              <button 
                onClick={() => handleDelete(item._id)}
                className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                title="Delete Record"
              >
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
