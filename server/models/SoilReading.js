import mongoose from 'mongoose';

const soilReadingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    field: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Field',
      required: true,
    },
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true, // For time-series queries
    },
    soilMoisture: Number,
    soilTemperature: Number,
    ph: Number,
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
    ec: Number,
    units: {
      moisture: { type: String, default: '%' },
      temperature: { type: String, default: 'C' },
      ph: { type: String, default: 'pH' },
      nitrogen: { type: String, default: 'mg/kg' },
      phosphorus: { type: String, default: 'mg/kg' },
      potassium: { type: String, default: 'mg/kg' },
      ec: { type: String, default: 'mS/cm' },
    },
    dataQuality: {
      type: String,
      enum: ['VALID', 'SUSPICIOUS', 'DATA_ERROR'],
      default: 'VALID'
    },
    sensorStatus: String,
    rawData: mongoose.Schema.Types.Mixed, // Raw payload for debugging
  },
  {
    timestamps: true,
  }
);

// Indexes to speed up queries
soilReadingSchema.index({ field: 1, timestamp: -1 });
soilReadingSchema.index({ device: 1, timestamp: -1 });

const SoilReading = mongoose.model('SoilReading', soilReadingSchema);
export default SoilReading;
