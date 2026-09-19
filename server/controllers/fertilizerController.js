import FertilizerReport from '../models/FertilizerReport.js';
import { generateChatResponse } from '../services/openRouterService.js';
import Field from '../models/Field.js';

const SYSTEM_PROMPT = `You are an expert agronomist AI specialized in Indian agriculture. Based on the user's crop and soil details, recommend the most effective fertilizer available in Indian markets.
Return the output STRICTLY in the following JSON format. Ensure all cost estimates are extremely realistic for India and strictly formatted in Indian Rupees (₹), NOT dollars.
{
  "RecommendedFertilizer": "EXACT Indian brand name ONLY (e.g., IFFCO NPK 20-20-0-13, Coromandel Gromor)",
  "Reason": "Provide a detailed explanation of why this specific brand/mix is perfect for the soil conditions.",
  "Quantity": "Provide the quantity required 'per katha' (e.g., 2.5 kg per katha)",
  "ApplicationMethod": "e.g., Broadcasting",
  "Frequency": "e.g., Twice a month",
  "Precautions": ["precaution 1", "precaution 2"],
  "OrganicAlternatives": "Provide a detailed list of specific organic options available in India (e.g., Patanjali Vermicompost, Tata Rallis Neem Cake, Jeevamrutha). Explain how to prepare or apply them.",
  "EstimatedCost": "Provide the estimated cost 'per katha' in ₹ (e.g., ₹60 per katha)"
}`;

// @desc    Get fertilizer recommendation
// @route   POST /api/fertilizer/recommend
// @access  Private
const recommendFertilizer = async (req, res) => {
  try {
    const { fieldId, crop, soilType, growthStage, nitrogenLevel, phosphorusLevel, potassiumLevel, language } = req.body;
    
    let n = nitrogenLevel, p = phosphorusLevel, k = potassiumLevel, st = soilType, c = crop;
    if (fieldId) {
      const field = await Field.findById(fieldId);
      if (field && field.latestSoilStatus) {
        n = field.latestSoilStatus.nitrogen;
        p = field.latestSoilStatus.phosphorus;
        k = field.latestSoilStatus.potassium;
        st = field.soilType;
        c = field.currentCrop;
      }
    }

    const dynamicSystemPrompt = `${SYSTEM_PROMPT}
    CRITICAL INSTRUCTION: The requested language is '${language || 'en'}'. If the requested language is 'en', you MUST reply entirely in English. If the requested language is 'hi', you MUST translate your final JSON output values strictly into pure Hindi (Devanagari script), NEVER use Hinglish. DO NOT use ANY asterisks (*) or markdown formatting in your response.
    `;

    const prompt = `Please recommend a fertilizer based on these conditions:
      Crop: ${c}
      Soil Type: ${st}
      Growth Stage: ${growthStage}
      Nitrogen Level (N): ${n}
      Phosphorus Level (P): ${p}
      Potassium Level (K): ${k}`;

    const aiResponseText = await generateChatResponse([{ role: 'user', content: prompt }], dynamicSystemPrompt);
    
    let aiData;
    try {
      // Clean up potential markdown formatting and strip ALL asterisks/hashes
      let cleanedText = aiResponseText.replace(/```json/gi, '').replace(/```/gi, '').replace(/[*#]/g, '').trim();
      aiData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponseText);
      return res.status(500).json({ message: 'Failed to process AI response' });
    }

    const report = await FertilizerReport.create({
      user: req.user._id,
      crop: c, soilType: st, growthStage, nitrogenLevel: n, phosphorusLevel: p, potassiumLevel: k,
      recommendedFertilizer: aiData.RecommendedFertilizer,
      reason: aiData.Reason,
      quantity: aiData.Quantity,
      applicationMethod: aiData.ApplicationMethod,
      frequency: aiData.Frequency,
      precautions: aiData.Precautions,
      organicAlternatives: aiData.OrganicAlternatives,
      estimatedCost: aiData.EstimatedCost,
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('Fertilizer Recommendation Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get fertilizer recommendation history
// @route   GET /api/fertilizer/history
// @access  Private
const getFertilizerHistory = async (req, res) => {
  try {
    const history = await FertilizerReport.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete fertilizer recommendation
// @route   DELETE /api/fertilizer/:id
// @access  Private
const deleteFertilizerRecommendation = async (req, res) => {
  try {
    const report = await FertilizerReport.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json({ message: 'Report removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export { recommendFertilizer, getFertilizerHistory, deleteFertilizerRecommendation };
