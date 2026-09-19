import DiseaseReport from '../models/DiseaseReport.js';
import { analyzeImage } from '../services/openRouterService.js';

const SYSTEM_PROMPT = `You are a strict and expert agricultural AI. Analyze this image.
CRITICAL RULE 1: FIRST, verify if the uploaded image is actually a plant, leaf, or crop. If the image is a logo, text, screenshot, human, animal, cartoon, or any irrelevant object, you MUST set "IsPlant" to false and you can leave other fields empty. Do NOT attempt to diagnose a non-plant image.
Return the output STRICTLY in the following JSON format:
{
  "IsPlant": true/false,
  "PlantName": "Name of the specific plant/crop (e.g. Corn, Tomato)",
  "DiseaseName": "Name of the disease (or 'Healthy' if no disease)",
  "Confidence": 95, // as a number between 0-100
  "Cause": "Cause of the disease",
  "Symptoms": ["symptom 1", "symptom 2"],
  "Treatment": "General treatment advice",
  "OrganicCure": "Organic solutions",
  "ChemicalCure": "Chemical solutions",
  "RecommendedFertilizer": "Fertilizer advice",
  "Prevention": ["tip 1", "tip 2"],
  "IsContagious": true/false,
  "ExpectedRecoveryTime": "e.g., 2 weeks",
  "Severity": "Low/Medium/High",
  "IsDiseased": true/false
}
If healthy, congratulate the farmer in the Treatment field and set IsDiseased to false.`;

// @desc    Analyze plant image for disease
// @route   POST /api/disease/analyze
// @access  Private
const analyzePlantDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const base64Image = req.file.buffer.toString('base64');
    const language = req.body.language || 'en';
    const dynamicPrompt = `${SYSTEM_PROMPT}\nCRITICAL INSTRUCTION: The requested language is '${language}'. If the requested language is 'en', you MUST reply entirely in English. If the requested language is 'hi', you MUST translate your final JSON output values strictly into pure Hindi (Devanagari script), NEVER use Hinglish. DO NOT use ANY asterisks (*) or markdown formatting.`;
    
    // Call AI
    const aiResponseText = await analyzeImage(base64Image, dynamicPrompt);
    
    // Parse JSON
    let aiData;
    try {
      // Clean up potential markdown formatting and strip ALL asterisks/hashes
      let cleanedText = aiResponseText.replace(/```json/gi, '').replace(/```/gi, '').replace(/[*#]/g, '').trim();
      aiData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponseText);
      return res.status(500).json({ message: 'Failed to process AI response' });
    }

    if (aiData.IsPlant === false) {
      return res.status(400).json({ message: 'The uploaded image does not appear to be a plant. Please upload a clear image of a leaf or crop.' });
    }

    // Save to DB
    const report = await DiseaseReport.create({
      user: req.user._id,
      imageUrl: 'base64_image_stored_locally_or_cloud_later', // We will mock this or upload to cloudinary later
      plantName: aiData.PlantName,
      diseaseName: aiData.DiseaseName,
      confidence: aiData.Confidence,
      cause: aiData.Cause,
      symptoms: aiData.Symptoms,
      organicTreatment: aiData.OrganicCure,
      chemicalTreatment: aiData.ChemicalCure,
      recommendedFertilizer: aiData.RecommendedFertilizer,
      waterAdvice: "Based on crop requirement", // Can be added to prompt
      recoveryTime: aiData.ExpectedRecoveryTime,
      prevention: aiData.Prevention,
      severity: aiData.Severity,
      isDiseased: aiData.IsDiseased,
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('Disease Analysis Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get disease history
// @route   GET /api/disease/history
// @access  Private
const getDiseaseHistory = async (req, res) => {
  try {
    const reports = await DiseaseReport.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete disease report
// @route   DELETE /api/disease/:id
// @access  Private
const deleteDiseaseReport = async (req, res) => {
  try {
    const report = await DiseaseReport.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json({ message: 'Report removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export { analyzePlantDisease, getDiseaseHistory, deleteDiseaseReport };
