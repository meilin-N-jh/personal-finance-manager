import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const WorkingLogin = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error message
    if (error) {
      setError('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError('Please enter username and password');
      return;
    }

    setLoginLoading(true);
    setError('');

    try {
      const response = await login(formData);
      console.log('Login successful:', response.data);
      // Clear form
      setFormData({ username: '', password: '' });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.error || 'Login failed, please try again');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.username || !formData.password) {
      setError('Please enter username and password');
      return;
    }

    setRegisterLoading(true);
    setError('');

    try {
      const registerData = {
        username: formData.username,
        email: formData.username + '@example.com', // Use username as email
        password: formData.password
      };

      const response = await register(registerData);
      console.log('Registration successful:', response.data);
      // Clear form
      setFormData({ username: '', password: '' });
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.response?.data?.error || 'Registration failed, please try again');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        width: '100%',
        maxWidth: '450px'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#2c3e50',
          fontSize: '32px',
          marginBottom: '10px',
          fontWeight: 'bold'
        }}>
          Personal Finance Manager
        </h1>

        <h2 style={{
          textAlign: 'center',
          color: '#7f8c8d',
          fontSize: '18px',
          marginBottom: '40px',
          fontWeight: 'normal'
        }}>
          Please login to your account
        </h2>

        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #f5c6cb',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <div>
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#2c3e50',
              fontWeight: '600',
              fontSize: '16px'
            }}>
              Username or Email:
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Please enter username or email"
              required
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #e1e8ed',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#e1e8ed'}
            />
          </div>

          <div style={{ marginBottom: '35px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#2c3e50',
              fontWeight: '600',
              fontSize: '16px'
            }}>
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Please enter password"
              required
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #e1e8ed',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#e1e8ed'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <button
              type="button"
              onClick={handleLogin}
              disabled={loginLoading}
              style={{
                width: '100%',
                padding: '18px',
                backgroundColor: loginLoading ? '#95a5a6' : '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: loginLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(52,152,219,0.3)'
              }}
              onMouseOver={(e) => !loginLoading && (e.target.style.backgroundColor = '#2980b9')}
              onMouseOut={(e) => !loginLoading && (e.target.style.backgroundColor = '#3498db')}
            >
              {loginLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>

        <div style={{ marginBottom: '25px' }}>
            <button
              type="button"
              onClick={handleRegister}
              disabled={registerLoading}
              style={{
                width: '100%',
                padding: '18px',
                backgroundColor: registerLoading ? '#95a5a6' : '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: registerLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(39,174,96,0.3)'
              }}
              onMouseOver={(e) => !registerLoading && (e.target.style.backgroundColor = '#219a52')}
              onMouseOut={(e) => !registerLoading && (e.target.style.backgroundColor = '#27ae60')}
            >
              {registerLoading ? 'Registering...' : 'Register'}
            </button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#7f8c8d', fontSize: '14px' }}>
              Login or register a new account using the buttons above
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingLogin;