import { useEffect, useState } from 'react';
import Button from '../Button';
import { CloseIcon } from '../Icons';
import './login-signup.css';
import { loginAccount, logoutAccount } from '../../../api/auth';
import { useNavigate } from 'react-router-dom';

function LoginScreen({ onToggleLogin }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("accessToken");
      const user = localStorage.getItem("user");
      setLoggedIn(!!(token && user));
    };

    checkAuthStatus();
    
    // Listen for storage changes (in case user logs out in another tab)
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      // Call logout API
      await logoutAccount();
      console.log('Logout API call successful');
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with cleanup even if API call fails
    }

    // Clear local storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    
    // Update state
    setLoggedIn(false);
    
    // Navigate to home
    navigate('/');

    // Wait a tiny bit to ensure modal closes first
    setTimeout(() => {
      window.location.reload();
    }, 100);
    
    setLogoutLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginAccount(formData);
      
      // Store tokens and user data
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("loginSuccess", true);
      
      // Update logged in state
      setLoggedIn(true);
      
      // Close modal
      onToggleLogin();

      // Clean page reload after modal closes
      setTimeout(() => window.location.reload(), 100);
      
      console.log('Login successful:', response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="login-container">
        {loggedIn ? (
          <div className="logged-in-state">
            <h2>You are already logged in</h2>
            <div className="logout-actions">
              <Button 
                onClick={handleLogout} 
                text={logoutLoading ? "Logging out..." : "Logout"}
                disabled={logoutLoading}
                className="logout-btn"
              />
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              {error && <div className="error-message">{error}</div>}

              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p>
              Don't have an account? <a href="/signup">Sign up here</a>
            </p>

            <Button 
              className="close-login-btn" 
              onClick={onToggleLogin} 
              text={<CloseIcon/>}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default LoginScreen;