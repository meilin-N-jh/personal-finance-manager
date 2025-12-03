import React, { useState } from 'react';
import axios from 'axios';

const SimpleApiTest = () => {
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testDirectApi = async () => {
    addLog('开始直接API测试...');

    try {
      // 测试登录
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'newuser2',
          password: '123456'
        })
      });

      addLog(`响应状态: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();
        addLog(`登录成功: ${JSON.stringify(data)}`);
      } else {
        const errorText = await response.text();
        addLog(`登录失败: ${errorText}`);
      }
    } catch (error) {
      addLog(`网络错误: ${error.message}`);
      addLog(`错误详情: ${error.stack || 'No stack trace'}`);
    }
  };

  const testAxiosApi = async () => {
    addLog('开始Axios API测试...');

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        username: 'newuser2',
        password: '123456'
      });

      addLog(`Axios登录成功: ${JSON.stringify(response.data)}`);
    } catch (error) {
      addLog(`Axios网络错误: ${error.message}`);
      addLog(`Axios错误详情: ${error.response?.data || 'No response data'}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>简单API测试</h2>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={testDirectApi}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          测试Fetch API
        </button>

        <button
          onClick={testAxiosApi}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          测试Axios API
        </button>

        <button
          onClick={clearLogs}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          清除日志
        </button>
      </div>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '5px',
        fontFamily: 'monospace',
        fontSize: '12px',
        maxHeight: '400px',
        overflow: 'auto'
      }}>
        <h3>测试日志:</h3>
        {logs.length === 0 ? (
          <p>点击按钮开始测试...</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>
              {log}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>环境信息:</h3>
        <p>当前URL: {window.location.href}</p>
        <p>API地址: http://localhost:3001/api</p>
        <p>用户代理: {navigator.userAgent}</p>
      </div>
    </div>
  );
};

export default SimpleApiTest;