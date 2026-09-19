import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import compression from 'compression';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import diseaseRoutes from './routes/diseaseRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import fertilizerRoutes from './routes/fertilizerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import iotRoutes from './routes/iotRoutes.js';

dotenv.config({ path: '../.env' });

const app = express();

// Middlewares
app.use(express.json({ limit: '10mb' })); // Limit body size for image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true,
}));

// Set security HTTP headers
app.use(helmet());



// Compress all responses
app.use(compression());

// Development logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Global Rate Limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, 
  legacyHeaders: false,
});

// Apply the rate limiting middleware to API calls only
app.use('/api/', apiLimiter);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('KisanGenie API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/fertilizer', fertilizerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/iot', iotRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // Any route that is not an API route will be redirected to React's index.html
  app.get(/.*/, (req, res) =>
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'))
  );
} else {
  // 404 handler for API routes in development
  app.use((req, res, next) => {
    res.status(404).json({ message: 'API Route Not Found' });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

export default app;
