import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
    },
    deviceKey: {
      type: String, // Hashed secret key for device authentication
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    field: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Field',
    },
    name: String, // User-friendly name e.g., "Tomato Field Sensor 1"
    status: {
      type: String,
      enum: ['ONLINE', 'OFFLINE', 'ERROR', 'INACTIVE'],
      default: 'INACTIVE',
    },
    firmwareVersion: String,
    lastSeen: Date,
    sensors: [{
      type: String,
      enum: ['MOISTURE', 'TEMPERATURE', 'PH', 'NPK', 'EC'],
    }],
    calibrationStatus: {
      type: String,
      enum: ['PENDING', 'CALIBRATED', 'NEEDS_CALIBRATION'],
      default: 'PENDING'
    }
  },
  {
    timestamps: true,
  }
);

const Device = mongoose.model('Device', deviceSchema);
export default Device;
