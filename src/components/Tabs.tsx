import React, { useState } from 'react';

// 定义 Tab 项的类型
interface Tab {
  label: string; // 显示的标签名
  key: string; // 用于标识各个 Tab 项的 key
  content?: React.ReactNode; // 显示的内容
}

// 定义 Tabs 组件接收的 Props 类型
interface TabsProps {
  tabs: Tab[]; // 传入的 Tab 项数组
  initialActiveKey?: string; // 初始激活项的 key
  onChange?: (key: string) => void; // 切换 Tab 项时触发的回调函数
}

const Tabs: React.FC<TabsProps> = ({ tabs, initialActiveKey, onChange }) => {
  // 维护当前激活的 Tab 项的 key 状态
  const [activeKey, setActiveKey] = useState<string>(
    initialActiveKey || (tabs.length > 0 ? tabs[0].key : '')
  );

  // 点击 Tab 时的触发的事件
  const onTabClick = (key: string) => {
    setActiveKey(key);
    onChange && onChange(key);
  };

  return (
    <>
      {tabs?.length > 0 && (
        <div role="tablist" className="tabs tabs-bordered">
          {tabs.map((tab) => (
            <button
              key={`tab-${tab.key}`}
              role="tab"
              className={`tab ${activeKey === tab.key ? 'tab-active' : ''}`}
              onClick={() => onTabClick(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
      {tabs?.some((tab) => !!tab?.content) && (
        <div className="tabs-content mt-2">
          {tabs.map((tab) => (
            <div
              key={`content-${tab.key}`}
              role="tabpanel"
              className={`tab-panel ${activeKey === tab.key ? 'active' : ''}`}
              style={{
                display: activeKey === tab.key ? 'block' : 'none',
                transition: 'opacity 0.3s ease-in-out',
                opacity: activeKey === tab.key ? 1 : 0,
              }}
            >
              {tab?.content}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Tabs;
