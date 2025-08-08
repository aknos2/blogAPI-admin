import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import SideMenu from "./SideMenu/SideMenu";
import LoginScreen from "./Login-Subscribe/Login";
import { fetchUserStats } from '../../api/user'; // Add this import

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginScreenOpen, setIsLoginScreenOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Add authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const toggleLogin = () => {
      setIsLoginScreenOpen(prev => !prev);
    if (isMenuOpen) {
      setIsMenuOpen(prev => !prev)
    }
  }

  // Function to load user data
  const loadUserData = async () => {
    console.log('=== Loading User Data in Layout ===');
    try {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');
      
      console.log('Token from localStorage:', token);
      console.log('User data from localStorage:', userData);
      
      if (token && userData) {
        setIsAuthenticated(true);
        
        try {
          const parsedUser = JSON.parse(userData);
          console.log('Parsed user from localStorage:', parsedUser);
          
          // First set the cached user data immediately
          setUser(parsedUser);
          
          // Then try to fetch fresh data
          try {
            const userResponse = await fetchUserStats();
            console.log('Fresh user data from API:', userResponse.data);
            setUser(userResponse.data);
          } catch (apiErr) {
            console.error('API call failed, keeping cached user data:', apiErr);
            // Keep the parsed user data we already set
          }
        } catch (parseErr) {
          console.error('Failed to parse user data:', parseErr);
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        console.log('No token or userData found');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to load user data:', err);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  // Show success message when auth state changes (login/signup)
  const handleAuthStateChange = () => {
    const loginSuccess = localStorage.getItem("loginSuccess");
    const signupSuccess = localStorage.getItem("signupSuccess");
    const token = localStorage.getItem("accessToken");
    
    // Reload user data when auth state changes
    loadUserData();
    
    // Show login success message if user just logged in
    if (loginSuccess === "true" && token) {
      setSuccessMessage("Login successful!");
      setShowSuccessMessage(true);
      localStorage.removeItem("loginSuccess");
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }
    // Show signup success message
    else if (signupSuccess === "true") {
      setSuccessMessage("Account created successfully! You can now log in.");
      setShowSuccessMessage(true);
      localStorage.removeItem("signupSuccess");
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 4000); // Slightly longer for signup message
    }
  };

  useEffect(() => {
    // Load user data on mount
    loadUserData();
    
    // Check for success messages on mount (for page refreshes after login)
    handleAuthStateChange();

    // Listen for localStorage changes (from login/logout in same tab)
    const handleStorageChange = (e) => {
      if (e.key === 'accessToken' || e.key === 'user') {
        loadUserData();
      }
    };

    // Listen for auth state changes (for same-session logins)
    window.addEventListener('authStateChange', handleAuthStateChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('authStateChange', handleAuthStateChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Pass auth context to all child routes
  const authContext = {
    isAuthenticated,
    user,
    authLoading,
    onAuthChange: (authStatus, userData = null) => {
      setIsAuthenticated(authStatus);
      setUser(userData);
    }
    
  };

  return (
    <>
      <Header 
        onMenuToggle={toggleMenu}
      />
        <Outlet context={authContext} />
        <SideMenu 
          isOpen={isMenuOpen} 
          onToggleLogin={toggleLogin}
          onMenuToggle={toggleMenu}
        />
      {isLoginScreenOpen && (
        <div className="background-overlay">
          <LoginScreen onToggleLogin={toggleLogin}/>
        </div>
      )}
      {showSuccessMessage && (
        <div className="success-login-message slide-in-message"><span>{successMessage}</span></div>
      )}
    </>
  )
}

export default Layout;