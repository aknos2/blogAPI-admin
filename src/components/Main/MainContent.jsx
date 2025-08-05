import './mainContent.css';
import Article from "./Article";
import MessageBoard from './MessageBoard';
import { useState, useEffect } from 'react';
import { fetchUserStats } from '../../../api/user';

function MainContent() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        const token = localStorage.getItem('accessToken');
        setIsAuthenticated(!!token);
        
        if (token) {
          const userResponse = await fetchUserStats();
          setUser(userResponse.data);
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        // If user fetch fails, user might be logged out
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    
    loadUserData();
  }, []);

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  }

  const handlePostChange = (postId) => {
    setCurrentPostId(postId);
  }

  const handleAuthChange = (authStatus, userData = null) => {
    setIsAuthenticated(authStatus);
    setUser(userData);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <div></div>
      <Article 
        onToggleChat={toggleChat} 
        onPostChange={handlePostChange}
        isAuthenticated={isAuthenticated}
        user={user}
        onAuthChange={handleAuthChange}
      />
      <MessageBoard 
        isChatOpen={isChatOpen} 
        onToggleChat={toggleChat}
        postId={currentPostId}
        isAuthenticated={isAuthenticated}
        user={user}
        onAuthChange={handleAuthChange}
      />
    </main>
  )
}

export default MainContent;