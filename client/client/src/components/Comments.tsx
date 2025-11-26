/**
 * Comments.tsx
 * ----------
 * Comment section component
 */
import { useState, useEffect } from 'react';
import { getUsername } from '../utils/username';
import API_BASE from '../utils/api';
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
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUsername = getUsername();
    if (storedUsername) {
      setAuthorName(storedUsername);
    }
  }, []);

  // Fetch comments from API when pageId changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/comments/${pageId}`);
        if (response.ok) {
          const data = await response.json();
          // Map API response to Comment interface
          const mappedComments: Comment[] = data.map((c: any) => ({
            id: c._id || Date.now(),
            author: c.userName,
            text: c.text,
            timestamp: new Date(c.timestamp)
          }));
          setComments(mappedComments);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
    setNewComment(''); // Clear input when switching pages
  }, [pageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) {
      alert('Please enter both your name and a comment.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userName: authorName, 
          teaType: pageId, 
          text: newComment 
        })
      });

      if (response.ok) {
        const savedComment = await response.json();
        // Add new comment to front of array (newest first)
        const newCommentObj: Comment = {
          id: savedComment._id || Date.now(),
          author: savedComment.userName,
          text: savedComment.text,
          timestamp: new Date(savedComment.timestamp)
        };
        setComments([newCommentObj, ...comments]);
        setNewComment('');
      } else {
        console.error("Error posting comment:", await response.text());
        alert('Failed to post comment. Please try again.');
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      alert('Failed to post comment. Please try again.');
    }
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
        {loading ? (
          <p className="comments-empty">Loading comments...</p>
        ) : comments.length === 0 ? (
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

