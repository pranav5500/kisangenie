import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaSeedling, FaSpinner, FaCloudSun, FaTint, FaMapMarkerAlt, FaFilePdf } from 'react-icons/fa';

const CropRecommendation = () => {
  const { i18n } = useTranslation();
  const [formData, setFormData] = useState({
    state: '', district: '', season: 'Kharif', soilType: 'Loamy', soilPh: 6.5, 
    rainfall: 500, temperature: 25, availableWater: 'Moderate', farmSize: 2, 
    budget: 1000, previousCrop: 'Wheat'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/crop/recommend', {
        ...formData,
        language: i18n.language
      });
      setResult(data);
      toast.success('Crop recommendation generated!');
    } catch (error) {
      toast.error('Failed to generate recommendation.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!result) return;
    const element = document.getElementById('crop-pdf-report');
    if (!element) return;
    
    const loadingToast = toast.loading('Generating premium PDF...');
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`KisanGenie_Crop_Report_${result.recommendedCrop.replace(/\s+/g, '_')}.pdf`);
      toast.success('Premium PDF Downloaded!', { id: loadingToast });
    } catch (error) {
      toast.error('Failed to generate PDF', { id: loadingToast });
      console.error(error);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Smart Crop Recommender</h1>
          <p className="text-gray-500">Enter your farm details to get the most profitable crop recommendation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Section */}
        <div className="lg:col-span-5 glass-card p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input type="text" name="state" required className="input-field py-2" value={formData.state} onChange={handleChange} placeholder="e.g. Punjab" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <input type="text" name="district" required className="input-field py-2" value={formData.district} onChange={handleChange} placeholder="e.g. Ludhiana" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
                <select name="season" className="input-field py-2" value={formData.season} onChange={handleChange}>
                  <option>Kharif (Monsoon)</option>
                  <option>Rabi (Winter)</option>
                  <option>Zaid (Summer)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
                <select name="soilType" className="input-field py-2" value={formData.soilType} onChange={handleChange}>
                  <option>Loamy</option>
                  <option>Clay</option>
                  <option>Sandy</option>
                  <option>Black</option>
                  <option>Red</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soil pH</label>
                <input type="number" step="0.1" name="soilPh" className="input-field py-2" value={formData.soilPh} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rainfall (mm)</label>
                <input type="number" name="rainfall" className="input-field py-2" value={formData.rainfall} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
                <input type="number" name="temperature" className="input-field py-2" value={formData.temperature} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous Crop</label>
                <input type="text" name="previousCrop" className="input-field py-2" value={formData.previousCrop} onChange={handleChange} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary mt-4 flex justify-center items-center gap-2">
              {loading ? <><FaSpinner className="animate-spin"/> Analyzing Data...</> : 'Get Recommendation'}
            </button>
          </form>
        </div>

        {/* Result Section */}
        <div className="lg:col-span-7 glass-card p-4 md:p-8 flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <FaSpinner className="animate-spin text-5xl text-green-500 mb-4" />
              <p className="text-lg">Processing farm data through AI models...</p>
            </div>
          ) : result ? (
            <div className="animate-fade-in-up">
              <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4 border-b border-gray-100 pb-6 mb-6">
                <div>
                  <p className="text-green-600 font-semibold uppercase tracking-wider text-sm mb-2">Recommended Crop</p>
                  <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">{result.recommendedCrop}</h2>
                </div>
                <button onClick={downloadPDF} className="btn-secondary py-2 px-4 text-sm flex items-center gap-2 flex-shrink-0 sm:ml-4 w-full sm:w-auto justify-center">
                  <FaFilePdf /> Export PDF
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 text-blue-900 text-sm leading-relaxed">
                <span className="font-semibold">Why this crop?</span> {result.reason}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Expected Yield</p>
                  <p className="text-lg font-semibold text-gray-800">{result.expectedYield}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Est. Profit</p>
                  <p className="text-lg font-semibold text-green-600">{result.estimatedProfit}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Duration</p>
                  <p className="text-lg font-semibold text-gray-800">{result.growingDuration}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg flex gap-4 items-start">
                  <div className="bg-white p-2 rounded shadow-sm text-blue-500"><FaTint className="text-xl"/></div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Water Req.</p>
                    <p className="text-sm font-medium text-gray-800">{result.waterRequirement}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex gap-4 items-start">
                  <div className="bg-white p-2 rounded shadow-sm text-yellow-500"><FaCloudSun className="text-xl"/></div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Climate</p>
                    <p className="text-sm font-medium text-gray-800">{result.suitableClimate}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex gap-4 items-start">
                  <div className="bg-white p-2 rounded shadow-sm text-green-500"><FaSeedling className="text-xl"/></div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Seed Variety</p>
                    <p className="text-sm font-medium text-gray-800">{result.seedRecommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center">
              <FaMapMarkerAlt className="text-6xl mb-4 opacity-30" />
              <p>Enter your farm's location and soil details to get an AI-powered crop recommendation.</p>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Premium PDF Report Template */}
      {result && (
        <div className="fixed left-[-9999px] top-0">
          <div id="crop-pdf-report" className="w-[800px] bg-white p-12 font-sans text-gray-800">
            {/* Premium Header */}
            <div className="flex justify-between items-center border-b-4 border-green-500 pb-6 mb-8">
              <div>
                <h1 className="text-4xl font-extrabold text-green-600 tracking-tight">KisanGenie<span className="text-gray-800">.ai</span></h1>
                <p className="text-gray-500 text-lg mt-1 font-medium">Smart Crop Recommendation Report</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-700">Date: {new Date().toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Location: {formData.district}, {formData.state}</p>
              </div>
            </div>

            {/* Main AI Result Highlight */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 mb-8 border border-green-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-500 p-3 rounded-full text-white shadow-md">
                  <FaSeedling className="text-3xl" />
                </div>
                <div>
                  <p className="text-green-700 font-bold uppercase tracking-widest text-sm">Top Recommendation</p>
                  <h2 className="text-4xl font-extrabold text-gray-900">{result.recommendedCrop}</h2>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed italic border-l-4 border-green-400 pl-4 mt-4">
                "{result.reason}"
              </p>
            </div>

            {/* Two Column Data Section */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Left Col: Farm Details */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                  <FaMapMarkerAlt className="text-blue-500" /> Farm Inputs
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex justify-between"><span className="text-gray-500">Season</span> <span className="font-semibold text-gray-900">{formData.season}</span></li>
                  <li className="flex justify-between"><span className="text-gray-500">Soil Type</span> <span className="font-semibold text-gray-900">{formData.soilType}</span></li>
                  <li className="flex justify-between"><span className="text-gray-500">Soil pH</span> <span className="font-semibold text-gray-900">{formData.soilPh}</span></li>
                  <li className="flex justify-between"><span className="text-gray-500">Rainfall</span> <span className="font-semibold text-gray-900">{formData.rainfall} mm</span></li>
                  <li className="flex justify-between"><span className="text-gray-500">Temperature</span> <span className="font-semibold text-gray-900">{formData.temperature} °C</span></li>
                </ul>
              </div>

              {/* Right Col: AI Projections */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 shadow-sm">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2 border-b border-blue-200 pb-2">
                  <FaCloudSun className="text-yellow-500" /> Yield Projections
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex justify-between"><span className="text-gray-600">Expected Yield</span> <span className="font-bold text-gray-900">{result.expectedYield}</span></li>
                  <li className="flex justify-between"><span className="text-gray-600">Est. Profit</span> <span className="font-bold text-green-700">{result.estimatedProfit}</span></li>
                  <li className="flex justify-between"><span className="text-gray-600">Growing Duration</span> <span className="font-semibold text-gray-900">{result.growingDuration}</span></li>
                  <li className="flex justify-between"><span className="text-gray-600">Water Req.</span> <span className="font-semibold text-gray-900">{result.waterRequirement}</span></li>
                  <li className="flex justify-between"><span className="text-gray-600">Seed Variety</span> <span className="font-semibold text-gray-900">{result.seedRecommendation}</span></li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-6 border-t border-gray-200 text-center text-gray-400 text-sm">
              <p>This report was autonomously generated by KisanGenie AI. For more details, visit our platform.</p>
              <p className="mt-1">© {new Date().getFullYear()} KisanGenie. All rights reserved.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropRecommendation;
