import CropRecommendation from '../models/CropRecommendation.js';
import { generateChatResponse } from '../services/openRouterService.js';
import Field from '../models/Field.js';

const SYSTEM_PROMPT = `You are an expert agronomist AI specialized in Indian agriculture. Based on the user's location (State/District in India), soil, and climate details, recommend the most profitable and suitable crop.
Return the output STRICTLY in the following JSON format. Ensure all cost and profit estimates are extremely realistic for Indian markets and strictly formatted in Indian Rupees (₹), NOT dollars.
{
  "RecommendedCrop": "Name of the crop",
  "Reason": "Why this crop is suitable for this specific Indian region",
  "ExpectedYield": "e.g., 50 quintals per hectare",
  "EstimatedProfit": "e.g., ₹45,000 per acre",
  "WaterRequirement": "e.g., 500-700 mm",
  "GrowingDuration": "e.g., 120 days",
  "SeedRecommendation": "Best Indian seed variety (e.g., Pusa Basmati 1121)",
  "SuitableClimate": "Climate description",
  "HarvestTime": "e.g., Mid-October",
  "PossibleDiseases": ["disease 1", "disease 2"],
  "MarketDemand": "High/Medium/Low in Indian mandis"
}`;

// @desc    Get crop recommendation
// @route   POST /api/crop/recommend
// @access  Private
const recommendCrop = async (req, res) => {
  try {
    const { fieldId, state, district, season, soilType, soilPh, rainfall, temperature, availableWater, farmSize, budget, previousCrop, language } = req.body;
    
    let st = soilType, ph = soilPh, temp = temperature;
    if (fieldId) {
      const field = await Field.findById(fieldId);
      if (field && field.latestSoilStatus) {
        st = field.soilType;
        ph = field.latestSoilStatus.ph;
        temp = field.latestSoilStatus.temperature;
      }
    }
    
    const dynamicPrompt = `${SYSTEM_PROMPT}
    CRITICAL INSTRUCTION: The requested language is '${language || 'en'}'. If the requested language is 'en', you MUST reply entirely in English. If the requested language is 'hi', you MUST translate your final JSON output values strictly into pure Hindi (Devanagari script), NEVER use Hinglish. DO NOT use ANY asterisks (*) or markdown formatting in your response.
    `;

    const prompt = `Please recommend a crop based on these conditions:
      Location: ${state}, ${district}
      Season: ${season}
      Soil Type: ${st} (pH: ${ph})
      Rainfall: ${rainfall}mm
      Temperature: ${temp}°C
      Available Water: ${availableWater}
      Farm Size: ${farmSize} acres
      Budget: ₹${budget}
      Previous Crop: ${previousCrop}`;

    const aiResponseText = await generateChatResponse([{ role: 'user', content: prompt }], dynamicPrompt);
    
    let aiData;
    try {
      // Clean up potential markdown formatting and strip ALL asterisks/hashes
      let cleanedText = aiResponseText.replace(/```json/gi, '').replace(/```/gi, '').replace(/[*#]/g, '').trim();
      aiData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponseText);
      return res.status(500).json({ message: 'Failed to process AI response' });
    }

    const recommendation = await CropRecommendation.create({
      user: req.user._id,
      location: { state, district },
      season, soilType: st, soilPh: ph, rainfall, temperature: temp, availableWater, farmSize, budget, previousCrop,
      recommendedCrop: aiData.RecommendedCrop,
      reason: aiData.Reason,
      expectedYield: aiData.ExpectedYield,
      estimatedProfit: aiData.EstimatedProfit,
      waterRequirement: aiData.WaterRequirement,
      growingDuration: aiData.GrowingDuration,
      seedRecommendation: aiData.SeedRecommendation,
      suitableClimate: aiData.SuitableClimate,
      harvestTime: aiData.HarvestTime,
      possibleDiseases: aiData.PossibleDiseases,
      marketDemand: aiData.MarketDemand,
    });

    res.status(201).json(recommendation);
  } catch (error) {
    console.error('Crop Recommendation Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get crop recommendation history
// @route   GET /api/crop/history
// @access  Private
const getCropHistory = async (req, res) => {
  try {
    const history = await CropRecommendation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete crop recommendation
// @route   DELETE /api/crop/:id
// @access  Private
const deleteCropRecommendation = async (req, res) => {
  try {
    const report = await CropRecommendation.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json({ message: 'Report removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export { recommendCrop, getCropHistory, deleteCropRecommendation };
