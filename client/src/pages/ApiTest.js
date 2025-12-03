import React, { useState } from 'react';
import axios from 'axios';

const ApiTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setResult('');

    try {
      console.log('开始测试API...');
      console.log('API URL:', 'http://localhost:3001/api/auth/login');

      const response = await axios.post('http://localhost:3001/api/auth/login', {
        username: 'newuser2',
        password: '123456'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('API响应:', response.data);
      setResult('✅ API测试成功: ' + JSON.stringify(response.data));
    } catch (error) {
      console.error('API测试失败:', error);
      setResult('❌ API测试失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>API 连接测试</h2>
      <button
        onClick={testApi}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '测试中...' : '测试API连接'}
      </button>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h3>测试结果:</h3>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {result || '点击按钮开始测试'}
        </pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>调试信息:</h3>
        <p>浏览器地址: {window.location.origin}</p>
        <p>API地址: http://localhost:3001/api</p>
        <p>当前时间: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ApiTest;