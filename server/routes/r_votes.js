const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');

// Validate that Vote is a constructor
if (!Vote || typeof Vote !== 'function') {
  console.error('❌ Error: Vote model is not a constructor. Got:', typeof Vote, Vote);
}

// GET results for a question (Count + Names)
router.get('/:questionId', async (req, res) => {
  try {
    const votes = await Vote.find({ questionId: req.params.questionId });
    
    // Aggregating data for the frontend
    // You can do this more efficiently with MongoDB aggregation, but this is simpler for now
    res.json(votes); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST (Cast a vote)
router.post('/', async (req, res) => {
  const { userName, questionId, selectedOption } = req.body;

  try {
    // Check if user already voted (Optional logic)
    // For now, let's just save the vote
    const newVote = new Vote({ userName, questionId, selectedOption });
    await newVote.save();
    res.status(201).json(newVote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;