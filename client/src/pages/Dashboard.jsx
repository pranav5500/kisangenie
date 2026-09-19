import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { FaTemperatureHigh, FaWind, FaTint, FaRobot, FaLeaf } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    const fetchWeatherByCoords = async (lat, lon) => {
      try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        setWeather(res.data);
      } catch (error) {
        console.error('Error fetching weather by coords:', error);
      } finally {
        setLoadingWeather(false);
      }
    };

    const fetchWeatherByCity = async (city) => {
      try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        setWeather(res.data);
      } catch (error) {
        console.error('Error fetching weather by city:', error);
      } finally {
        setLoadingWeather(false);
      }
    };

    if (user) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.warn('Geolocation denied or failed, falling back to default city.');
            // Fallback to user's registered district or Bihar if geolocation fails
            fetchWeatherByCity(user?.district || 'Patna, Bihar');
          }
        );
      } else {
        fetchWeatherByCity(user?.district || 'Patna, Bihar');
      }
    }
  }, [user]);

  return (
    <div className="p-4 md:p-6 w-full">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome, {user?.name || 'Farmer'}!</h1>
      <p className="text-gray-500 mt-2">Here is your smart farming overview.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        
        {/* Weather Widget */}
        <div className="glass-card p-6 border-l-4 border-l-blue-500">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Local Weather</h3>
          {loadingWeather ? (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : weather ? (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{Math.round(weather.main.temp)}°C</p>
                  <p className="text-gray-500 capitalize">{weather.weather[0].description}</p>
                  <p className="text-sm font-medium text-blue-600 mt-1">{weather.name}</p>
                </div>
                <img 
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                  alt="weather icon"
                  className="w-20 h-20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaTint className="text-blue-400" />
                  <span className="text-sm">{weather.main.humidity}% Humidity</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaWind className="text-gray-400" />
                  <span className="text-sm">{weather.wind.speed} m/s Wind</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Could not load weather data.</p>
          )}
        </div>

        {/* AI Chat Bot */}
        <Link to="/chat" className="flex flex-col items-center justify-center p-8 bg-green-600 rounded-2xl shadow-lg hover:bg-green-700 transition-colors text-white group relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          <FaRobot className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-md" />
          <h3 className="text-2xl font-bold tracking-tight text-center">Ask AI Expert</h3>
          <p className="mt-3 text-green-100 text-center text-sm sm:text-base font-medium">Have a farming question? Speak to our AI assistant in your language.</p>
          <div className="mt-6 flex items-center gap-2 text-white font-bold bg-green-800/40 px-4 py-2 rounded-full">
            Start Chat &rarr;
          </div>
        </Link>
        
        {/* Disease Detection */}
        <Link to="/disease" className="flex flex-col items-center justify-center p-8 bg-yellow-500 rounded-2xl shadow-lg hover:bg-yellow-600 transition-colors text-white group relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          <FaLeaf className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-md" />
          <h3 className="text-2xl font-bold tracking-tight text-center">Scan Crop Disease</h3>
          <p className="mt-3 text-yellow-50 text-center text-sm sm:text-base font-medium">Upload a photo of a sick plant to instantly get the cure.</p>
          <div className="mt-6 flex items-center gap-2 text-white font-bold bg-yellow-700/40 px-4 py-2 rounded-full">
            Open Camera &rarr;
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
