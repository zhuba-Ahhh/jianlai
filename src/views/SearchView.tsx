import { useState } from 'react';
import { http } from '../utils/request';
import { uuid } from 'zhuba-tools';
import { Author } from 'assets/svg';
import { COVER_BASE_URL } from 'common/const';

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
  const [searchResults, setSearchResults] = useState<List[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchTerm = formData.get('search') as string;

    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const response = await http.get<SearchBookData>(
        `/search?keyword=${encodeURIComponent(searchTerm)}`
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

  return (
    <div className="mx-auto p-8">
      <form onSubmit={handleSearch} className="flex mb-8 justify-between w-full">
        <input
          type="text"
          name="search"
          placeholder="输入书名搜索"
          className="input input-bordered w-full mr-8"
          style={{ outlineOffset: 0 }}
        />
        <button type="submit" className="btn px-6">
          搜索
        </button>
      </form>

      {loading ? (
        <p className="text-center">正在搜索...</p>
      ) : searchResults && searchResults?.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {searchResults.map((result) => (
            <div
              key={uuid()}
              className="card card-compact hover:shadow-lg hover:rounded-lg transition-shadow duration-300 cursor-pointer"
            >
              <img
                src={`${COVER_BASE_URL}${result.coverUrl}`}
                alt={result.name}
                className="w-full h-64 object-contain mt-4" // 增加上边距
              />
              <div className="card-body flex-col items-start p-4">
                <h2 className="text-xl font-semibold mb-2">
                  <span dangerouslySetInnerHTML={{ __html: result.name }} />
                </h2>
                <p>
                  {result.authorName} | {result.catePName} | {result.totalWord}字
                </p>
                <p
                  className="text-sm text-gray-600 line-clamp-4 mb-3"
                  dangerouslySetInnerHTML={{ __html: result.description }}
                ></p>
                <div className="flex justify-between items-center w-full">
                  <a
                    href={`/directory?id=${result.bookId}`}
                    className="text-blue-600 hover:underline mr-4 cursor-pointer"
                  >
                    查看详情
                  </a>
                  <a
                    href={`/chapter?id=${result.bookId}&chapterId=${result.chapterId}`}
                    className="text-blue-600 hover:underline mr-4 cursor-pointer"
                  >
                    最新章节：{result.chapterName}
                  </a>
                </div>
                <div className="flex justify-between items-center w-full mt-3 ">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Author />
                    <p className="text-sm truncate">{result.authorName}</p>
                  </div>
                  <span
                    role="button"
                    tabIndex={0}
                    className="badge badge-outline text-sm px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full cursor-pointer"
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
