import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FaUpload, FaSpinner, FaLeaf, FaPrescriptionBottle, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const DiseaseDetection = () => {
  const { i18n } = useTranslation();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);
    formData.append('language', i18n.language);

    try {
      const { data } = await api.post('/disease/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(data);
      toast.success('Analysis complete!');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to analyze image. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Plant Disease Detection</h1>
      <p className="text-gray-500 mb-6 md:mb-8 text-sm md:text-base">Upload an image of a diseased plant leaf for instant AI analysis and treatment recommendations.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* Upload Section */}
        <div className="glass-card p-4 md:p-6 flex flex-col items-center justify-center min-h-[250px] md:min-h-[400px]">
          {!preview ? (
            <div 
              {...getRootProps()} 
              className={`w-full h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer transition-colors ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'}`}
            >
              <input {...getInputProps()} />
              <FaUpload className="text-4xl md:text-5xl text-gray-400 mb-4" />
              <p className="text-base md:text-lg font-medium text-gray-700 text-center">Drag & drop an image here, or click to select one</p>
              <p className="text-xs md:text-sm text-gray-500 mt-2">Supports JPG, PNG, WEBP (Max 5MB)</p>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <img src={preview} alt="Plant Preview" className="max-h-[300px] rounded-lg shadow-md object-contain mb-6" />
              <div className="flex gap-4 w-full">
                <button onClick={() => { setImage(null); setPreview(null); setResult(null); }} className="flex-1 btn-secondary" disabled={loading}>
                  Remove
                </button>
                <button onClick={analyzeImage} className="flex-1 btn-primary flex justify-center items-center gap-2" disabled={loading}>
                  {loading ? <><FaSpinner className="animate-spin" /> Analyzing...</> : 'Analyze Image'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Result Section */}
        <div className="glass-card p-4 md:p-6 min-h-[250px] md:min-h-[400px] flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <FaSpinner className="animate-spin text-5xl text-green-500 mb-4" />
              <p className="text-lg">AI is analyzing the plant structure and detecting anomalies...</p>
            </div>
          ) : result ? (
            <div className="flex-1 overflow-y-auto space-y-6">
              <div className={`p-4 rounded-xl flex items-center justify-between ${result.isDiseased ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">
                    {result.plantName ? `${result.plantName} - ${result.diseaseName}` : result.diseaseName}
                  </h2>
                  <p className="text-sm font-medium mt-1">Confidence: {result.confidence}%</p>
                </div>
                <div className="text-4xl">
                  {result.isDiseased ? <FaExclamationTriangle /> : <FaCheckCircle />}
                </div>
              </div>

              {result.isDiseased && (
                <>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2"><FaLeaf className="text-green-600"/> Symptoms & Causes</h3>
                    <p className="text-gray-600 text-sm mb-2"><span className="font-semibold text-gray-700">Cause:</span> {result.cause}</p>
                    <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                      {result.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2"><FaPrescriptionBottle className="text-blue-600"/> Treatment Plan</h3>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100 mb-3">
                      <p className="text-sm font-semibold text-green-800 mb-1">Organic Treatment</p>
                      <p className="text-sm text-green-700">{result.organicTreatment}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                      <p className="text-sm font-semibold text-yellow-800 mb-1">Chemical Treatment</p>
                      <p className="text-sm text-yellow-700">{result.chemicalTreatment}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Fertilizer Advice</p>
                      <p className="text-sm text-gray-800">{result.recommendedFertilizer}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Recovery Time</p>
                      <p className="text-sm text-gray-800">{result.recoveryTime}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center">
              <FaLeaf className="text-6xl mb-4 opacity-30" />
              <p>Upload an image to see the detailed AI diagnosis report here.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DiseaseDetection;
