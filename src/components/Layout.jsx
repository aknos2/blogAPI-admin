import { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import SideMenu from "./SideMenu/SideMenu";
import { HeaderProvider } from "./Header/HeaderContext";
import LoginScreen from "./Login-Subscribe/Login";

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginScreenOpen, setIsLoginScreenOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const menuBtnRef = useRef(null);
  const headerRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const toggleLogin = () => {
      setIsLoginScreenOpen(prev => !prev);
    if (isMenuOpen) {
      setIsMenuOpen(prev => !prev)
    }
  }

  useEffect(() => {
    const success = localStorage.getItem("loginSuccess");

    if (success === "true") {
      setShowSuccessMessage(true);
      localStorage.removeItem("loginSuccess")
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000)
    }
  }, []);

  return (
    <>
      <Header 
        onMenuToggle={toggleMenu}
        menuBtnRef={menuBtnRef}
        headerRef={headerRef}
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
        <div className="success-login-message slide-in-message"><span>Login successful!</span></div>
      )}
    </>
  )
}

export default Layout;