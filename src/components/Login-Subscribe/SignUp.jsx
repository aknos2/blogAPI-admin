import { useState } from 'react';
import { signUpAccount } from '../../../api/auth';
import './login-signup.css';
import { EyeIcon, EyeOffIcon } from '../Icons';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import avatarDefault from '/assets/corgi/profile/default.webp';
import avatar1 from '/assets/corgi/profile/avatar1.webp';
import avatar2 from '/assets/corgi/profile/avatar2.webp';
import avatar3 from '/assets/corgi/profile/avatar3.webp';
import avatar4 from '/assets/corgi/profile/avatar4.webp';
import avatar5 from '/assets/corgi/profile/avatar5.webp';
import avatar6 from '/assets/corgi/profile/avatar6.webp';
import avatar7 from '/assets/corgi/profile/avatar7.webp';
import avatar8 from '/assets/corgi/profile/avatar8.webp';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarDefault);
  const navigate = useNavigate();

  const avatars = [
    { key:"avatar-default", value: avatarDefault },
    { key:"avatar-1", value: avatar1 },
    { key:"avatar-2", value: avatar2 },
    { key:"avatar-3", value: avatar3 },
    { key:"avatar-4", value: avatar4 },
    { key:"avatar-5", value: avatar5 },
    { key:"avatar-6", value: avatar6 },
    { key:"avatar-7", value: avatar7 },
    { key:"avatar-8", value: avatar8 },
  ]

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    avatar: avatarDefault
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectAvatar = (value, e) => {    
    e.preventDefault();
    setSelectedAvatar(value);
    setFormData({
      ...formData,
      avatar: value
    })
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
        <form onSubmit={handleSubmit}>
          {errors.length > 0 && (
            <div className="error-messages">
              {errors.map((error, index) => (
               <div key={`${error}-${index}`} className="error-message">{error}</div>
              ))}
            </div>
          )}

          {success && <div className="success-message">{success}</div>}

          <div className="signup-container-content">
            <div className='create-account-avatar no-select'>
              <h1>Let's avatar choose</h1>
              <div className='avatar-wrap'>
                {avatars.map((avatar)=> (
                  <Button key={avatar.key}
                          className={`avatar-btn ${selectedAvatar === avatar.value ? 'selected' : ''}`}
                          text={<img className={`avatar-imgs img-${avatar.key}`} src={avatar.value} alt={`avatar ${avatar.key}`}/>}
                          onClick={(e) => handleSelectAvatar(avatar.value, e)}
                          />
                ))}
              </div>
            </div>

          <div className='create-account-info'>
              <h1>Create Account</h1>

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
            </div>
          </div>
        </form>
    </div>
  );
}

export default SignUp;