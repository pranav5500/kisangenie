import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    fieldName: {
      type: String,
      required: true,
    },
    location: String,
    latitude: Number,
    longitude: Number,
    area: Number, // in acres/hectares
    soilType: String,
    currentCrop: {
      type: String,
      required: true,
    },
    cropVariety: String,
    plantingDate: Date,
    season: String,
    irrigationType: String,
    // Store latest state here for fast dashboard access without aggregating readings every time
    latestSoilStatus: {
      healthScore: Number,
      lastUpdated: Date,
      moisture: Number,
      temperature: Number,
      ph: Number,
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number,
      ec: Number,
      status: {
        type: String,
        enum: ['GOOD', 'WARNING', 'CRITICAL', 'UNKNOWN'],
        default: 'UNKNOWN'
      }
    }
  },
  {
    timestamps: true,
  }
);

const Field = mongoose.model('Field', fieldSchema);
export default Field;
