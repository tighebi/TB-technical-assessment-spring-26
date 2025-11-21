/**
 * Comments.tsx
 * ----------
 * Comment section component
 */
import { useState, useEffect } from 'react';
import { getUsername } from '../utils/username';
import './Comments.css';

interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: Date;
}

interface CommentsProps {
  pageId: string;
}

export default function Comments({ pageId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem(`comments-${pageId}`);
    return saved ? JSON.parse(saved).map((c: any) => ({
      ...c,
      timestamp: new Date(c.timestamp)
    })) : [];
  });
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    // Load username from storage
    const storedUsername = getUsername();
    if (storedUsername) {
      setAuthorName(storedUsername);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) {
      alert('Please enter both your name and a comment.');
      return;
    }

    const comment: Comment = {
      id: Date.now(),
      author: authorName,
      text: newComment,
      timestamp: new Date()
    };

    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`comments-${pageId}`, JSON.stringify(updatedComments));
    setNewComment('');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="comments-container">
      <h3 className="comments-title">Comments & Questions</h3>
      
      <form onSubmit={handleSubmit} className="comments-form">
        <div className="comments-form-row">
          <input
            type="text"
            placeholder="Your name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="comments-input comments-name-input"
            readOnly={!!getUsername()}
            style={getUsername() ? { 
              backgroundColor: 'rgba(201, 165, 112, 0.1)',
              cursor: 'default'
            } : {}}
          />
          {getUsername() && (
            <span style={{ 
              fontSize: '0.75rem', 
              color: 'rgba(44, 27, 16, 0.6)',
              marginTop: '0.25rem'
            }}>
              (Set on home page)
            </span>
          )}
        </div>
        <div className="comments-form-row">
          <textarea
            placeholder="Share your thoughts, ask questions, or provide feedback..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="comments-input comments-text-input"
            rows={4}
          />
        </div>
        <button type="submit" className="comments-submit">
          Post Comment
        </button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="comments-empty">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-date">{formatDate(comment.timestamp)}</span>
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

