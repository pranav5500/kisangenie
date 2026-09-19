import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaLeaf, FaTractor, FaPlus, FaThermometerHalf, FaTint, FaFlask, FaSpinner, FaTrash } from 'react-icons/fa';

const FieldsDashboard = () => {
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isAddingField, setIsAddingField] = useState(false);
  const [newField, setNewField] = useState({ fieldName: '', area: '', soilType: 'Loamy', currentCrop: 'Tomato' });

  const fetchFields = async () => {
    try {
      const res = await api.get('/iot/fields');
      setFields(res.data.data);
      if (res.data.data.length > 0 && !selectedField) {
        setSelectedField(res.data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  };

  const fetchSoilData = async (fieldId) => {
    try {
      const res = await api.get(`/iot/fields/${fieldId}/latest`);
      setSoilData(res.data.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching soil data:', error);
    }
  };

  const handleAddField = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/iot/fields', newField);
      setFields([...fields, res.data.data]);
      setIsAddingField(false);
      setNewField({ fieldName: '', area: '', soilType: 'Loamy', currentCrop: 'Tomato' });
    } catch (error) {
      console.error('Error adding field:', error);
      alert('Failed to add field');
    }
  };

  const handleDeleteField = async (id) => {
    if (!window.confirm('Are you sure you want to delete this field?')) return;
    try {
      await api.delete(`/iot/fields/${id}`);
      setFields(fields.filter(f => f._id !== id));
      if (selectedField?._id === id) {
        setSelectedField(null);
        setSoilData(null);
      }
    } catch (error) {
      console.error('Error deleting field:', error);
      alert('Failed to delete field');
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  useEffect(() => {
    let interval;
    if (selectedField) {
      setLoading(true);
      fetchSoilData(selectedField._id).finally(() => setLoading(false));
      
      // Polling every 30 seconds
      interval = setInterval(() => {
        fetchSoilData(selectedField._id);
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [selectedField]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'GOOD': return 'text-green-600 bg-green-100 border-green-200';
      case 'WARNING': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'CRITICAL': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getOverallHealthColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-600';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaTractor className="text-emerald-600" /> My Fields
          </h1>
          <p className="text-gray-600 mt-2">Real-time Soil Monitoring & AI Recommendations</p>
        </div>
        <button onClick={() => setIsAddingField(true)} className="btn-primary flex items-center gap-2">
          <FaPlus /> Add Field
        </button>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
        {fields.map(field => (
          <button 
            key={field._id}
            onClick={() => setSelectedField(field)}
            className={`px-6 py-4 rounded-xl border-2 transition-all whitespace-nowrap flex flex-col items-start ${selectedField?._id === field._id ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-gray-200 hover:border-emerald-300 bg-white'}`}
          >
            <span className="font-semibold text-lg text-gray-800">{field.fieldName}</span>
            <span className="text-sm text-gray-500">{field.currentCrop} • {field.area} Acres</span>
          </button>
        ))}
      </div>

      {selectedField && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-6 border-b pb-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-800">{selectedField.fieldName}</h2>
                <button onClick={() => handleDeleteField(selectedField._id)} className="text-red-400 hover:text-red-600 p-1 bg-red-50 hover:bg-red-100 rounded transition-colors text-sm" title="Delete Field">
                  <FaTrash />
                </button>
              </div>
              <p className="text-gray-500 flex items-center gap-2 mt-1">
                Sensor: <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> ONLINE</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Soil Health Score</div>
              <div className={`text-4xl font-black ${getOverallHealthColor(soilData?.healthScore || 0)}`}>
                {soilData ? `${soilData.healthScore}/100` : '--/100'}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
             <div className="text-sm text-gray-500">
               Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : '...'}
             </div>
             {loading && <FaSpinner className="animate-spin text-emerald-500" />}
          </div>

          {soilData ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {/* Parameter Cards */}
               <div className="p-4 rounded-xl border bg-gray-50 flex flex-col">
                 <div className="text-gray-500 text-sm font-medium mb-2 flex items-center gap-2"><FaTint className="text-blue-500"/> Moisture</div>
                 <div className="text-2xl font-bold text-gray-800 mb-2">{soilData.moisture}%</div>
                 {/* In a real app, get status from analysis, here we mock standard logic temporarily until API provides status per param */}
                 <div className="text-xs font-semibold px-2 py-1 rounded-full w-max text-blue-700 bg-blue-100">MONITORING</div>
               </div>
               
               <div className="p-4 rounded-xl border bg-gray-50 flex flex-col">
                 <div className="text-gray-500 text-sm font-medium mb-2 flex items-center gap-2"><FaThermometerHalf className="text-orange-500"/> Temperature</div>
                 <div className="text-2xl font-bold text-gray-800 mb-2">{soilData.temperature}°C</div>
               </div>

               <div className="p-4 rounded-xl border bg-gray-50 flex flex-col">
                 <div className="text-gray-500 text-sm font-medium mb-2 flex items-center gap-2"><FaFlask className="text-purple-500"/> pH Level</div>
                 <div className="text-2xl font-bold text-gray-800 mb-2">{soilData.ph}</div>
               </div>
               
               <div className="p-4 rounded-xl border bg-gray-50 flex flex-col">
                 <div className="text-gray-500 text-sm font-medium mb-2 flex items-center gap-2">Nitrogen (N)</div>
                 <div className="text-2xl font-bold text-gray-800 mb-2">{soilData.nitrogen} <span className="text-sm font-normal text-gray-500">mg/kg</span></div>
               </div>

               <div className="p-4 rounded-xl border bg-gray-50 flex flex-col">
                 <div className="text-gray-500 text-sm font-medium mb-2 flex items-center gap-2">Phosphorus (P)</div>
                 <div className="text-2xl font-bold text-gray-800 mb-2">{soilData.phosphorus} <span className="text-sm font-normal text-gray-500">mg/kg</span></div>
               </div>

               <div className="p-4 rounded-xl border bg-gray-50 flex flex-col">
                 <div className="text-gray-500 text-sm font-medium mb-2 flex items-center gap-2">Potassium (K)</div>
                 <div className="text-2xl font-bold text-gray-800 mb-2">{soilData.potassium} <span className="text-sm font-normal text-gray-500">mg/kg</span></div>
               </div>
               
               <div className="p-4 rounded-xl border bg-gray-50 flex flex-col col-span-2 md:col-span-2">
                 <div className="text-gray-500 text-sm font-medium mb-2">Automated AI Insight</div>
                 <p className="text-gray-700 italic">"Soil condition is {soilData.status.toLowerCase()}. Keep monitoring the parameters to maintain optimal growth for {selectedField.currentCrop}."</p>
                 <button className="mt-3 text-emerald-600 font-medium text-sm hover:underline text-left">Request Full AI Analysis &rarr;</button>
               </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No sensor data available yet for this field. Ensure your ESP32 device is online and paired.
            </div>
          )}
        </div>
      )}

      {/* Add Field Modal */}
      {isAddingField && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Field</h2>
            <form onSubmit={handleAddField} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Field Name</label>
                <input type="text" required className="input-field py-2" value={newField.fieldName} onChange={(e) => setNewField({...newField, fieldName: e.target.value})} placeholder="e.g., North Wheat Field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area (Acres)</label>
                <input type="number" required className="input-field py-2" value={newField.area} onChange={(e) => setNewField({...newField, area: e.target.value})} placeholder="e.g., 5" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Crop</label>
                <input type="text" required className="input-field py-2" value={newField.currentCrop} onChange={(e) => setNewField({...newField, currentCrop: e.target.value})} placeholder="e.g., Tomato" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
                <select className="input-field py-2" value={newField.soilType} onChange={(e) => setNewField({...newField, soilType: e.target.value})}>
                  <option>Loamy</option>
                  <option>Clay</option>
                  <option>Sandy</option>
                  <option>Black</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsAddingField(false)} className="flex-1 btn-secondary py-2">Cancel</button>
                <button type="submit" className="flex-1 btn-primary py-2">Save Field</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldsDashboard;
