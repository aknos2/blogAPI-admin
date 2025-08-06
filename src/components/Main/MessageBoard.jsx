import { useEffect, useState, useCallback } from 'react';
import './messageBoard.css';
import profileImg from '/assets/corgi/profile/white-cat-icon.png'
import { CloseIcon, SendMsgIcon } from '../Icons';
import Button from '../Button';
import { createComment, deleteComment, fetchCommentsByPostId } from '../../../api/posts';

function MessageBoard({ isChatOpen, onToggleChat, postId, isAuthenticated, user, onAuthChange }) {
  const [message, setMessage] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginMessage, setLoginMessage] = useState('');

  useEffect(() => {
    async function loadComments() {
      try {
        const res = await fetchCommentsByPostId(postId);
        console.log('Fetched comments response:', res);
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

  // Debug: Log the structure
  useEffect(() => {
    if (comments.length > 0 && user) {
      console.log('Sample comment:', comments[0]);
      console.log('Current user:', user);
      console.log('User role type:', typeof user.role, user.role);
    }
  }, [comments, user]);
  
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = useCallback(async () => {
    if (!isAuthenticated) {
      setLoginMessage('Log in to post a message');
      setTimeout(() => setLoginMessage(''), 3000);
      return;
    }

    if (message.trim() === '') return;

    try {
      const res = await createComment(message, postId);
      // The backend now returns { data: comment }, so use res.data
      const newComment = res.data;
      setComments(prev => [newComment, ...prev]);
      setMessage('');
    } catch(err) {
      console.error('Failed to send comment:', err);
      
      // Handle authentication errors
      if (err.response?.status === 401) {
        setLoginMessage('Session expired. Please log in again.');
        setTimeout(() => setLoginMessage(''), 3000);
        onAuthChange(false, null); // Update parent auth state
      } else {
        setLoginMessage('Failed to send a message.');
      }
    }
  }, [isAuthenticated, message, postId, onAuthChange]);

  const handleDeleteMessage = useCallback(async (commentId) => {
     if (!isAuthenticated) {
      alert("Need to be logged in as admin to delete messages.")
      return;
    }

    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
      setLoginMessage('Failed to delete comment');
      setTimeout(() => setLoginMessage(''), 3000);

      // Optional: handle session expiry
      if (err.response?.status === 401) {
        setLoginMessage('Session expired. Please log in again.');
        onAuthChange(false, null);
      }
    }
  }, [isAuthenticated, onAuthChange]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();    
      handleSend();         
    }
  }, [handleSend]);

  useEffect(() => {
    const container = document.querySelector('.message-board-container');
    if (container) container.scrollTop = container.scrollHeight;
  }, [comments]);

  // Memoize the formatted date function
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // Helper function to check if user can delete comment
  const canDeleteComment = useCallback((comment) => {
    if (!user || !isAuthenticated) return false;
    
    const role = user.role?.role; // 'USER' or 'ADMIN'
    const isOwner = user.userId === comment.user?.id;
    const isAdmin = role === 'ADMIN';
    
    return isOwner || isAdmin;
  }, [user, isAuthenticated]);

  return (
    <div
      className={`message-board-container ${isChatOpen ? 'slide-in-chat' : 'slide-out-chat'}`}
    >
      <Button
        onClick={onToggleChat}
        ariaLabel="Close chat"
        className="close-chat-btn"
        text={<CloseIcon className={'close-icon'} />}
      />

      <div className='message-scroll-area'>
        {loading ? (
          <div className='no-comments'>Loading...</div>
        ) : comments.length === 0 ? (
          <div className='no-comments'>
            <p>No comments yet.</p> 
            <p>Be the first to post a comment.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="message-wrap">
              <img src={profileImg} alt="user icon" />
              <div>
                <div className="upper-part">
                  <p className="username">{comment.user?.username || 'Anonymous'}</p>
                  <p className="message">{comment.content}</p>
                  {canDeleteComment(comment) && (
                    <Button className="delete-comment-btn" 
                            onClick={() => handleDeleteMessage(comment.id)} 
                            aria-label="Delete comment"
                            text="x"
                            />
                  )}
                </div>
                <div className="lower-part">
                  <p className="date">{formatDate(comment.createdAt)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    
      <div className="message-input">
        {loginMessage && (
          <div className={`login-chat-message ${loginMessage ? 'show' : ''}`}>
            {loginMessage}
          </div>
        )}
          
        <textarea
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={isAuthenticated ? "Message..." : "Please log in to comment"}
          rows={1}
        />

        <Button
          onClick={handleSend}
          ariaLabel="Send message"
          text={<SendMsgIcon className={'send-msg-icon'} />}
        />
      </div>
    </div>
  );
}

export default MessageBoard;