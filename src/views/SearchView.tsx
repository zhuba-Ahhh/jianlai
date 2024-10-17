import { useState } from 'react';
import { http } from '../utils/request';
import { uuid } from 'zhuba-tools';
import { Author } from 'assets/svg';
import { getLastNumbersFromUrl } from 'utils';

interface SearchResult {
  img: string;
  type: string;
  name: string;
  author: string;
  desc: string;
  book: { name: string; url: string; new: string; newurl: string }[];
}

type ApiResponse = SearchResult[];

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchTerm = formData.get('search') as string;

    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const response = await http.get<ApiResponse>(
        `/search?keyword=${encodeURIComponent(searchTerm)}`
      );
      console.log('[90m [ response ]-32-「views/SearchView.tsx」 [0m', response);
      // setSearchResults(response);
    } catch (error) {
      console.error('搜索请求失败:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
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
      ) : searchResults?.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {searchResults.map((result) => (
            <div
              key={uuid()}
              className="card card-compact hover:shadow-lg hover:rounded-lg transition-shadow duration-300 cursor-pointer"
            >
              <img
                src={`https://api.book.bbdaxia.com${result.img}`}
                alt={result.name}
                className="w-full h-64 object-contain mt-4" // 增加上边距
              />
              <div className="card-body flex-col items-start p-4">
                <h2 className="text-xl font-semibold mb-2">
                  {result.name} {result.author}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-4 mb-3">{result.desc}</p>
                <div className="flex justify-between items-center w-full">
                  <a
                    href={`/book/${encodeURIComponent(result.name)}`}
                    className="text-blue-600 hover:underline mr-4 cursor-pointer"
                  >
                    查看详情
                  </a>
                  <a
                    href={`/chapter/${getLastNumbersFromUrl(result.book[0].newurl).join('-')}`}
                    className="text-blue-600 hover:underline mr-4 cursor-pointer"
                  >
                    查看最新章节
                  </a>
                </div>
                <div className="flex justify-between items-center w-full mt-3 ">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Author />
                    <p className="text-sm truncate">{result.author}</p>
                  </div>
                  <span
                    role="button"
                    tabIndex={0}
                    className="badge badge-outline text-sm px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full cursor-pointer"
                  >
                    {result.type}
                  </span>
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
