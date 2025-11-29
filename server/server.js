// Express server for tea education app API
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const commentRoutes = require('./routes/r_comments');
const voteRoutes = require('./routes/r_votes');

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://h4i-spring-26-tea-backend.onrender.com",
    "https://tb-technical-assessment-spring-26-x.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use('/api/comments', commentRoutes);
app.use('/api/votes', voteRoutes);

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

app.get('/', (req, res) => {
  res.send('Tea Server is Live');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

