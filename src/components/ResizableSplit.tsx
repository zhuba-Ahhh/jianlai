/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';

type ResizableSplitProps = {
  children: React.ReactNode[]; // 子组件必须是两个 React 节点
  defaultWidths?: [number, number]; // 子组件的默认宽度比例，单位为百分比
};

const ResizableSplit = ({ children, defaultWidths = [80, 20] }: ResizableSplitProps) => {
  const [dragging, setDragging] = useState(false);
  const splitterRef = useRef<HTMLDivElement>(null);
  const [widths, setWidths] = useState<[number, number]>(defaultWidths); // 默认宽度比例，单位为百分比
  const initialXRef = useRef(0);
  const parentWidthRef = useRef(0);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
    initialXRef.current = e.clientX;
    parentWidthRef.current = (splitterRef.current?.parentNode as HTMLDivElement)?.offsetWidth || 0;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - initialXRef.current;
    // 最小20%·
    const newWidth = Math.max(20, Math.min(80, (dx / parentWidthRef.current) * 100 + widths[0]));
    setWidths([newWidth, 100 - newWidth]);
  };

  const onMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = onMouseMove;
    const handleMouseUp = onMouseUp;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  return (
    <>
      <div style={{ height: '100%', width: `${widths[0]}%` }}>{children[0]}</div>
      <div
        ref={splitterRef}
        style={{
          height: '100%',
          width: '4px',
          backgroundColor: '#ccc',
          cursor: 'col-resize',
        }}
        onMouseDown={onMouseDown}
      />
      <div style={{ height: '100%', width: `${widths[1]}%` }}>{children[1]}</div>
    </>
  );
};

export default ResizableSplit;
