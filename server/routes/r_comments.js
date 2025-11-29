/**
 * Comments Route Handler
 * 
 * Handles HTTP requests for comments functionality.
 * Routes:
 * - GET /:teaType - Retrieve all comments for a specific tea type
 * - POST / - Create a new comment
 */

const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Validate that Comment model is properly loaded
// This check ensures the model is a constructor function before use
if (!Comment || typeof Comment !== 'function') {
  console.error('Error: Comment model is not a constructor. Got:', typeof Comment, Comment);
}

/**
 * GET /:teaType
 * 
 * Retrieves all comments for a specific tea type.
 * Comments are sorted by timestamp in descending order (newest first).
 * 
 * @param {string} teaType - The tea type identifier (e.g., 'green', 'oolong')
 * @returns {Array} Array of comment objects
 */
router.get('/:teaType', async (req, res) => {
  try {
    // Find all comments matching the tea type and sort by timestamp (newest first)
    const comments = await Comment.find({ teaType: req.params.teaType }).sort({ timestamp: -1 });
    res.json(comments);
  } catch (err) {
    // Return 500 error if database query fails
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /
 * 
 * Creates a new comment and saves it to the database.
 * 
 * Request body should contain:
 * - userName: string - Name of the user posting the comment
 * - teaType: string - The tea type this comment is for
 * - text: string - The comment text content
 * 
 * @returns {Object} The saved comment object with generated ID and timestamp
 */
router.post('/', async (req, res) => {
  const { userName, teaType, text } = req.body;
  
  // Create a new Comment instance with the provided data
  const newComment = new Comment({
    userName,
    teaType,
    text
  });

  try {
    // Save the comment to the database
    const savedComment = await newComment.save();
    // Return 201 Created status with the saved comment
    res.status(201).json(savedComment);
  } catch (err) {
    // Return 400 Bad Request if validation fails or save fails
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;