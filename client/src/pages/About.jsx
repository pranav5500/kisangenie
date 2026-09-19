import React from 'react';
import { FaGraduationCap, FaCode, FaServer, FaBrain } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <FaGraduationCap className="mx-auto h-16 w-16 text-green-600 mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">About KisanGenie</h1>
          <p className="mt-4 text-xl text-gray-500">
            A B.Tech Computer Science Final Year Major Project
          </p>
        </div>

        <div className="prose prose-lg prose-green mx-auto text-gray-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Problem</h2>
          <p className="mb-8">
            Traditional farming heavily relies on inherited knowledge and manual observation. When crops fail or diseases strike, farmers often lack immediate access to expert agricultural guidance, leading to reduced yields and financial losses. The gap between modern technology and grassroots farming needs to be bridged.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h2>
          <p className="mb-8">
            KisanGenie is an intelligent platform designed to democratize agricultural expertise. By harnessing the capabilities of Large Language Models (LLMs) and Vision AI, KisanGenie acts as a 24/7 agronomist in the farmer's pocket. It translates complex soil, weather, and image data into actionable, easy-to-understand advice.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Architecture & Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 not-prose">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center">
              <FaCode className="mx-auto h-8 w-8 text-blue-500 mb-3" />
              <h3 className="font-bold text-gray-900">Frontend</h3>
              <p className="text-sm text-gray-500 mt-2">React, Vite, TailwindCSS, React Router</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center">
              <FaServer className="mx-auto h-8 w-8 text-green-500 mb-3" />
              <h3 className="font-bold text-gray-900">Backend</h3>
              <p className="text-sm text-gray-500 mt-2">Node.js, Express, MongoDB Atlas, JWT</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center">
              <FaBrain className="mx-auto h-8 w-8 text-purple-500 mb-3" />
              <h3 className="font-bold text-gray-900">AI Integration</h3>
              <p className="text-sm text-gray-500 mt-2">OpenRouter API, Gemini Vision AI</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Future Scope</h2>
          <ul className="list-disc pl-5 space-y-2 mb-12">
            <li>IoT Sensor Integration for automated soil moisture and NPK tracking.</li>
            <li>Drone imagery analysis for massive scale farm management.</li>
            <li>E-commerce marketplace integration for purchasing recommended fertilizers directly.</li>
          </ul>

        </div>
      </div>
    </div>
  );
};

export default About;
