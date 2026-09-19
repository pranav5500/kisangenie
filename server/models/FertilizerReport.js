import mongoose from 'mongoose';

const fertilizerReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    crop: String,
    soilType: String,
    growthStage: String,
    nitrogenLevel: Number,
    phosphorusLevel: Number,
    potassiumLevel: Number,

    // AI Response Fields
    recommendedFertilizer: String,
    reason: String,
    quantity: String,
    applicationMethod: String,
    frequency: String,
    precautions: [String],
    organicAlternatives: String,
    estimatedCost: String,
  },
  {
    timestamps: true,
  }
);

const FertilizerReport = mongoose.model('FertilizerReport', fertilizerReportSchema);
export default FertilizerReport;
