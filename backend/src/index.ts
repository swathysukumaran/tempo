import express from 'express';
import http from 'http';
import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
require('dotenv').config();
const app=express();
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(compression());



const server=http.createServer(app);

const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

const MONGO_URL=process.env.MONGO_URI;

mongoose.Promise=Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error',(error:Error)=>{console.log(error);});

app.use(bodyparser.json({ limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// Increase URL-encoded payload size limit
app.use(bodyparser.urlencoded({ 
  limit: '50mb', 
  extended: true 
}));
app.use('/',router());
app.use((req, res) => {
  console.log('🔥 Unmatched route:', req.method, req.path);
  res.status(404).json({ error: 'Route not found' });
});