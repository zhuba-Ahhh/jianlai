import React, { useEffect } from 'react';

interface ToastProps {
  content: string;
  duration?: number; // 可选参数，自动关闭时间
  type?: 'info' | 'success' | 'error'; // 消息类型
}

const Toast: React.FC<ToastProps> = ({ content, duration = 3000, type = 'info' }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // 关闭逻辑
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  // 根据消息类型设置不同的 className
  const toastClass = `toast toast-end toast-top ${type}`;

  return (
    <div className={toastClass}>
      <span>{content}</span>
    </div>
  );
};

export default Toast;
