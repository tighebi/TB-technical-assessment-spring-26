// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Import route handlers for comments and votes
const commentRoutes = require('./routes/r_comments');
const voteRoutes = require('./routes/r_votes');

// Configure CORS to allow requests from frontend origins
// This enables the frontend to make API calls to this server
app.use(cors({
  origin: [
    "http://localhost:5173", // Local development server
    "https://h4i-spring-26-tea-backend.onrender.com", // Render backend
    "https://tb-technical-assessment-spring-26-x.vercel.app" // Vercel frontend
  ],
  credentials: true
}));

// Middleware to parse JSON request bodies
// Allows the server to read JSON data sent in POST/PUT requests
app.use(express.json());

// Mount route handlers
// All requests to /api/comments will be handled by commentRoutes
// All requests to /api/votes will be handled by voteRoutes
app.use('/api/comments', commentRoutes);
app.use('/api/votes', voteRoutes);

// Connect to MongoDB database
// The connection string is stored in the MONGODB_URI environment variable
// If connection fails, the server will continue running but database features won't work
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
      console.error('MongoDB Connection Error:', err.message);
      console.log('Server will continue running, but database features will not work.');
    });
} else {
  console.warn('MONGODB_URI not set. Database features will not work.');
}

// Basic health check route
// Returns a simple message to confirm the server is running
app.get('/', (req, res) => {
  res.send('Tea Server is Live');
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

