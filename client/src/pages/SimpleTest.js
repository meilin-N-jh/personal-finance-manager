import React, { useState, useEffect } from 'react';

const SimpleTest = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  console.log('SimpleTest component rendering...');

  // 强制显示在页面上
  useEffect(() => {
    document.title = 'SimpleTest页面 - 按钮测试';
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`表单提交: 用户名=${formData.username}, 密码=${formData.password}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '50px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '450px'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '40px',
          fontSize: '28px'
        }}>
          简单测试页面
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#555',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              用户名:
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="请输入用户名"
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={{ marginBottom: '35px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#555',
              fontWeight: 'bold',
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
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '18px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '20px',
              transition: 'background-color 0.3s',
              boxShadow: '0 2px 10px rgba(0,123,255,0.3)'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            提交测试
          </button>

          <button
            type="button"
            onClick={() => alert('按钮点击测试成功！')}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              boxShadow: '0 2px 10px rgba(40,167,69,0.3)'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1e7e34'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
          >
            点击测试
          </button>
        </form>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '30px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{
            color: '#495057',
            marginBottom: '15px',
            fontSize: '16px'
          }}>
            说明:
          </h3>
          <p style={{ margin: '8px 0', color: '#6c757d', lineHeight: '1.5' }}>
            • 这是一个简单的测试页面
          </p>
          <p style={{ margin: '8px 0', color: '#6c757d', lineHeight: '1.5' }}>
            • 包含两个可见的按钮
          </p>
          <p style={{ margin: '8px 0', color: '#6c757d', lineHeight: '1.5' }}>
            • 蓝色按钮用于表单提交
          </p>
          <p style={{ margin: '8px 0', color: '#6c757d', lineHeight: '1.5' }}>
            • 绿色按钮用于点击测试
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleTest;