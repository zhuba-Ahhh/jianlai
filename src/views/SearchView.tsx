import { useState } from 'react';
import { http } from '../utils/request';
import { Input, Button, Card, CardBody, CardFooter, Link } from '@nextui-org/react';
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
      <form onSubmit={handleSearch} className="flex mb-8">
        <Input type="text" name="search" placeholder="输入书名搜索" className="flex-grow mr-2" />
        <Button type="submit" color="primary" className="px-6">
          搜索
        </Button>
      </form>

      {loading ? (
        <p className="text-center">正在搜索...</p>
      ) : searchResults?.length > 0 ? (
        <div className="space-y-4">
          {searchResults.map((result) => (
            <Card key={uuid()} className="w-full">
              <CardBody>
                <h2 className="text-xl font-semibold mb-2">
                  {result.name} {result.author}
                </h2>
                <p className="text-sm text-gray-600">{result.new}</p>
              </CardBody>
              <CardFooter>
                <Link
                  href={`/book/${encodeURIComponent(result.book[0].url)}`}
                  className="text-blue-600 hover:underline mr-4"
                >
                  查看详情
                </Link>
                <Link href={result.newurl} className="text-green-600 hover:underline">
                  阅读最新章节
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">暂无搜索结果</p>
      )}
    </div>
  );
};

export default SearchPage;
