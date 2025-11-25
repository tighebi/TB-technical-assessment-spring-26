const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  teaType: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Check if the model is already defined, otherwise create it
const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

module.exports = Comment;