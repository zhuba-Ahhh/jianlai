/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ChangeEvent, useEffect, useState } from 'react';
import { http, truncateString } from 'utils';

export type SearchInputProps = {
  placeholder?: string; // 输入框的占位符文本
  onSearch: (event: ChangeEvent<HTMLInputElement>) => void; // 用户输入时触发的回调函数
  className?: string; // 额外的类名
  style?: React.CSSProperties; // 额外的内联样式
};

type ResSearchSuggest = {
  authors?: Array<string>;
  books?: Array<string>;
};

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = '输入关键词...',
  onSearch,
  className = '',
  style = {},
}) => {
  const [suggestions, setSuggestions] = useState<Array<string>>([]);
  const [currentPlaceholder, setCurrentPlaceholder] = useState<string>(placeholder);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    http.get<ResSearchSuggest>(`/search/suggest`).then((res) => {
      setSuggestions(res.books || []);
      if (suggestions.length > 0) {
        setCurrentPlaceholder(truncateString(suggestions[0]));
      }
    });
  }, []);

  useEffect(() => {
    if (suggestions.length > 0) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
        setCurrentPlaceholder(truncateString(suggestions[index]));
      }, 3000); // 每3秒更换一次占位符文本
      return () => clearInterval(interval);
    }
  }, [suggestions, index]);

  return (
    <label
      className={`input input-bordered input-sm flex items-center gap-2 ${className}`}
      style={style}
    >
      <input
        className="grow"
        type="text"
        placeholder={currentPlaceholder || placeholder}
        onChange={onSearch} // 确保回调函数的参数是ChangeEvent<HTMLInputElement>
      />
      <Icon />
    </label>
  );
};

const Icon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 opacity-70"
  >
    <path
      fillRule="evenodd"
      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SearchInput;
