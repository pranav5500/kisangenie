import axios from 'axios';

const openRouterClient = axios.create();

openRouterClient.interceptors.request.use((config) => {
  config.baseURL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
  config.headers['Authorization'] = `Bearer ${process.env.OPENROUTER_API_KEY}`;
  config.headers['HTTP-Referer'] = process.env.CLIENT_URL || 'http://localhost:5173';
  config.headers['X-Title'] = 'KisanGenie';
  config.headers['Content-Type'] = 'application/json';
  return config;
});

// Using GPT-4o-mini for blazing fast responses and vision support
const defaultModel = 'openai/gpt-4o-mini';
const visionModel = 'openai/gpt-4o-mini';

export const generateChatResponse = async (messages, systemPrompt = '') => {
  try {
    const formattedMessages = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages;

    const response = await openRouterClient.post('/chat/completions', {
      model: defaultModel,
      messages: formattedMessages,
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate response from AI');
  }
};

export const analyzeImage = async (base64Image, prompt) => {
  try {
    const response = await openRouterClient.post('/chat/completions', {
      model: visionModel,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' }, // Enforce JSON if model supports
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter Vision API Error:', error.response?.data || error.message);
    throw new Error('Failed to analyze image with AI');
  }
};
