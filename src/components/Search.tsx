/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { SearchIcon } from 'assets/svg';
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
  const [books, setBooks] = useState<Array<string>>([]);
  const [authors, setAuthors] = useState<Array<string>>([]);
  const [currentPlaceholder, setCurrentPlaceholder] = useState<string>(placeholder);
  const [index, setIndex] = useState(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      fetchSearchResults('', false);
      setCurrentPlaceholder(truncateString(books?.[0] || ''));
    };
    fetchSuggestions();
  }, []);

  useEffect(() => {
    if (suggestions.length > 0) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
        setCurrentPlaceholder(truncateString(suggestions[index]));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [suggestions, index]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setInputValue(value);
    onSearch(event);
    if (value) {
      fetchSearchResults(value);
    } else {
      setShowSuggestions(false);
    }
  };

  const fetchSearchResults = async (value: string, isShow = true) => {
    const res = await http.get<ResSearchSuggest>(`/search/suggest?keyword=${value}`);
    setBooks(res?.books || []);
    setAuthors(res?.authors || []);
    setSuggestions(res?.books || []);
    setShowSuggestions(isShow);
  };

  return (
    <div className="relative w-48">
      {/* 添加相对定位以便下拉列表对齐 */}
      <label
        className={`input input-bordered input-sm flex items-center gap-2 ${className}`}
        style={{ ...style, width: '100%', maxWidth: '400px' }} // 设置最大宽度
      >
        <input
          className="grow"
          type="text"
          placeholder={currentPlaceholder || placeholder}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setShowSuggestions(false)}
          value={inputValue}
          style={{ width: '100%' }} // 输入框宽度100%
        />
        <SearchIcon />
      </label>
      {showSuggestions && (
        <ul className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
          {!inputValue ? (
            <>
              <li className="p-2 font-bold">大家都在搜</li>
              {suggestions.map((suggestion, idx) => (
                <li
                  key={`suggestion-${idx}`}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setInputValue(suggestion)}
                >
                  {truncateString(suggestion, 16)}
                </li>
              ))}
            </>
          ) : (
            <>
              {books.length > 0 && (
                <>
                  <li className="p-2 font-bold">&quot;{inputValue}&quot;相关作品</li>
                  {books.map((book, idx) => (
                    <li
                      key={`work-${idx}`}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setInputValue(book)}
                    >
                      {truncateString(book, 16)}
                    </li>
                  ))}
                </>
              )}
              {authors.length > 0 && (
                <>
                  <li className="p-2 font-bold">&quot;{inputValue}&quot;相关作者</li>
                  {authors.map((author, idx) => (
                    <li
                      key={`author-${idx}`}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setInputValue(author)}
                    >
                      {truncateString(author, 16)}
                    </li>
                  ))}
                </>
              )}
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
