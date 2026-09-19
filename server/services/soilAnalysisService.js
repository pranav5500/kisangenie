import { getCropRequirements } from '../utils/cropRequirements.js';
import Alert from '../models/Alert.js';
import Field from '../models/Field.js';

export const validateSensorData = (readings) => {
  // Simple validation to ensure data is physically possible
  const isValid = (
    readings.soilMoisture >= 0 && readings.soilMoisture <= 100 &&
    readings.ph >= 0 && readings.ph <= 14 &&
    readings.nitrogen >= 0 && readings.nitrogen < 1000 &&
    readings.phosphorus >= 0 && readings.phosphorus < 1000 &&
    readings.potassium >= 0 && readings.potassium < 1000 &&
    readings.ec >= 0 && readings.ec < 10
  );
  return isValid ? 'VALID' : 'SUSPICIOUS';
};

const evaluateParameter = (value, range) => {
  if (value < range.min) return { status: 'LOW', severity: 'WARNING' };
  if (value > range.max) return { status: 'HIGH', severity: 'WARNING' };
  return { status: 'GOOD', severity: 'INFO' };
};

export const analyzeSoil = (readings, cropName) => {
  const requirements = getCropRequirements(cropName);

  const analysis = {
    moisture: { value: readings.soilMoisture, ...evaluateParameter(readings.soilMoisture, requirements.moistureRange) },
    temperature: { value: readings.soilTemperature, ...evaluateParameter(readings.soilTemperature, requirements.temperatureRange) },
    ph: { value: readings.ph, ...evaluateParameter(readings.ph, requirements.phRange) },
    nitrogen: { value: readings.nitrogen, ...evaluateParameter(readings.nitrogen, requirements.nitrogenRange) },
    phosphorus: { value: readings.phosphorus, ...evaluateParameter(readings.phosphorus, requirements.phosphorusRange) },
    potassium: { value: readings.potassium, ...evaluateParameter(readings.potassium, requirements.potassiumRange) },
    ec: { value: readings.ec, ...evaluateParameter(readings.ec, requirements.ecRange) }
  };

  // Calculate deterministic health score 0-100
  let score = 100;
  let deductions = 0;
  
  Object.values(analysis).forEach(param => {
    if (param.status !== 'GOOD') {
      deductions += 15; // Deduct 15 points for every parameter out of range
    }
  });

  const healthScore = Math.max(0, score - deductions);
  
  let overallStatus = 'GOOD';
  if (healthScore < 50) overallStatus = 'CRITICAL';
  else if (healthScore < 80) overallStatus = 'WARNING';

  return { analysis, healthScore, overallStatus };
};

export const generateAlertsIfNeeded = async (fieldId, userId, deviceId, currentAnalysis, previousAnalysis) => {
  // If no previous analysis, maybe we generate initial alerts if they are bad
  if (!previousAnalysis) return;

  const parametersToCheck = ['moisture', 'ph', 'nitrogen', 'phosphorus', 'potassium'];
  
  for (const param of parametersToCheck) {
    const current = currentAnalysis[param];
    const previous = previousAnalysis[param];

    if (current && previous) {
      if (current.status !== 'GOOD' && previous.status === 'GOOD') {
        // Parameter degraded
        await Alert.create({
          user: userId,
          field: fieldId,
          device: deviceId,
          type: 'DEFICIENCY',
          severity: current.severity,
          message: `${param.charAt(0).toUpperCase() + param.slice(1)} is currently ${current.status}.`,
          parameter: param
        });
      }
    }
  }
};
