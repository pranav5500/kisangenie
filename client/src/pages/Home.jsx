import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaRobot, FaLeaf, FaSeedling, FaArrowRight, FaChartLine, FaCloudSun, FaUserCircle, FaMobileAlt, FaMicrochip, FaTractor, FaHistory } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-['Inter']">
      
      {/* Immersive Hero Section */}
      <div className="relative min-h-[60vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden py-12 md:py-0">
        {/* Full Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.png"
            alt="Futuristic Smart Farm"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/90"></div>
        </div>

        {/* Floating UI Elements (Glassmorphism) */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0, y: [0, -15, 0] }}
          transition={{ duration: 0.8, y: { repeat: Infinity, duration: 5, ease: "easeInOut" } }}
          className="absolute top-1/4 left-10 hidden xl:flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl z-10"
        >
          <div className="bg-green-500 p-3 rounded-full"><FaChartLine className="text-white text-xl" /></div>
          <div>
            <p className="text-white font-bold">Yield Prediction</p>
            <p className="text-green-300 text-sm">+42% Optimization</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0, y: [0, 15, 0] }}
          transition={{ duration: 0.8, delay: 0.2, y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
          className="absolute bottom-1/4 right-10 hidden xl:flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl z-10"
        >
          <div className="bg-blue-500 p-3 rounded-full"><FaCloudSun className="text-white text-xl" /></div>
          <div>
            <p className="text-white font-bold">Micro-Climate</p>
            <p className="text-blue-200 text-sm">Real-time sync active</p>
          </div>
        </motion.div>

        {/* Main Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-8 md:mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-sm font-semibold tracking-widest uppercase mb-6 backdrop-blur-sm">
              AI-Powered Agriculture
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 sm:mb-8 leading-tight">
              {t('home.hero_title_1')} <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                {t('home.hero_title_2')}
              </span>
            </h1>
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-8 sm:mb-10 font-light leading-relaxed">
              {t('home.hero_subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              {user ? (
                <Link to="/dashboard" className="group relative w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white transition-all duration-200 bg-green-600 font-pj rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 shadow-[0_0_40px_rgba(22,163,74,0.4)] hover:shadow-[0_0_60px_rgba(22,163,74,0.6)]">
                  Go to Dashboard
                  <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                <Link to="/register" className="group relative w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white transition-all duration-200 bg-green-600 font-pj rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 shadow-[0_0_40px_rgba(22,163,74,0.4)] hover:shadow-[0_0_60px_rgba(22,163,74,0.6)]">
                  {t('home.get_started')}
                  <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/features" className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white transition-all duration-200 bg-white/10 border border-white/20 backdrop-blur-md rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20">
                  {t('home.learn_more')}
                </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 z-20"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1.5 h-3 bg-white/50 rounded-full"></div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-12 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to grow
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Leverage the power of cutting-edge Vision AI, Large Language Models, and real-time IoT sensors to transform your agricultural practices.
            </p>
          </div>

          <div className="mt-10 md:mt-20">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              
              {/* Feature 1 */}
              <Link to="/chat" className="pt-6 group block h-full">
                <div className="flow-root bg-white rounded-xl px-6 pb-8 shadow-sm group-hover:shadow-xl transition-all duration-300 border border-gray-100 h-full group-hover:-translate-y-1">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                        <FaRobot className="h-8 w-8 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-xl font-bold text-gray-900 tracking-tight">AI Chatbot</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Got a question about farming? Ask KisanGenie! Our AI understands complex agricultural scenarios and provides instant, expert advice.
                    </p>
                  </div>
                </div>
              </Link>

              {/* Feature 2 */}
              <Link to="/disease" className="pt-6 group block h-full">
                <div className="flow-root bg-white rounded-xl px-6 pb-8 shadow-sm group-hover:shadow-xl transition-all duration-300 border border-gray-100 h-full group-hover:-translate-y-1">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                        <FaLeaf className="h-8 w-8 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-xl font-bold text-gray-900 tracking-tight">Disease Detection</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Upload an image of a diseased leaf and our Vision AI will instantly diagnose the issue, providing exact organic and chemical treatments.
                    </p>
                  </div>
                </div>
              </Link>

              {/* Feature 3 */}
              <Link to="/crop" className="pt-6 group block h-full">
                <div className="flow-root bg-white rounded-xl px-6 pb-8 shadow-sm group-hover:shadow-xl transition-all duration-300 border border-gray-100 h-full group-hover:-translate-y-1">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                        <FaSeedling className="h-8 w-8 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-xl font-bold text-gray-900 tracking-tight">Crop Recommender</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Input your soil pH, rainfall, and climate data to receive highly optimized crop recommendations designed to maximize your profit.
                    </p>
                  </div>
                </div>
              </Link>

              {/* Feature 4 */}
              <Link to="/fertilizer" className="pt-6 group block h-full">
                <div className="flow-root bg-white rounded-xl px-6 pb-8 shadow-sm group-hover:shadow-xl transition-all duration-300 border border-gray-100 h-full group-hover:-translate-y-1">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl shadow-lg">
                        <FaSeedling className="h-8 w-8 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-xl font-bold text-gray-900 tracking-tight">Fertilizer Advisor</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Get smart, AI-driven precision fertilizer recommendations based on your soil NPK levels and target crop to boost your yield safely.
                    </p>
                  </div>
                </div>
              </Link>

            </div>
          </div>
        </div>
      </div>



      {/* How It Works Section */}
      <div className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{t('home.how_it_works')}</h2>
          </div>
          <div className="relative">
            {/* Connecting line (hidden on mobile) */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-200" aria-hidden="true"></div>
            
            <div className="flex flex-col md:flex-row justify-between relative gap-6 md:gap-4">
              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center max-w-xs mx-auto">
                <div className="flex items-center justify-center h-20 w-20 md:h-24 md:w-24 rounded-full bg-green-100 border-4 border-white shadow-lg mb-3 md:mb-6 z-10">
                  <FaUserCircle className="h-8 w-8 md:h-10 md:w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">1. {t('home.step_1')}</h3>
                <p className="text-gray-600 text-sm md:text-base">{t('home.step_1_desc')}</p>
              </div>
              
              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center max-w-xs mx-auto">
                <div className="flex items-center justify-center h-20 w-20 md:h-24 md:w-24 rounded-full bg-green-100 border-4 border-white shadow-lg mb-3 md:mb-6 z-10">
                  <FaMobileAlt className="h-8 w-8 md:h-10 md:w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">2. {t('home.step_2')}</h3>
                <p className="text-gray-600 text-sm md:text-base">{t('home.step_2_desc')}</p>
              </div>
              
              {/* Step 3 */}
              <div className="relative flex flex-col items-center text-center max-w-xs mx-auto">
                <div className="flex items-center justify-center h-20 w-20 md:h-24 md:w-24 rounded-full bg-green-100 border-4 border-white shadow-lg mb-3 md:mb-6 z-10">
                  <FaChartLine className="h-8 w-8 md:h-10 md:w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">3. {t('home.step_3')}</h3>
                <p className="text-gray-600 text-sm md:text-base">{t('home.step_3_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">{t('home.testimonials')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">R</div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">{t('home.test_1_name')}</h4>
                  <p className="text-sm text-gray-500">{t('home.test_1_role')}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"{t('home.test_1_text')}"</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">S</div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">{t('home.test_2_name')}</h4>
                  <p className="text-sm text-gray-500">{t('home.test_2_role')}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"{t('home.test_2_text')}"</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">A</div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">{t('home.test_3_name')}</h4>
                  <p className="text-sm text-gray-500">{t('home.test_3_role')}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"{t('home.test_3_text')}"</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">{t('home.ready')}</span>
            <span className="block text-green-200">{t('home.join')}</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow w-full sm:w-auto">
              <Link to="/register" className="w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50">
                {t('home.get_started')}
              </Link>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Home;
