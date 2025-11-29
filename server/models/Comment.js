// Comment model
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  teaType: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
module.exports = Comment;