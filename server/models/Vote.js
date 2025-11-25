const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  questionId: { type: String, required: true },
  selectedOption: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Vote = mongoose.models.Vote || mongoose.model('Vote', VoteSchema);

module.exports = Vote;