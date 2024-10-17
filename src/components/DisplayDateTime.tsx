import { useState, useEffect } from 'react';
import './DisplayDateTime.less';

const DisplayDateTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timePart: number) => timePart.toString().padStart(2, '0');

  return (
    <div className="flex items-center justify-center font-mono">
      <span className="countdown">{formatTime(time.getHours())}</span>:
      <span className="countdown">{formatTime(time.getMinutes())}</span>:
      <span className="countdown">{formatTime(time.getSeconds())}</span>
      <span className="mx-1">|</span>
      <span className="countdown">{time.getFullYear()}</span>/
      <span className="countdown">{formatTime(time.getMonth() + 1)}</span>/
      <span className="countdown">{formatTime(time.getDate())}</span>
    </div>
  );
};

export default DisplayDateTime;
