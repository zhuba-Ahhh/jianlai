import { useState } from 'react';
import { http } from '../utils/request';
import { uuid } from 'zhuba-tools';

interface SearchResult {
  name: string;
  url: string;
  new: string;
  newurl: string;
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
      setSearchResults(response);
    } catch (error) {
      console.error('搜索请求失败:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
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
        <div className="space-y-4">
          {searchResults.map((result) => (
            <div key={uuid()} className="card w-full shadow-xl">
              <div className="card-body">
                <h2 className="text-xl font-semibold mb-2">
                  {result.name} {result.author}
                </h2>
                <p className="text-sm text-gray-600">{result.new}</p>
                <div>
                  <a
                    href={`/book/${encodeURIComponent(result.book[0].url)}`}
                    className="text-blue-600 hover:underline mr-4 cursor-pointer"
                  >
                    查看详情
                  </a>
                  <a href={result.newurl} className="text-green-600 hover:underline cursor-pointer">
                    阅读最新章节
                  </a>
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
