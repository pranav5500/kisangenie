import { generateChatResponse } from './services/openRouterService.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

async function test() {
  try {
    const res = await generateChatResponse([{ role: 'user', content: 'Hello' }]);
    console.log('SUCCESS:', res);
  } catch (err) {
    console.error('ERROR MSG:', err.message);
  }
}
test();
