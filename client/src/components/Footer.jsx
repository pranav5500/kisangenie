import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <FaLeaf className="text-green-500 text-2xl" />
              <span className="text-xl font-bold text-white tracking-tight">KisanGenie</span>
            </Link>
            <p className="text-sm text-gray-400 mb-6">
              Empowering farmers with AI-driven insights for better yields, smarter decisions, and sustainable agriculture across India.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors"><FaTwitter className="text-xl" /></a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors"><FaFacebook className="text-xl" /></a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors"><FaInstagram className="text-xl" /></a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors"><FaLinkedin className="text-xl" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-green-400 transition-colors text-sm">Home</Link></li>
              <li><Link to="/about" className="hover:text-green-400 transition-colors text-sm">About Us</Link></li>
              <li><Link to="/features" className="hover:text-green-400 transition-colors text-sm">Features</Link></li>
              <li><Link to="/dashboard" className="hover:text-green-400 transition-colors text-sm">Dashboard</Link></li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Legal & Policies</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy-policy" className="hover:text-green-400 transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-green-400 transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="hover:text-green-400 transition-colors text-sm">Refund Policy</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-green-400 transition-colors text-sm">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex flex-col">
                <span className="text-gray-500 text-xs">Email</span>
                <a href="mailto:support@kisangenie.in" className="hover:text-green-400 transition-colors">support@kisangenie.in</a>
              </li>
              <li className="flex flex-col mt-2">
                <span className="text-gray-500 text-xs">Phone</span>
                <a href="tel:+919876543210" className="hover:text-green-400 transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex flex-col mt-2">
                <span className="text-gray-500 text-xs">Office</span>
                <span>123 Agritech Park, Bangalore, Karnataka 560001, India</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} KisanGenie Technologies Pvt Ltd. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with ❤️ for Indian Farmers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
