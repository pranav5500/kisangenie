import mongoose from 'mongoose';

const cropRecommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    location: {
      state: String,
      district: String,
    },
    season: String,
    soilType: String,
    soilPh: Number,
    rainfall: Number, // in mm
    temperature: Number, // in celsius
    availableWater: String,
    farmSize: Number,
    budget: Number,
    previousCrop: String,
    
    // AI Response Fields
    recommendedCrop: String,
    reason: String,
    expectedYield: String,
    estimatedProfit: String,
    waterRequirement: String,
    growingDuration: String,
    seedRecommendation: String,
    suitableClimate: String,
    harvestTime: String,
    possibleDiseases: [String],
    marketDemand: String,
  },
  {
    timestamps: true,
  }
);

const CropRecommendation = mongoose.model('CropRecommendation', cropRecommendationSchema);
export default CropRecommendation;
