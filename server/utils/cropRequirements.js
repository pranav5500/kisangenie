// A generic representation of crop requirements for the prototype.
// In a production system, this could be stored in a MongoDB collection.

export const cropRequirements = {
  Tomato: {
    moistureRange: { min: 60, max: 80 },
    phRange: { min: 6.0, max: 6.8 },
    nitrogenRange: { min: 30, max: 50 },
    phosphorusRange: { min: 40, max: 60 },
    potassiumRange: { min: 30, max: 40 },
    ecRange: { min: 0.5, max: 1.5 },
    temperatureRange: { min: 21, max: 27 },
  },
  Wheat: {
    moistureRange: { min: 50, max: 70 },
    phRange: { min: 6.0, max: 7.0 },
    nitrogenRange: { min: 40, max: 60 },
    phosphorusRange: { min: 30, max: 50 },
    potassiumRange: { min: 25, max: 45 },
    ecRange: { min: 0.4, max: 1.2 },
    temperatureRange: { min: 15, max: 24 },
  },
  Potato: {
    moistureRange: { min: 70, max: 85 },
    phRange: { min: 5.0, max: 6.5 },
    nitrogenRange: { min: 35, max: 55 },
    phosphorusRange: { min: 45, max: 65 },
    potassiumRange: { min: 40, max: 60 },
    ecRange: { min: 0.5, max: 1.3 },
    temperatureRange: { min: 15, max: 20 },
  },
  Rice: {
    moistureRange: { min: 80, max: 100 },
    phRange: { min: 5.5, max: 6.5 },
    nitrogenRange: { min: 30, max: 50 },
    phosphorusRange: { min: 20, max: 40 },
    potassiumRange: { min: 20, max: 35 },
    ecRange: { min: 0.2, max: 1.0 },
    temperatureRange: { min: 20, max: 35 },
  },
  Corn: {
    moistureRange: { min: 60, max: 80 },
    phRange: { min: 5.8, max: 7.0 },
    nitrogenRange: { min: 45, max: 65 },
    phosphorusRange: { min: 35, max: 55 },
    potassiumRange: { min: 30, max: 50 },
    ecRange: { min: 0.6, max: 1.4 },
    temperatureRange: { min: 21, max: 32 },
  }
};

export const getCropRequirements = (cropName) => {
  // Return the specified crop or a generic default if not found
  return cropRequirements[cropName] || {
    moistureRange: { min: 50, max: 80 },
    phRange: { min: 6.0, max: 7.0 },
    nitrogenRange: { min: 30, max: 50 },
    phosphorusRange: { min: 30, max: 50 },
    potassiumRange: { min: 30, max: 50 },
    ecRange: { min: 0.5, max: 1.5 },
    temperatureRange: { min: 20, max: 30 },
  };
};
