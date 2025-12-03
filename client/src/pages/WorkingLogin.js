import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const WorkingLogin = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: 'testuser',
    password: '123456'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      alert('请填写用户名和密码');
      return;
    }

    setLoginLoading(true);

    try {
      const response = await login(formData);
      console.log('登录成功:', response.data);
      alert('登录成功！');
      navigate('/dashboard');
    } catch (error) {
      console.error('登录失败:', error);
      alert(`登录失败: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.username || !formData.password) {
      alert('请填写用户名和密码');
      return;
    }

    setRegisterLoading(true);

    try {
      const registerData = {
        username: formData.username,
        email: formData.username + '@example.com', // 使用用户名作为邮箱
        password: formData.password
      };

      const response = await register(registerData);
      console.log('注册成功:', response.data);
      alert('注册成功！已自动登录');
      navigate('/dashboard');
    } catch (error) {
      console.error('注册失败:', error);
      alert(`注册失败: ${error.response?.data?.error || error.message}`);
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
          个人财务管理系统
        </h1>

        <h2 style={{
          textAlign: 'center',
          color: '#7f8c8d',
          fontSize: '18px',
          marginBottom: '40px',
          fontWeight: 'normal'
        }}>
          请登录您的账户
        </h2>

        <div>
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#2c3e50',
              fontWeight: '600',
              fontSize: '16px'
            }}>
              用户名或邮箱:
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="请输入用户名或邮箱"
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
              密码:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="请输入密码"
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
              {loginLoading ? '登录中...' : '登录'}
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
              {registerLoading ? '注册中...' : '立即注册'}
            </button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#7f8c8d', fontSize: '14px' }}>
              使用上方按钮登录或注册新账户
            </p>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ecf0f1',
          padding: '25px',
          borderRadius: '10px',
          marginTop: '30px',
          border: '1px solid #bdc3c7'
        }}>
          <h3 style={{
            color: '#2c3e50',
            marginBottom: '15px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            测试账户信息:
          </h3>
          <p style={{ margin: '8px 0', color: '#34495e', fontSize: '14px' }}>
            <strong>用户名:</strong> test
          </p>
          <p style={{ margin: '8px 0', color: '#34495e', fontSize: '14px' }}>
            <strong>密码:</strong> 123456
          </p>
          <p style={{
            margin: '15px 0 0 0',
            color: '#7f8c8d',
            fontSize: '13px',
            fontStyle: 'italic'
          }}>
            💡 提示：使用上述测试账户或创建新账户
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkingLogin;