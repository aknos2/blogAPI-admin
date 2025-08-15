import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import SideMenu from "./SideMenu/SideMenu";
import LoginScreen from "./Login-Subscribe/Login";
import { useAuth } from "../context/useAuthContext";

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginScreenOpen, setIsLoginScreenOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { isAuthenticated } = useAuth();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleLogin = () => {
    setIsLoginScreenOpen((prev) => !prev);
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // Show success message when auth state changes (login/signup)
  useEffect(() => {
    const loginSuccess = localStorage.getItem("loginSuccess");
    const signupSuccess = localStorage.getItem("signupSuccess");

    if (loginSuccess === "true" && isAuthenticated) {
      setSuccessMessage("Login successful! ✓");
      setShowSuccessMessage(true);
      localStorage.removeItem("loginSuccess");
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } else if (signupSuccess === "true") {
      setSuccessMessage("Account created successfully! \n You can now log in. ✓");
      setShowSuccessMessage(true);
      localStorage.removeItem("signupSuccess");
      setTimeout(() => setShowSuccessMessage(false), 4000);
    }
  }, [isAuthenticated]);

  return (
    <>
      <Header onMenuToggle={toggleMenu} />
      <Outlet />
      <SideMenu
        isOpen={isMenuOpen}
        onToggleLogin={toggleLogin}
        onMenuToggle={toggleMenu}
      />
      {isLoginScreenOpen && (
        <div className="background-overlay">
          <LoginScreen onToggleLogin={toggleLogin} />
        </div>
      )}
      {showSuccessMessage && (
        <div className="success-login-message slide-in-message">
          <span>{successMessage}</span>
        </div>
      )}
    </>
  );
}

export default Layout;
