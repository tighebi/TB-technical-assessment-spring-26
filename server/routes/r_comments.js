const express = require('express');
const router = express.Router();

const Comment = require('../models/Comment');

// Validate that Comment is a constructor
if (!Comment || typeof Comment !== 'function') {
  console.error('❌ Error: Comment model is not a constructor. Got:', typeof Comment, Comment);
}

// GET all comments for a specific tea
router.get('/:teaType', async (req, res) => {
  try {
    const comments = await Comment.find({ teaType: req.params.teaType }).sort({ timestamp: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new comment
router.post('/', async (req, res) => {
  const { userName, teaType, text } = req.body;
  
  const newComment = new Comment({
    userName,
    teaType,
    text
  });

  try {
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;