// Votes API routes
const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');

if (!Vote || typeof Vote !== 'function') {
  console.error('Error: Vote model is not a constructor. Got:', typeof Vote, Vote);
}

router.get('/:questionId', async (req, res) => {
  try {
    const votes = await Vote.find({ questionId: req.params.questionId });
    res.json(votes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { userName, questionId, selectedOption } = req.body;
  try {
    const safeUser = userName ? userName.trim() : '';
    const safeQuestion = questionId ? questionId.trim() : '';
    if (!safeUser || !safeQuestion || !selectedOption) {
      return res.status(400).json({ message: 'userName, questionId, and selectedOption are required' });
    }
    const vote = await Vote.findOneAndUpdate(
      { userName: safeUser, questionId: safeQuestion },
      { $set: { selectedOption: selectedOption, timestamp: new Date() } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(vote);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate vote detected. This should not happen with proper indexing.' });
    }
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;