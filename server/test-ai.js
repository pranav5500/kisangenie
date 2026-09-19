import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

async function testModel(model) {
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: model,
      messages: [{ role: 'user', content: 'Hi' }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(`Model ${model} SUCCESS!`);
    return true;
  } catch (err) {
    console.error(`Model ${model} FAILED:`, err.response?.data?.error?.message || err.message);
    return false;
  }
}

async function run() {
  const models = [
    'openai/gpt-4o-mini',
    'google/gemini-pro-vision',
    'google/gemini-flash-1.5-8b'
  ];
  for (const m of models) {
    const success = await testModel(m);
    if (success) break;
  }
}
run();
