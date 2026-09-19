import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { FaPaperPlane, FaRobot, FaUser, FaTrash, FaMicrophone, FaCamera, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Chat = () => {
  const { i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/chat/history');
      if (data.length > 0) {
        setMessages(data[0].messages);
        setChatId(data[0]._id);
      }
    } catch (error) {
      console.error('Failed to load chat history', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice input is not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file.');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // Get base64 string without data:image/jpeg;base64, prefix
          const base64String = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
          resolve(base64String);
        };
      };
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() && !imageFile) return;

    let base64Image = null;
    let tempPreview = null;
    if (imageFile) {
      base64Image = await compressImage(imageFile);
      tempPreview = imagePreview; // Store preview before clearing
    }

    const userMsg = { role: 'user', content: input || 'Please analyze this image.', image: base64Image, preview: tempPreview };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
    setLoading(true);

    try {
      const { data } = await api.post('/chat', { message: userMsg.content, image: base64Image, chatId, language: i18n.language });
      setMessages(data.messages);
      setChatId(data._id);
    } catch (error) {
      toast.error(`Failed: ${error.message || 'Unknown'}`);
      console.error('CHAT API ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    if (!chatId) return;
    try {
      await api.delete(`/chat/${chatId}`);
      setMessages([]);
      setChatId(null);
      toast.success('Chat cleared');
    } catch (error) {
      toast.error('Failed to clear chat');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white relative">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaRobot className="text-green-600" /> KisanGenie AI
          </h2>
          <p className="text-sm text-gray-500">Your agricultural expert</p>
        </div>
        <button onClick={clearChat} className="text-red-500 hover:text-red-700 flex items-center gap-2 text-sm font-medium">
          <FaTrash /> Clear Chat
        </button>
      </div>

      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-gray-50">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <FaRobot className="text-6xl mb-4 opacity-50" />
            <p>Ask me anything about farming, crops, or plant diseases!</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-green-600 text-white rounded-br-none' 
                : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
            }`}>
              <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                {msg.role === 'user' ? <><FaUser /> You</> : <><FaRobot /> KisanGenie</>}
              </div>
              {(msg.image || msg.preview) && (
                <img 
                  src={msg.preview || `data:image/jpeg;base64,${msg.image}`} 
                  alt="Uploaded" 
                  className="max-w-xs rounded-xl mb-3 shadow-sm border border-gray-200" 
                />
              )}
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-2 text-gray-500">
              <FaRobot className="animate-pulse text-green-600" /> AI is thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex flex-col gap-3">
          
          {/* Image Preview Area */}
          {imagePreview && (
            <div className="relative inline-block w-fit">
              <img src={imagePreview} alt="Preview" className="h-24 rounded-lg shadow-sm border border-gray-200 object-cover" />
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null); if(fileInputRef.current) fileInputRef.current.value=''; }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
              >
                <FaTimes size={12} />
              </button>
            </div>
          )}

          <div className="flex gap-2 items-center">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-xl flex items-center justify-center transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 shrink-0"
              title="Upload Image"
            >
              <FaCamera />
            </button>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden" 
            />

            <button 
              type="button"
              onClick={handleSpeech}
              className={`p-3 sm:p-4 rounded-full flex items-center justify-center transition-all shadow-md transform hover:scale-105 shrink-0 ${isListening ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-200' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
              title="Voice Input (Speak instead of type)"
            >
              <FaMicrophone className="text-xl sm:text-2xl" />
            </button>
            
            <input
              type="text"
              className="input-field flex-1 py-3"
              placeholder="Ask a question or upload a photo of a diseased plant..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            
            <button 
              type="submit" 
              disabled={loading || (!input.trim() && !imageFile)} 
              className="btn-primary flex items-center justify-center gap-2 px-4 sm:px-8 py-3 h-full rounded-xl shrink-0"
            >
              <span className="hidden sm:inline">Send</span> <FaPaperPlane />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
