import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { FaLeaf, FaUserCircle, FaBars, FaTimes, FaSignOutAlt, FaTachometerAlt, FaGlobe } from 'react-icons/fa';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const langRef = useRef(null);

  // Close dropdown when clicking outside and scrolling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };
    
    const handleScroll = () => {
      setIsProfileOpen(false);
      setIsLangOpen(false);
      setIsMobileMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleProfile = () => {
    if (!isProfileOpen) {
      setIsMobileMenuOpen(false);
      setIsLangOpen(false);
    }
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleMobileMenu = () => {
    if (!isMobileMenuOpen) {
      setIsProfileOpen(false);
      setIsLangOpen(false);
    }
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setIsLangOpen(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <FaLeaf className="h-8 w-8 text-green-600" />
              <span className="font-bold text-2xl text-green-800 tracking-tight">KisanGenie</span>
            </Link>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            
            {/* Auth & Profile */}
            <div className="flex items-center">
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={toggleProfile}
                    className="flex items-center gap-2 text-gray-700 hover:text-green-600 focus:outline-none"
                  >
                    {user?.photo ? (
                      <img src={user.photo} alt="Profile" className="h-8 w-8 rounded-full object-cover border border-gray-200 shadow-sm" />
                    ) : (
                      <FaUserCircle className="h-8 w-8 text-gray-400 hover:text-green-500 transition-colors" />
                    )}
                  </button>
                  
                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100 animate-fade-in-up origin-top-right">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link 
                        to="/dashboard" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                      >
                        <FaTachometerAlt /> {t('navbar.dashboard')}
                      </Link>
                      <button 
                        onClick={() => { logout(); setIsProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 text-left"
                      >
                        <FaSignOutAlt /> {t('navbar.logout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-4">
                  <Link to="/login" className="text-green-700 font-medium hover:text-green-800">{t('navbar.login')}</Link>
                  <Link to="/register" className="btn-primary py-2 px-4 text-sm rounded-lg shadow-md hover:shadow-lg transition-all">{t('navbar.signup')}</Link>
                </div>
              )}
            </div>

            {/* Universal Hamburger Button */}
            <button
              onClick={toggleMobileMenu}
              className="text-gray-500 hover:text-green-600 focus:outline-none p-2 ml-2"
            >
              {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Universal Hamburger Dropdown */}
      {isMobileMenuOpen && (
        <div className="bg-white border border-gray-200 shadow-xl animate-fade-in-up absolute right-4 md:right-8 top-16 w-56 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex flex-col gap-2">
             <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Language</span>
             <div className="flex gap-2">
               <button onClick={() => toggleLanguage('en')} className={`flex-1 py-1 rounded-md text-sm transition-colors ${i18n.language === 'en' ? 'bg-green-100 text-green-700 font-semibold' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>English</button>
               <button onClick={() => toggleLanguage('hi')} className={`flex-1 py-1 rounded-md text-sm transition-colors ${i18n.language === 'hi' ? 'bg-green-100 text-green-700 font-semibold' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>हिंदी</button>
             </div>
          </div>
          <div className="py-2">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50">{t('navbar.home')}</Link>
            <Link to="/features" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50">{t('navbar.features')}</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50">{t('navbar.about')}</Link>
          </div>
          
          {/* Mobile-only Auth & Profile (hidden on desktop since it's next to the hamburger) */}
          <div className="md:hidden">
            {user ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                {/* Profile info removed as it's now in the main navbar */}
                <div className="mt-3 px-2 space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50">{t('navbar.dashboard')}</Link>
                  <Link to="/fields" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50">Soil Monitoring</Link>
                  <Link to="/devices" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50">IoT Devices</Link>
                  <Link to="/chat" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50">AI Chatbot</Link>
                  <Link to="/disease" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50">Disease Detection</Link>
                  <Link to="/crop" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50">Crop Recommender</Link>
                  <Link to="/fertilizer" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50">Fertilizer Advisor</Link>
                  <Link to="/history" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50">History</Link>
                  <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50">Settings</Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">{t('navbar.logout')}</button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-200 px-5 flex flex-col gap-3">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center btn-secondary py-2">{t('navbar.login')}</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center btn-primary py-2">{t('navbar.signup')}</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
