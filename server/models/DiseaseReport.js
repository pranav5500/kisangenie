import mongoose from 'mongoose';

const diseaseReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    imageUrl: {
      type: String,
      required: true,
    },
    plantName: String,
    diseaseName: String,
    confidence: Number,
    cause: String,
    symptoms: [String],
    organicTreatment: String,
    chemicalTreatment: String,
    recommendedFertilizer: String,
    waterAdvice: String,
    recoveryTime: String,
    prevention: [String],
    severity: String,
    isDiseased: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const DiseaseReport = mongoose.model('DiseaseReport', diseaseReportSchema);
export default DiseaseReport;
