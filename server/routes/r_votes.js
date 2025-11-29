/**
 * Votes Route Handler
 * 
 * Handles HTTP requests for voting functionality.
 * Routes:
 * - GET /:questionId - Retrieve all votes for a specific question
 * - POST / - Create or update a vote for a question
 */

const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');

// Validate that Vote model is properly loaded
// This check ensures the model is a constructor function before use
if (!Vote || typeof Vote !== 'function') {
  console.error('Error: Vote model is not a constructor. Got:', typeof Vote, Vote);
}

/**
 * GET /:questionId
 * 
 * Retrieves all votes for a specific quiz question.
 * The frontend will aggregate this data to show vote counts and percentages.
 * 
 * @param {string} questionId - The unique identifier for the question (e.g., 'green-q1')
 * @returns {Array} Array of vote objects containing userName, selectedOption, and timestamp
 */
router.get('/:questionId', async (req, res) => {
  try {
    // Find all votes matching the question ID
    // Note: Aggregation could be done here for better performance, but keeping it simple
    const votes = await Vote.find({ questionId: req.params.questionId });
    res.json(votes); 
  } catch (err) {
    // Return 500 error if database query fails
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /
 * 
 * Creates a new vote or updates an existing vote if the user has already voted.
 * Uses findOneAndUpdate with upsert to atomically handle both cases in a single operation.
 * This prevents duplicate votes from the same user for the same question.
 * 
 * Request body should contain:
 * - userName: string - Name of the user casting the vote
 * - questionId: string - The unique identifier for the question
 * - selectedOption: string - The option selected (e.g., 'A', 'B', 'C', 'D')
 * 
 * @returns {Object} The saved or updated vote object
 */
router.post('/', async (req, res) => {
  const { userName, questionId, selectedOption } = req.body;

  try {
    // Sanitize inputs to ensure consistency
    // Trim whitespace to prevent duplicate votes due to minor input differences
    const safeUser = userName ? userName.trim() : '';
    const safeQuestion = questionId ? questionId.trim() : '';
    
    // Validate that required fields are present after sanitization
    if (!safeUser || !safeQuestion || !selectedOption) {
      return res.status(400).json({ message: 'userName, questionId, and selectedOption are required' });
    }

    // findOneAndUpdate with upsert: true performs an atomic operation:
    // 1. Searches for a vote matching both userName AND questionId
    // 2. If found: Updates the selectedOption and timestamp using $set operator
    // 3. If not found: Creates a new vote document (because of upsert: true)
    // $set ensures we only update specific fields without overwriting the entire document
    // new: true means return the updated/new document, not the old one
    // setDefaultsOnInsert: true ensures default values (like timestamp) are set on new documents
    const vote = await Vote.findOneAndUpdate(
      { userName: safeUser, questionId: safeQuestion },
      { 
        $set: { 
          selectedOption: selectedOption, 
          timestamp: new Date() 
        }
      },
      { 
        new: true,              // Return the updated/new document
        upsert: true,           // Create if it doesn't exist
        setDefaultsOnInsert: true  // Apply schema defaults when creating new document
      }
    );

    // Return 201 Created status (works for both new and updated votes)
    res.status(201).json(vote);
  } catch (err) {
    // Handle duplicate key error (E11000) specifically
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: 'Duplicate vote detected. This should not happen with proper indexing.' 
      });
    }
    // Return 400 Bad Request if validation fails or save fails
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;