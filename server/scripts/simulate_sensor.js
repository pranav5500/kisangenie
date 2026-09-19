import axios from 'axios';

const API_URL = 'http://localhost:5000/api/iot/readings';
const DEVICE_ID = 'KG-SIMULATOR-001';
const DEVICE_KEY = 'secret-key-123'; // Replace with a real key matching DB

const generateReading = () => {
  return {
    soilMoisture: Math.floor(Math.random() * (80 - 20 + 1) + 20),
    soilTemperature: parseFloat((Math.random() * (35 - 15) + 15).toFixed(1)),
    ph: parseFloat((Math.random() * (8.5 - 5.5) + 5.5).toFixed(1)),
    nitrogen: Math.floor(Math.random() * (100 - 10 + 1) + 10),
    phosphorus: Math.floor(Math.random() * (100 - 10 + 1) + 10),
    potassium: Math.floor(Math.random() * (100 - 10 + 1) + 10),
    ec: parseFloat((Math.random() * (2.5 - 0.5) + 0.5).toFixed(2)),
  };
};

const sendTelemetry = async () => {
  try {
    const payload = {
      deviceId: DEVICE_ID,
      timestamp: new Date().toISOString(),
      readings: generateReading()
    };

    console.log('Sending reading...', payload);

    const response = await axios.post(API_URL, payload, {
      headers: {
        'x-device-key': DEVICE_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error sending telemetry:', error.response ? error.response.data : error.message);
  }
};

// Send a reading every 30 seconds
setInterval(sendTelemetry, 30000);

// Send initial reading immediately
sendTelemetry();
