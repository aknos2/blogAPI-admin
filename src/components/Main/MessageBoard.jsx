import { useEffect, useState, useCallback } from 'react';
import './messageBoard.css';
import profileImg from '/assets/corgi/profile/white-cat-icon.png';
import { CloseIcon, SendMsgIcon } from '../Icons';
import Button from '../Button';
import { createComment, deleteComment, fetchCommentsByPostId } from '../../../api/posts';
import { useAuth } from '../../context/useAuthContext';

function MessageBoard({ isChatOpen, onToggleChat, postId }) {
  const [message, setMessage] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginMessage, setLoginMessage] = useState('');

  const { isAuthenticated, user, setIsAuthenticated, setUser } = useAuth();

  // Load comments for current post
  useEffect(() => {
    async function loadComments() {
      try {
        const res = await fetchCommentsByPostId(postId);
        setComments(res.data);
      } catch (err) {
        console.error('Failed to fetch comments:', err);
      } finally {
        setLoading(false);
      }
    }
    if (postId) {
      loadComments();
    }
  }, [postId]);

  // Debugging: log first comment & user
  useEffect(() => {
    if (comments.length > 0 && user) {
      console.log('Sample comment:', comments[0]);
      console.log('Current user:', user);
      console.log('User role type:', typeof user.role, user.role);
    }
  }, [comments, user]);

  const handleChange = (e) => setMessage(e.target.value);

  const handleSend = useCallback(async () => {
    if (!isAuthenticated) {
      setLoginMessage('Log in to post a message');
      setTimeout(() => setLoginMessage(''), 3000);
      return;
    }
    if (message.trim() === '') return;

    try {
      const res = await createComment(message, postId);
      const newComment = res.data;
      setComments(prev => [newComment, ...prev]);
      setMessage('');
    } catch (err) {
      console.error('Failed to send comment:', err);

      if (err.response?.status === 401) {
        setLoginMessage('Session expired. Please log in again.');
        setTimeout(() => setLoginMessage(''), 3000);
        setIsAuthenticated(false);
        setUser(null);
      } else {
        setLoginMessage('Failed to send a message.');
      }
    }
  }, [isAuthenticated, message, postId, setIsAuthenticated, setUser]);

  const handleDeleteMessage = useCallback(async (commentId) => {
    if (!isAuthenticated) {
      alert('Need to be logged in as admin to delete messages.');
      return;
    }

    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
      setLoginMessage('Failed to delete comment');
      setTimeout(() => setLoginMessage(''), 3000);

      if (err.response?.status === 401) {
        setLoginMessage('Session expired. Please log in again.');
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  }, [isAuthenticated, setIsAuthenticated, setUser]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Always scroll to bottom when comments change
  useEffect(() => {
    const container = document.querySelector('.message-board-container');
    if (container) container.scrollTop = container.scrollHeight;
  }, [comments]);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const canDeleteComment = useCallback((comment) => {
    if (!user || !isAuthenticated) return false;
    const role = user.role?.role;
    const isOwner = user.userId === comment.user?.id;
    const isAdmin = role === 'ADMIN';
    return isOwner || isAdmin;
  }, [user, isAuthenticated]);

  return (
    <div className={`message-board-container ${isChatOpen ? 'slide-in-chat' : 'slide-out-chat'}`}>
      <Button
        onClick={onToggleChat}
        ariaLabel="Close chat"
        className="close-chat-btn"
        text={<CloseIcon className={'close-icon'} />}
      />

      <div className="message-scroll-area">
        {loading ? (
          <div className="no-comments">Loading...</div>
        ) : comments.length === 0 ? (
          <div className="no-comments">
            <p>No comments yet.</p>
            <p>Be the first to post a comment.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="message-wrap">
              <img src={profileImg} alt="user icon" className="no-select" />
              <div>
                <div className="upper-part">
                  <p className="username">{comment.user?.username || 'Anonymous'}</p>
                  <p className="message">{comment.content}</p>
                  {canDeleteComment(comment) && (
                    <Button
                      className="delete-comment-btn"
                      onClick={() => handleDeleteMessage(comment.id)}
                      aria-label="Delete comment"
                      text="x"
                    />
                  )}
                </div>
                <div className="lower-part">
                  <p className="date no-select">{formatDate(comment.createdAt)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="message-input">
        {loginMessage && (
          <div className={`login-chat-message no-select ${loginMessage ? 'show' : ''}`}>
            {loginMessage}
          </div>
        )}

        <textarea
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={isAuthenticated ? 'Message...' : 'Please log in to comment'}
          rows={1}
        />

        <Button
          onClick={handleSend}
          ariaLabel="Send message"
          text={<SendMsgIcon className={'send-msg-icon no-select'} />}
        />
      </div>
    </div>
  );
}

export default MessageBoard;
