import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaMicrochip, FaPlus, FaCheckCircle, FaTimesCircle, FaTractor } from 'react-icons/fa';

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPairing, setIsPairing] = useState(false);
  const [newDevice, setNewDevice] = useState({ deviceId: '', deviceKey: '', name: '' });

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await api.get('/iot/devices');
      setDevices(res.data.data);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePairDevice = async (e) => {
    e.preventDefault();
    try {
      // In MVP, we just register it to the current user (hardcoded fallback in backend if user not passed, but we'll pass a mock)
      const res = await api.post('/iot/devices/register', {
        ...newDevice,
        userId: '60d0fe4f5311236168a109ca' // Fallback matching backend testing
      });
      setDevices([...devices, res.data.device]);
      setIsPairing(false);
      setNewDevice({ deviceId: '', deviceKey: '', name: '' });
    } catch (error) {
      console.error('Error pairing device:', error);
      alert('Failed to pair device. It might already exist.');
    }
  };

  const handleDeleteDevice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this device?')) return;
    try {
      await api.delete(`/iot/devices/${id}`);
      setDevices(devices.filter(d => d._id !== id));
    } catch (error) {
      console.error('Error deleting device:', error);
      alert('Failed to delete device');
    }
  };

  const startSimulator = async () => {
    // This is a UI helper to remind the dev to run the simulator script
    alert("To start the simulator, run: node server/scripts/simulate_sensor.js in your terminal.");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaMicrochip className="text-gray-600" /> Device Management
          </h1>
          <p className="text-gray-600 mt-2">Manage your ESP32 soil sensors</p>
        </div>
        <div className="flex gap-3">
          <button onClick={startSimulator} className="btn-secondary py-2 px-4 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors shadow-sm">
            Simulate Data
          </button>
          <button onClick={() => setIsPairing(true)} className="btn-primary flex items-center gap-2 py-2 px-4 rounded-lg shadow-md">
            <FaPlus /> Pair Device
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading devices...</div>
      ) : devices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <FaMicrochip className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Devices Paired</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">You haven't connected any KisanGenie soil sensors yet. Pair your first ESP32 device to start receiving real-time soil data.</p>
          <button onClick={() => setIsPairing(true)} className="btn-primary px-6 py-2">Pair a Device Now</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map(device => (
            <div key={device._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col relative overflow-hidden">
               {device.status === 'ONLINE' && <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>}
               {device.status === 'OFFLINE' && <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>}
               
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <h3 className="font-bold text-lg text-gray-800">{device.name || device.deviceId}</h3>
                   <div className="text-sm text-gray-500 font-mono mt-1">{device.deviceId}</div>
                 </div>
                 {device.status === 'ONLINE' ? (
                   <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                     <FaCheckCircle /> ONLINE
                   </span>
                 ) : (
                   <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                     <FaTimesCircle /> OFFLINE
                   </span>
                 )}
               </div>

               <div className="space-y-3 flex-1">
                 <div className="flex items-center gap-3 text-sm">
                   <div className="w-8 flex justify-center text-gray-400"><FaTractor /></div>
                   <div>
                     <div className="text-gray-500 text-xs uppercase tracking-wider">Assigned Field</div>
                     <div className="font-medium text-gray-800">{device.field?.fieldName || 'Unassigned'}</div>
                   </div>
                 </div>
                 <div className="flex items-center gap-3 text-sm">
                   <div className="w-8 flex justify-center text-gray-400"><FaMicrochip /></div>
                   <div>
                     <div className="text-gray-500 text-xs uppercase tracking-wider">Last Seen</div>
                     <div className="font-medium text-gray-800">{device.lastSeen ? new Date(device.lastSeen).toLocaleString() : 'Never'}</div>
                   </div>
                 </div>
               </div>
               
               <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
                 <button className="flex-1 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">Configure</button>
                 <button onClick={() => handleDeleteDevice(device._id)} className="flex-1 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors">Unpair</button>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Pair Device Modal */}
      {isPairing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Pair New Device</h2>
            <form onSubmit={handlePairDevice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device Name</label>
                <input type="text" required className="input-field py-2" value={newDevice.name} onChange={(e) => setNewDevice({...newDevice, name: e.target.value})} placeholder="e.g., ESP32 Sensor #1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device ID</label>
                <input type="text" required className="input-field py-2 font-mono text-sm" value={newDevice.deviceId} onChange={(e) => setNewDevice({...newDevice, deviceId: e.target.value})} placeholder="e.g., KG-SIMULATOR-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                <input type="password" required className="input-field py-2" value={newDevice.deviceKey} onChange={(e) => setNewDevice({...newDevice, deviceKey: e.target.value})} placeholder="Enter the secret key" />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsPairing(false)} className="flex-1 btn-secondary py-2">Cancel</button>
                <button type="submit" className="flex-1 btn-primary py-2">Pair Device</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;
