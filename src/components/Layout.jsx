import { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import SideMenu from "./SideMenu/SideMenu";
import { HeaderProvider } from "./Header/HeaderContext";
import LoginScreen from "./Login-Subscribe/Login";

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [headerPosition, setHeaderPosition] = useState({ top: 0, left: 0, height: 0 });
  const [headerPositionReady, setHeaderPositionReady] = useState(false);
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

  useEffect(() => {
    const updatePositions = () => {
      if (menuBtnRef.current) {
        const rect = menuBtnRef.current.getBoundingClientRect();
        setMenuPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX
        });
      }
      
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        setHeaderPosition({
          top: rect.bottom + window.scrollY,
          left: rect.right + window.scrollX,
          height: rect.height
        });
        setHeaderPositionReady(true);
      }
    };

    // Small delay to ensure the header is fully rendered
    const timer = setTimeout(updatePositions, 0);

    const handleResize = () => updatePositions();
    const handleScroll = () => updatePositions();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Header 
        onMenuToggle={toggleMenu}
        menuBtnRef={menuBtnRef}
        headerRef={headerRef}
      />
      <HeaderProvider headerPosition={headerPosition} headerPositionReady={headerPositionReady}>
        <Outlet />
      </HeaderProvider>
      {headerPositionReady && (
        <SideMenu 
          isOpen={isMenuOpen} 
          position={menuPosition} 
          onToggleLogin={toggleLogin}
          onMenuToggle={toggleMenu}
        />
      )}
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