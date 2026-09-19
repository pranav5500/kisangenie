import express from 'express';
import Device from '../models/Device.js';
import SoilReading from '../models/SoilReading.js';
import Field from '../models/Field.js';
import { validateSensorData, analyzeSoil, generateAlertsIfNeeded } from '../services/soilAnalysisService.js';

const router = express.Router();

// Register a new device (Admin/Farmer)
router.post('/devices/register', async (req, res) => {
  try {
    const { deviceId, deviceKey, userId, name } = req.body;
    
    // In a real app, only authenticated users can do this.
    const device = new Device({
      deviceId,
      deviceKey, // this should be hashed in production
      user: userId,
      name,
    });
    
    await device.save();
    res.status(201).json({ success: true, device });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Pair device to field
router.post('/devices/pair', async (req, res) => {
  try {
    const { deviceId, fieldId } = req.body;
    const device = await Device.findOne({ deviceId });
    if (!device) return res.status(404).json({ success: false, message: 'Device not found' });
    
    device.field = fieldId;
    device.status = 'ONLINE';
    await device.save();
    
    res.json({ success: true, message: 'Device paired successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Receive Telemetry from ESP32
router.post('/readings', async (req, res) => {
  try {
    const { deviceId, timestamp, readings } = req.body;
    const deviceKey = req.headers['x-device-key'];

    const device = await Device.findOne({ deviceId });
    
    if (!device || device.deviceKey !== deviceKey) {
      return res.status(401).json({ success: false, message: 'Unauthorized device' });
    }

    if (!device.field) {
       return res.status(400).json({ success: false, message: 'Device not assigned to a field' });
    }

    // Validate sensor bounds
    const dataQuality = validateSensorData(readings);
    
    // Save reading
    const soilReading = new SoilReading({
      user: device.user,
      field: device.field,
      device: device._id,
      timestamp: timestamp || new Date(),
      soilMoisture: readings.soilMoisture,
      soilTemperature: readings.soilTemperature,
      ph: readings.ph,
      nitrogen: readings.nitrogen,
      phosphorus: readings.phosphorus,
      potassium: readings.potassium,
      ec: readings.ec,
      dataQuality,
      rawData: req.body
    });

    await soilReading.save();

    // Update Device status
    device.lastSeen = new Date();
    device.status = 'ONLINE';
    await device.save();

    if (dataQuality === 'VALID') {
      // Analyze data
      const field = await Field.findById(device.field);
      const cropName = field.currentCrop;
      
      const previousAnalysis = field.latestSoilStatus;
      
      const { analysis, healthScore, overallStatus } = analyzeSoil(readings, cropName);
      
      field.latestSoilStatus = {
        healthScore,
        lastUpdated: new Date(),
        moisture: readings.soilMoisture,
        temperature: readings.soilTemperature,
        ph: readings.ph,
        nitrogen: readings.nitrogen,
        phosphorus: readings.phosphorus,
        potassium: readings.potassium,
        ec: readings.ec,
        status: overallStatus
      };
      
      await field.save();

      // Trigger alerts if needed
      await generateAlertsIfNeeded(field._id, device.user, device._id, analysis, previousAnalysis);
    }

    res.status(201).json({ success: true, message: 'Data accepted' });
  } catch (error) {
    console.error('Error processing reading:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get latest reading for a field (Polling endpoint for dashboard)
router.get('/fields/:fieldId/latest', async (req, res) => {
  try {
    const field = await Field.findById(req.params.fieldId);
    if (!field) return res.status(404).json({ success: false, message: 'Field not found' });
    
    res.json({ success: true, data: field.latestSoilStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get history
router.get('/fields/:fieldId/readings', async (req, res) => {
  try {
    const readings = await SoilReading.find({ field: req.params.fieldId })
      .sort({ timestamp: -1 })
      .limit(100);
      
    res.json({ success: true, data: readings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all devices for a user
router.get('/devices', async (req, res) => {
  try {
    const devices = await Device.find().populate('field'); // In a real app, filter by req.user._id
    res.json({ success: true, data: devices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all fields
router.get('/fields', async (req, res) => {
  try {
    const fields = await Field.find(); // In a real app, filter by req.user._id
    res.json({ success: true, data: fields });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new field
router.post('/fields', async (req, res) => {
  try {
    const { fieldName, area, soilType, currentCrop } = req.body;
    const field = new Field({
      user: req.body.userId || '60d0fe4f5311236168a109ca', // Hardcoded fallback for testing
      fieldName, area, soilType, currentCrop
    });
    await field.save();
    res.status(201).json({ success: true, data: field });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a field
router.delete('/fields/:id', async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);
    if (!field) return res.status(404).json({ success: false, message: 'Field not found' });
    await Field.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Field deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a device
router.delete('/devices/:id', async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ success: false, message: 'Device not found' });
    await Device.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Device deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
