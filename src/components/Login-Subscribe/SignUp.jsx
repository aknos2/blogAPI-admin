import { useState } from 'react';
import { signUpAccount } from '../../../api/auth';
import './login-signup.css';
import { EyeIcon, EyeOffIcon } from '../Icons';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    setSuccess('');

    try {
      const response = await signUpAccount(formData);
      
      setSuccess(response.data.message);
      
      // Set signup success flag for the success message
      localStorage.setItem("signupSuccess", "true");
      
      // Navigate to home page
      navigate('/');
      
      // Dispatch event to notify other components
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('authStateChange'));
      }, 100);
      
    } catch (err) {
      if (err.response?.data?.errors) {
        // Handle validation errors from express-validator
        setErrors(err.response.data.errors.map(error => error.msg));
      } else {
        setErrors([err.response?.data?.message || 'Signup failed. Please try again.']);
      }
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>
        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <div key={index} className="error-message">{error}</div>
            ))}
          </div>
        )}

        {success && <div className="success-message">{success}</div>}

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
        <span className='password-instruction'>(At least one number and one uppercase letter)</span>

        <div className="password-input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="Between 6~30 characters"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="toggle-password-btn"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        <label htmlFor="confirm-password">Confirm Password:</label>
        <div className="password-input-wrapper">
          <input
            type={showConfirm ? 'text' : 'password'}
            id="confirm-password"
            name="confirmPassword"
            placeholder="Between 6~30 characters"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(prev => !prev)}
            className="toggle-password-btn"
            aria-label="Toggle confirm password visibility"
          >
            {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

export default SignUp;