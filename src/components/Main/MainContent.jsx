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

  // Function to load user data
  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');
      
      setIsAuthenticated(!!token);
      
      if (token && userData) {
        try {
          const userResponse = await fetchUserStats();
          setUser(userResponse.data);
        } catch (err) {
          console.error('Failed to fetch fresh user data, using cached:', err);
          // Fall back to cached user data if API fails
          setUser(JSON.parse(userData));
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to load user data:', err);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();

    // Listen for localStorage changes (from login/logout in same tab)
    const handleStorageChange = (e) => {
      if (e.key === 'accessToken' || e.key === 'user') {
        loadUserData();
      }
    };

    // Listen for custom login/logout events
    const handleAuthChange = () => {
      loadUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChange', handleAuthChange);
    };
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