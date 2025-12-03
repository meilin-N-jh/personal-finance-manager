import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const LoginSimple = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // 添加调试信息
  console.log('LoginSimple component rendering...');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);

    if (!formData.username || !formData.password) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      console.log('Testing API call to:', 'http://localhost:3001/api/auth/login');
      const directResponse = await axios.post('http://localhost:3001/api/auth/login', formData);
      console.log('API response:', directResponse.data);

      alert('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert(`Login failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F9FAFB'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '24px'
          }}>
            Personal Finance Manager
          </h2>

          <h3 style={{
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Sign in to your account
          </h3>

          <form onSubmit={handleSubmit} style={{ marginTop: '32px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Username or Email
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your username or email"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: loading ? '#9CA3AF' : '#3B82F6',
                color: 'white',
                borderRadius: '6px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '16px'
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={{
            textAlign: 'center',
            fontSize: '14px',
            color: '#6B7280'
          }}>
            Don't have an account?{' '}
            <a
              href="/register"
              onClick={(e) => {
                e.preventDefault();
                navigate('/register');
              }}
              style={{
                color: '#3B82F6',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Sign up
            </a>
          </p>

          <div style={{
            marginTop: '32px',
            padding: '16px',
            backgroundColor: '#F3F4F6',
            borderRadius: '6px'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Test Account:
            </h4>
            <p style={{
              fontSize: '12px',
              color: '#6B7280',
              margin: '4px 0'
            }}>
              Username: <strong>test</strong>
            </p>
            <p style={{
              fontSize: '12px',
              color: '#6B7280',
              margin: '4px 0'
            }}>
              Password: <strong>123456</strong>
            </p>
            <p style={{
              fontSize: '12px',
              color: '#6B7280',
              marginTop: '12px',
              fontStyle: 'italic'
            }}>
              Create a new account or use test credentials above
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSimple;