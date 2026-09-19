import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaSeedling, FaSpinner, FaFlask, FaVial, FaFilePdf, FaTractor } from 'react-icons/fa';

const FertilizerRecommendation = () => {
  const { i18n } = useTranslation();
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({
    fieldId: '', crop: 'Wheat', soilType: 'Loamy', growthStage: 'Vegetative',
    nitrogenLevel: 50, phosphorusLevel: 30, potassiumLevel: 40
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Fetch user's fields
    api.get('/iot/fields').then(res => setFields(res.data.data)).catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Force direct connection to 5000 
      const { data } = await api.post('http://localhost:5000/api/fertilizer/recommend', {
        ...formData,
        language: i18n.language
      });
      setResult(data);
      toast.success('Fertilizer recommendation generated!');
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(`Failed: ${msg}`);
      console.error('Fertilizer error:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!result) return;
    const element = document.getElementById('fertilizer-pdf-report');
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
      pdf.save(`KisanGenie_Fertilizer_Report.pdf`);
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Smart Fertilizer Advisor</h1>
          <p className="text-gray-500">Get AI-driven precision fertilizer recommendations to boost your crop yield.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-5 glass-card p-4 md:p-6 border-t-4 border-yellow-500">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mb-4">
              <label className="block text-sm font-semibold text-emerald-800 mb-1 flex items-center gap-2">
                <FaTractor /> Link to Sensor Field (Optional)
              </label>
              <select name="fieldId" className="input-field py-2" value={formData.fieldId} onChange={handleChange}>
                <option value="">-- Use Manual Entry Below --</option>
                {fields.map(f => (
                  <option key={f._id} value={f._id}>{f.fieldName} ({f.currentCrop})</option>
                ))}
              </select>
              {formData.fieldId && <p className="text-xs text-emerald-600 mt-2 italic">Crop and NPK values will be automatically pulled from the live sensor data.</p>}
            </div>

            <div className={formData.fieldId ? 'opacity-50 pointer-events-none' : ''}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
              <input type="text" name="crop" required={!formData.fieldId} className="input-field py-2" value={formData.crop} onChange={handleChange} />
            </div>
            
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${formData.fieldId ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
                <select name="soilType" className="input-field py-2" value={formData.soilType} onChange={handleChange}>
                  <option>Loamy</option>
                  <option>Clay</option>
                  <option>Sandy</option>
                  <option>Black</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Growth Stage</label>
                <select name="growthStage" className="input-field py-2" value={formData.growthStage} onChange={handleChange}>
                  <option>Seedling</option>
                  <option>Vegetative</option>
                  <option>Flowering</option>
                  <option>Fruiting</option>
                </select>
              </div>
            </div>

            <div className={`bg-gray-50 p-4 rounded-xl border border-gray-200 mt-4 ${formData.fieldId ? 'opacity-50 pointer-events-none' : ''}`}>
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><FaVial className="text-blue-500"/> NPK Soil Levels (kg/ha)</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-medium text-gray-600 w-24 text-right">Nitrogen (N)</label>
                  <input type="number" name="nitrogenLevel" className="input-field py-1" value={formData.nitrogenLevel} onChange={handleChange} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-medium text-gray-600 w-24 text-right">Phosphorus (P)</label>
                  <input type="number" name="phosphorusLevel" className="input-field py-1" value={formData.phosphorusLevel} onChange={handleChange} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-medium text-gray-600 w-24 text-right">Potassium (K)</label>
                  <input type="number" name="potassiumLevel" className="input-field py-1" value={formData.potassiumLevel} onChange={handleChange} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-yellow-500/30 hover:shadow-yellow-500/50 mt-4 flex justify-center items-center gap-2">
              {loading ? <><FaSpinner className="animate-spin"/> Analyzing Soil...</> : 'Get Recommendation'}
            </button>
          </form>
        </div>

        {/* Result Section */}
        <div className="lg:col-span-7 glass-card p-4 md:p-8 flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <FaSpinner className="animate-spin text-5xl text-yellow-500 mb-4" />
              <p className="text-lg">AI is calculating optimal nutrient requirements...</p>
            </div>
          ) : result ? (
            <div className="animate-fade-in-up">
              <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4 border-b border-gray-100 pb-6 mb-6">
                <div>
                  <p className="text-yellow-600 font-semibold uppercase tracking-wider text-sm mb-2">Recommended Fertilizer</p>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">{result.recommendedFertilizer}</h2>
                </div>
                <button onClick={downloadPDF} className="btn-secondary py-2 px-4 text-sm flex items-center gap-2 flex-shrink-0 sm:ml-4 w-full sm:w-auto justify-center">
                  <FaFilePdf /> Export PDF
                </button>
              </div>

              {result.reason && (
                <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl mb-6 text-yellow-900 text-sm leading-relaxed">
                  <span className="font-semibold">Why this fertilizer?</span> {result.reason}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Quantity Needed</p>
                  <p className="text-lg font-semibold text-gray-800">{result.quantity}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Estimated Cost</p>
                  <p className="text-lg font-semibold text-red-600">{result.estimatedCost}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-1"><FaFlask className="text-blue-500" /> Application Method</h4>
                  <p className="text-gray-600 text-sm bg-blue-50 p-3 rounded-lg border border-blue-100">{result.applicationMethod} (Freq: {result.frequency})</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-1"><FaSeedling className="text-green-500" /> Organic Alternatives</h4>
                  <p className="text-gray-600 text-sm bg-green-50 p-3 rounded-lg border border-green-100">{result.organicAlternatives}</p>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center">
              <FaVial className="text-6xl mb-4 opacity-30" />
              <p>Enter your crop and NPK levels to get a customized fertilizer plan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Premium PDF Report Template */}
      {result && (
        <div className="fixed left-[-9999px] top-0">
          <div id="fertilizer-pdf-report" className="w-[800px] bg-white p-12 font-sans text-gray-800">
            {/* Premium Header */}
            <div className="flex justify-between items-center border-b-4 border-yellow-500 pb-6 mb-8">
              <div>
                <h1 className="text-4xl font-extrabold text-yellow-600 tracking-tight">KisanGenie<span className="text-gray-800">.ai</span></h1>
                <p className="text-gray-500 text-lg mt-1 font-medium">Smart Fertilizer Advisor Report</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-700">Date: {new Date().toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Target Crop: {formData.crop}</p>
              </div>
            </div>

            {/* Main AI Result Highlight */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 mb-8 border border-yellow-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-yellow-500 p-3 rounded-full text-white shadow-md">
                  <FaVial className="text-3xl" />
                </div>
                <div>
                  <p className="text-yellow-700 font-bold uppercase tracking-widest text-sm">Optimal Fertilizer</p>
                  <h2 className="text-4xl font-extrabold text-gray-900">{result.recommendedFertilizer}</h2>
                </div>
              </div>
              {result.reason && (
                <p className="text-gray-700 text-lg leading-relaxed italic border-l-4 border-yellow-400 pl-4 mt-4">
                  "{result.reason}"
                </p>
              )}
            </div>

            {/* Two Column Data Section */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Left Col: Farm Details */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                  <FaFlask className="text-blue-500" /> Soil Context
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex justify-between"><span className="text-gray-500">Soil Type</span> <span className="font-semibold text-gray-900">{formData.soilType}</span></li>
                  <li className="flex justify-between"><span className="text-gray-500">Growth Stage</span> <span className="font-semibold text-gray-900">{formData.growthStage}</span></li>
                  <li className="flex justify-between"><span className="text-gray-500">Nitrogen (N)</span> <span className="font-semibold text-gray-900">{formData.nitrogenLevel} kg/ha</span></li>
                  <li className="flex justify-between"><span className="text-gray-500">Phosphorus (P)</span> <span className="font-semibold text-gray-900">{formData.phosphorusLevel} kg/ha</span></li>
                  <li className="flex justify-between"><span className="text-gray-500">Potassium (K)</span> <span className="font-semibold text-gray-900">{formData.potassiumLevel} kg/ha</span></li>
                </ul>
              </div>

              {/* Right Col: Application Instructions */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-200 shadow-sm">
                <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2 border-b border-green-200 pb-2">
                  <FaSeedling className="text-green-600" /> Application Plan
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex justify-between"><span className="text-gray-600">Quantity Needed</span> <span className="font-bold text-gray-900">{result.quantity}</span></li>
                  <li className="flex justify-between"><span className="text-gray-600">Estimated Cost</span> <span className="font-bold text-red-600">{result.estimatedCost}</span></li>
                  <li className="flex flex-col mt-4">
                    <span className="text-gray-600 text-sm mb-1">Method & Frequency</span> 
                    <span className="font-semibold text-gray-900 leading-tight">{result.applicationMethod} ({result.frequency})</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Organic Alternatives */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Organic Alternatives</h3>
              <p className="text-gray-600 leading-relaxed">{result.organicAlternatives}</p>
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

export default FertilizerRecommendation;
