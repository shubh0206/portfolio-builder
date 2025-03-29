require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const integrationRoutes = require('./routes/integrations');

const app = express();

// Enhanced CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // List of allowed origins (add your frontend URLs here)
        const allowedOrigins = [
            'http://localhost',
            'http://127.0.0.1',
            'file://'
        ];
        
        if (allowedOrigins.includes(origin) || origin.includes('localhost')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'x-auth-token'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Increased payload limit
app.use(express.urlencoded({ extended: true }));

// Database connection with enhanced options
// Replace the current mongoose.connect() with this enhanced version
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio_db', {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  })
  .then(() => console.log('MongoDB connection established'))
  .catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  });
  
  // Add this connection status monitoring
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
  });
  
  // Add this error handler for unhandled promise rejections
  process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
  });