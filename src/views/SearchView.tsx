import { useState, useEffect } from 'react';
import { http } from '../utils/request';
import { uuid } from 'zhuba-tools';
import { Author } from 'assets/svg';
import { COVER_BASE_URL } from 'common/const';
import { useLocation, useNavigate } from 'react-router-dom';

export interface SearchBookData {
  datas?: Datas;
  encodeKw?: string;
  isFromHuayu?: number;
  keyword?: string;
  pageNo?: number;
  recDataList?: RecDataList[];
  sort?: string;
}

export interface Datas {
  aroundNum: number;
  list: List[];
  pageNo: number;
  pageSize: number;
  scrollPageNums: number[];
  total: number;
  totalPage: number;
}

export interface List {
  authorId: number;
  authorization: number;
  authorName: string;
  bookId: number;
  cateFineId: number;
  cateFineName: string;
  cateId: number;
  catePid: number;
  catePName: string;
  chapterId: number;
  chapterName: string;
  consumeType: number;
  coverUrl: string;
  cpId: number;
  cpName: string;
  description: string;
  keyword: string;
  level: number;
  name: string;
  serialStatus: number;
  tomeId: number;
  tomeName: string;
  totalWord: number;
  updateTime: string;
}

export interface RecDataList {
  authorId: number;
  authorName: string;
  beginTime: string;
  bookId: number;
  bookName: string;
  cateFineId: number;
  cateFineName: string;
  cateId: number;
  cateName: string;
  catePid: number;
  catePname: string;
  createTime: string;
  description: string;
  endTime: string;
  extraInfo: string;
  extraInfoJsonMap: null;
  id: number;
  imageUrl: string;
  issueTime: string;
  level: number;
  linkUrl: string;
  position: number;
  recReason: string;
  serialStatus: number;
  summary: string;
  title: string;
  titleColor: string;
  totalWord: number;
  typeId: number;
  uniqCharId: string;
  updateTime: string;
}

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialKeyword = queryParams.get('keyword') || ''; // 从路由参数获取初始值
  const [searchResults, setSearchResults] = useState<List[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(initialKeyword); // 新增状态管理输入框值

  useEffect(() => {
    setInputValue(initialKeyword); // 初始加载时更新输入框值
  }, [initialKeyword]);

  useEffect(() => {
    if (initialKeyword) {
      fetchData(initialKeyword); // 值变化时请求数据
    }
  }, [initialKeyword]);

  const fetchData = async (keyword: string) => {
    try {
      const response = await http.get<SearchBookData>(
        `/search?keyword=${encodeURIComponent(keyword)}`
      );
      console.log('[90m [ response ]-32-「views/SearchView.tsx」 [0m', response);
      setSearchResults(response.datas?.list || []);
    } catch (error) {
      console.error('搜索请求失败:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
    e && e?.preventDefault();
    if (inputValue.trim()) {
      setLoading(true);
      fetchData(inputValue); // 点击搜索按钮时请求数据
    }
  };

  return (
    <div className="mx-auto p-8">
      <form onSubmit={handleSearch} className="flex mb-8 justify-between w-full">
        <input
          type="text"
          name="search"
          placeholder="输入书名搜索"
          className="input input-bordered w-full mr-4 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <button
          type="submit"
          className="btn px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          搜索
        </button>
      </form>
      {loading ? (
        <p className="text-center text-blue-600">正在搜索...</p>
      ) : searchResults && searchResults.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center">
          {searchResults.map((result) => (
            <div
              key={uuid()}
              className="card card-compact hover:shadow-lg hover:rounded-lg transition-shadow duration-300 cursor-pointer bg-white rounded-lg w-full sm:w-auto max-w-xs" // 添加了最大宽度限制
              onClick={() => {
                navigate(`/directory?id=${result.bookId}`);
              }}
            >
              <img
                src={`${COVER_BASE_URL}${result.coverUrl}`}
                alt={result.name}
                className="w-full object-cover rounded-t-lg"
              />
              <div className="card-body flex-col items-start p-4">
                <h2 className="text-xl font-semibold mb-2">
                  <span dangerouslySetInnerHTML={{ __html: result.name }} />
                </h2>
                <p className="text-gray-700">
                  <span dangerouslySetInnerHTML={{ __html: result.authorName }} /> |{' '}
                  {result.catePName} | {result.totalWord}字
                </p>
                <p
                  className="text-sm text-gray-600 line-clamp-4 mb-3"
                  dangerouslySetInnerHTML={{ __html: result.description }}
                ></p>
                <div className="flex justify-between items-center w-full">
                  <a
                    href={`/directory?id=${result.bookId}`}
                    className="text-blue-600 hover:underline mr-4 cursor-pointer whitespace-nowrap"
                  >
                    目录
                  </a>
                  <a
                    href={`/chapter?id=${result.bookId}&chapterId=${result.chapterId}`}
                    className="text-blue-600 hover:underline cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis"
                  >
                    最新：{result.chapterName}
                  </a>
                </div>
                <div className="flex justify-between items-center w-full mt-3 ">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Author />
                    <p
                      className="text-sm truncate"
                      dangerouslySetInnerHTML={{ __html: result.authorName }}
                    ></p>
                  </div>
                  <span
                    role="button"
                    tabIndex={0}
                    className="badge badge-outline text-sm px-2 py-1 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition duration-200 overflow-hidden whitespace-nowrap text-ellipsis"
                    dangerouslySetInnerHTML={{ __html: result.keyword }}
                  ></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">暂无搜索结果</p>
      )}
    </div>
  );
};

export default SearchPage;
