import { useEffect, useState } from 'react';
import './sideMenu.css'
import profileImg from '/assets/corgi/profile/white-cat-icon.png'
import Button from '../Button';
import { Link, useNavigate } from 'react-router-dom';
import { logoutAccount } from '../../../api/auth';
import { fetchUserStats } from '../../../api/user';

function SideMenu({isOpen, position, onToggleLogin, onMenuToggle}) {
  const [visible, setVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userStats, setUserStats] = useState({ comments: 0, likes: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check authentication status on component mount and when menu opens
  useEffect(() => {
    const checkAuthStatus = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');
      
      if (accessToken && userData) {
        setLoggedIn(true);
        
        try {
          const res = await fetchUserStats()
          setUserStats(res.data);
        } catch (err) {
          console.error('Failed to fetch user stats', err);
          setUserStats({ comments: 0, likes: 0 })
        }
      } else {
        setLoggedIn(false);
        setUserStats({ comments: 10, likes: 7 }); // Demo stats
      }
    };

    checkAuthStatus();
  }, [isOpen]); // Re-check when menu opens

  // delay unmount until after exit animation
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timeOut = setTimeout(() => setVisible(false), 300);// match animation duration
      return () => clearTimeout(timeOut);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutAccount();
      
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      // Update state
      setLoggedIn(false);
      setUserStats({ comments: 10, likes: 7 }); // Reset to demo stats
      
      // Close menu
      onMenuToggle();

      navigate('/');

      setTimeout(() => window.location.reload(), 100);
      
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, clear local data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  const style = {
    position: 'absolute',
    top: `${position.top}px`,
    left: `${position.left}px`,
    width: '17rem',
    background: '#f9f9f9',
    boxShadow: '4px 0 8px rgba(0, 0, 0, 0.05)',
    zIndex: 999,
  }

  return (
    <aside style={style} className={`side-menu ${isOpen ? 'slide-in' : 'slide-out'}`}>
      <div >
        {loggedIn ? (
          <div className="profile">
            <h3 className="username">{userStats.username || 'User'}</h3>
            <img src={profileImg} alt="User avatar" />
            <div className="stats">
              <p>{userStats.comments} Comment{userStats.comments !== 1 ? 's' : ''}</p>
              <p>{userStats.likes} Liked{userStats.likes !== 1 ? 's' : ''}</p>
            </div>
          </div>
        ) : (
          <div className="profile-demo">
            <h3>Profile</h3>
            <img src={profileImg} alt="User avatar" />
            <div className="stats">
              <p>{userStats.comments} Comments</p>
              <p>{userStats.likes} Likes</p>
            </div>
            <div className='subscribe-msg'>
              <span>Create an account or login to access more options</span>
            </div>
          </div>
        )}

        <div className="categories-menu">
          <nav className="nav-links">
            <p className='not-used'>Profile</p>
            <p className='not-used'>Create post</p>
            <p className='not-used'>My posts</p>
            {loggedIn ? (
              <Button 
                onClick={handleLogout} 
                className="logout-btn" 
                text={loading ? "Logging out..." : "Log out"}
                disabled={loading}
              />
            ) : (
              <>
                <Link to="signup">
                  <Button onClick={onMenuToggle} className="create-account-btn" text="Create account"/>
                </Link>
                <Button onClick={onToggleLogin} className='login-btn' text="Login"/>
              </>
            )}
          </nav>
        </div>
      </div>
    </aside>
  );
}


export default SideMenu;