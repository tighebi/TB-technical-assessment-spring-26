require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const commentRoutes = require('./routes/r_comments');
const voteRoutes = require('./routes/r_votes');

// Middleware
app.use(cors({
  origin: [
      "http://localhost:5173",
      "https://h4i-spring-26-tea-backend.onrender.com", 
      "https://tb-technical-assessment-spring-26-x.vercel.app"
  ],
  credentials: true
}));
app.use(express.json()); // Allow server to parse JSON bodies

app.use('/api/comments', commentRoutes);
app.use('/api/votes', voteRoutes);

// Database Connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected!'))
    .catch(err => {
      console.error('❌ MongoDB Connection Error:', err.message);
      console.log('⚠️  Server will continue running, but database features will not work.');
    });
} else {
  console.warn('⚠️  MONGODB_URI not set. Database features will not work.');
}

// Basic Route
app.get('/', (req, res) => {
  res.send('Tea Server is Live! 🍵');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

