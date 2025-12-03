import React, { useEffect } from 'react';

const DirectTest = () => {
  useEffect(() => {
    document.body.style.backgroundColor = '#ff6b6b';
    document.title = 'DirectTest - 红色背景页面';
    console.log('DirectTest component mounted');

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#ff6b6b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '60px',
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '600px',
        margin: '20px'
      }}>
        <h1 style={{
          color: '#ff6b6b',
          fontSize: '48px',
          marginBottom: '30px',
          fontWeight: 'bold'
        }}>
          🎉 成功了！🎉
        </h1>

        <p style={{
          color: '#333',
          fontSize: '24px',
          marginBottom: '40px',
          lineHeight: '1.5'
        }}>
          如果你看到这个红色背景的页面，<br/>
          说明组件渲染完全正常！
        </p>

        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={() => {
              alert('蓝色按钮工作正常！');
              document.body.style.backgroundColor = '#007bff';
            }}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '20px 40px',
              fontSize: '24px',
              borderRadius: '12px',
              cursor: 'pointer',
              margin: '10px',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(0,123,255,0.3)'
            }}
          >
            🔵 蓝色按钮
          </button>

          <button
            onClick={() => {
              alert('绿色按钮工作正常！');
              document.body.style.backgroundColor = '#28a745';
            }}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '20px 40px',
              fontSize: '24px',
              borderRadius: '12px',
              cursor: 'pointer',
              margin: '10px',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(40,167,69,0.3)'
            }}
          >
            🟢 绿色按钮
          </button>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '30px',
          borderRadius: '15px',
          marginTop: '30px'
        }}>
          <h3 style={{
            color: '#495057',
            fontSize: '20px',
            marginBottom: '20px'
          }}>
            测试成功项目：
          </h3>
          <p style={{ color: '#28a745', fontSize: '18px', margin: '10px 0', fontWeight: 'bold' }}>
            ✅ 红色背景显示
          </p>
          <p style={{ color: '#28a745', fontSize: '18px', margin: '10px 0', fontWeight: 'bold' }}>
            ✅ 白色容器框
          </p>
          <p style={{ color: '#28a745', fontSize: '18px', margin: '10px 0', fontWeight: 'bold' }}>
            ✅ 大标题显示
          </p>
          <p style={{ color: '#28a745', fontSize: '18px', margin: '10px 0', fontWeight: 'bold' }}>
            ✅ 两个可点击按钮
          </p>
        </div>
      </div>
    </div>
  );
};

export default DirectTest;