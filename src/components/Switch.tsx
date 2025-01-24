import React, { useCallback, useState, useEffect } from 'react';

type SwitchProps = {
  onChange?: (checked: boolean) => void; // 切换时的回调函数
  defaultChecked?: boolean; // 初始是否选中
  size?: 'lg' | 'md' | 'sm' | 'xs'; // 开关大小
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'info' | 'error'; // 开关颜色
  className?: string;
  style?: React.CSSProperties;
};

const Switch: React.FC<SwitchProps> = ({
  onChange = () => {},
  defaultChecked = false,
  size = 'md', // 默认中等大小
  color = 'primary', // 默认主题色
  className = '',
  style = {},
}) => {
  const [checked, setChecked] = useState(defaultChecked);

  // 确保初始状态正确设置
  useEffect(() => {
    setChecked(defaultChecked);
  }, [defaultChecked]);

  const handleToggle = useCallback(() => {
    setChecked((preChecked) => {
      onChange(!preChecked);
      return !preChecked;
    });
  }, [onChange]);

  return (
    <input
      type="checkbox"
      style={style}
      className={`toggle toggle-${color} toggle-${size} ${className} transition-all duration-300 ease-in-out transform hover:scale-105`}
      onChange={handleToggle}
      checked={checked} // 使用受控的checked属性
    />
  );
};

export default Switch;
