// server/src/server.ts
import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bright-futures-tutoring';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// server/src/app.ts
import express, { Express } from 'express';
import cors from 'cors';
import passport from 'passport';
import path from 'path';

// Import routes
import authRoutes from './routes/auth.routes';
import bookingRoutes from './routes/booking.routes';
import paymentRoutes from './routes/payment.routes';
import tutorRoutes from './routes/tutor.routes';
import userRoutes from './routes/user.routes';
import testimonialRoutes from './routes/testimonial.routes';

// Import middleware
import errorMiddleware from './middleware/error.middleware';

// Initialize Express app
const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

// Passport config
import './config/passport';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/users', userRoutes);
app.use('/api/testimonials', testimonialRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use(errorMiddleware);

export default app;

// server/tsconfig.json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}

// server/package.json
{
  "name": "bright-futures-tutoring-server",
  "version": "1.0.0",
  "description": "Backend server for Bright Futures Tutoring",
  "main": "dist/server.js",
  "scripts": {
    "start": "node dist/server.js",
    "dev": "concurrently \"npx tsc --watch\" \"nodemon -q dist/server.js\"",
    "build": "tsc",
    "lint": "eslint . --ext .ts"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.0.3",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.1",
    "stripe": "^12.0.0",
    "validator": "^13.9.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.2",
    "@types/cors": "^2.8.13",
    "@types/express": "^4.17.17",
    "@types/jsonwebtoken": "^9.0.1",
    "@types/node": "^18.15.11",
    "@types/passport": "^1.0.12",
    "@types/passport-jwt": "^3.0.8",
    "@types/validator": "^13.7.14",
    "@typescript-eslint/eslint-plugin": "^5.57.1",
    "@typescript-eslint/parser": "^5.57.1",
    "concurrently": "^8.0.1",
    "eslint": "^8.38.0",
    "nodemon": "^2.0.22",
    "typescript": "^5.0.4"
  }
}