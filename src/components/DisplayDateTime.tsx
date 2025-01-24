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

  const [prevTime, setPrevTime] = useState(time);

  useEffect(() => {
    setPrevTime(time);
  }, [time]);

  const shouldAnimate = (current: number, previous: number) => current !== previous;

  return (
    <div className="flex items-center justify-center font-mono">
      <span
        key={`h-${time.getHours()}`}
        className={`countdown ${shouldAnimate(time.getHours(), prevTime.getHours()) ? 'animate-countdown' : ''}`}
      >
        {formatTime(time.getHours())}
      </span>
      :
      <span
        key={`m-${time.getMinutes()}`}
        className={`countdown ${shouldAnimate(time.getMinutes(), prevTime.getMinutes()) ? 'animate-countdown' : ''}`}
      >
        {formatTime(time.getMinutes())}
      </span>
      :
      <span
        key={`s-${time.getSeconds()}`}
        className={`countdown ${shouldAnimate(time.getSeconds(), prevTime.getSeconds()) ? 'animate-countdown' : ''}`}
      >
        {formatTime(time.getSeconds())}
      </span>
      <span className="mx-1">|</span>
      <span
        key={`y-${time.getFullYear()}`}
        className={`countdown ${shouldAnimate(time.getFullYear(), prevTime.getFullYear()) ? 'animate-countdown' : ''}`}
      >
        {time.getFullYear()}
      </span>
      /
      <span
        key={`M-${time.getMonth()}`}
        className={`countdown ${shouldAnimate(time.getMonth(), prevTime.getMonth()) ? 'animate-countdown' : ''}`}
      >
        {formatTime(time.getMonth() + 1)}
      </span>
      /
      <span
        key={`d-${time.getDate()}`}
        className={`countdown ${shouldAnimate(time.getDate(), prevTime.getDate()) ? 'animate-countdown' : ''}`}
      >
        {formatTime(time.getDate())}
      </span>
    </div>
  );
};

export default DisplayDateTime;
