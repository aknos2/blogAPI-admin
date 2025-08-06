import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import SideMenu from "./SideMenu/SideMenu";
import LoginScreen from "./Login-Subscribe/Login";

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginScreenOpen, setIsLoginScreenOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const toggleLogin = () => {
      setIsLoginScreenOpen(prev => !prev);
    if (isMenuOpen) {
      setIsMenuOpen(prev => !prev)
    }
  }

  // Show success message when auth state changes (login/signup)
  const handleAuthStateChange = () => {
    const loginSuccess = localStorage.getItem("loginSuccess");
    const signupSuccess = localStorage.getItem("signupSuccess");
    const token = localStorage.getItem("accessToken");
    
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
    // Check on mount (for page refreshes after login)
    handleAuthStateChange();

    // Listen for auth state changes (for same-session logins)
    window.addEventListener('authStateChange', handleAuthStateChange);
    
    return () => {
      window.removeEventListener('authStateChange', handleAuthStateChange);
    };
  }, []);

  return (
    <>
      <Header 
        onMenuToggle={toggleMenu}
      />
        <Outlet />
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