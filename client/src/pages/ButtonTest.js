import React from 'react';

const ButtonTest = () => {
  console.log('ButtonTest component rendering...');

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ff6b6b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{
          color: '#333',
          fontSize: '36px',
          marginBottom: '30px'
        }}>
          🎉 按钮测试页面 🎉
        </h1>

        <p style={{
          color: '#666',
          fontSize: '18px',
          marginBottom: '40px'
        }}>
          如果你看到这个页面，说明组件渲染正常！
        </p>

        <button
          onClick={() => alert('蓝色按钮点击成功！')}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '20px 40px',
            fontSize: '20px',
            borderRadius: '8px',
            cursor: 'pointer',
            margin: '10px',
            fontWeight: 'bold'
          }}
        >
          🔵 蓝色按钮
        </button>

        <button
          onClick={() => alert('绿色按钮点击成功！')}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '20px 40px',
            fontSize: '20px',
            borderRadius: '8px',
            cursor: 'pointer',
            margin: '10px',
            fontWeight: 'bold'
          }}
        >
          🟢 绿色按钮
        </button>

        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <p style={{ color: '#495057', margin: '10px 0' }}>
            ✅ 页面背景：红色
          </p>
          <p style={{ color: '#495057', margin: '10px 0' }}>
            ✅ 白色容器框
          </p>
          <p style={{ color: '#495057', margin: '10px 0' }}>
            ✅ 两个可点击的按钮
          </p>
        </div>
      </div>
    </div>
  );
};

export default ButtonTest;