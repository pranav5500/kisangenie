import Chat from '../models/Chat.js';
import { generateChatResponse } from '../services/openRouterService.js';

const SYSTEM_PROMPT = `You are KisanGenie AI, a highly knowledgeable, exhaustive, and professional agriculture expert assistant. 
Your primary goal is to help farmers with crop cultivation, fertilizers, plant diseases, pest management, organic farming, government schemes, weather precautions, and modern farming techniques.
IMPORTANT RULES:
1. EXHAUSTIVE ACCURACY: You must act as if you are searching every possible agricultural database, browser, and dataset to provide the absolute most accurate and comprehensive answers. Double-check all plant names, disease symptoms, and fertilizer chemical compositions before answering.
2. Answer ONLY agriculture-related questions. If a user asks a non-agricultural question, politely reply: "I am KisanGenie AI and can only assist with agriculture-related topics."
3. Provide incredibly detailed, practical, and localized information, leaving no stone unturned in your recommendations.
4. Explain in simple, easy-to-understand language for farmers.
5. DO NOT use ANY Markdown formatting. DO NOT use asterisks (*) for bolding or hashes (#) for headers. Use plain text, spacing, and numbered lists (1., 2.) only.
6. IF AN IMAGE IS UPLOADED: You MUST perform a deep, exhaustive visual analysis. DO NOT hallucinate or provide a generic list of common diseases. Accurately identify the specific plant by name. Accurately diagnose the specific disease visible, and explain exactly why. Provide a highly specific, actionable, and accurate treatment and fertilizer plan.`;

// @desc    Send a message to the chatbot
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { message, image, chatId, language } = req.body;

    if (!message && !image) {
      return res.status(400).json({ message: 'Message or image is required' });
    }

    let chat;
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, user: req.user._id });
      if (!chat) return res.status(404).json({ message: 'Chat not found' });
    } else {
      chat = new Chat({
        user: req.user._id,
        title: message ? message.substring(0, 30) + '...' : 'Image Analysis',
        messages: [],
      });
    }

    // Add user message to history
    const userMsg = { role: 'user', content: message || 'Please analyze this image.', image };
    chat.messages.push(userMsg);

    // Prepare messages for AI
    const apiMessages = chat.messages.map((m) => {
      if (m.image) {
        return {
          role: m.role,
          content: [
            { type: 'text', text: m.content },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${m.image}` } }
          ]
        };
      }
      return {
        role: m.role,
        content: m.content,
      };
    });

    // Generate AI response
    const dynamicPrompt = `${SYSTEM_PROMPT}\nCRITICAL INSTRUCTION: The requested language is '${language || 'en'}'. If the requested language is 'en', you MUST reply entirely in English. If the requested language is 'hi', you MUST reply strictly in pure Hindi (Devanagari script), NEVER use Hinglish. DO NOT use ANY asterisks (*) or markdown formatting.`;
    const aiResponseRaw = await generateChatResponse(apiMessages, dynamicPrompt);
    const aiResponse = aiResponseRaw.replace(/[*#]/g, '');

    // Add assistant response to history
    chat.messages.push({ role: 'assistant', content: aiResponse });

    await chat.save();

    res.json(chat);
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get chat history
// @route   GET /api/chat/history
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a specific chat
// @route   DELETE /api/chat/:id
// @access  Private
const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json({ message: 'Chat removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export { sendMessage, getChatHistory, deleteChat };
