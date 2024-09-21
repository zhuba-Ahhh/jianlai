import { useCallback, useEffect, useState } from 'react';
import { http } from '../utils/request';

import { useNavigate } from 'react-router-dom';

import Loading from '../components/Loading';
import Tabs from '../components/Tabs';
import { Author } from 'assets/svg';

interface Book {
  img: string;
  desc: string;
  hot: string;
  name: string;
  type: string;
  author: string;
}

type BookDetail = {
  name: string;
  url: string;
  new: string;
  newurl: string;
};

interface BookListProps {
  initialCategory?: '全部类型' | '都市' | '玄幻' | '奇幻' | '历史' | '科幻' | '军事' | '游戏';
}

const categories = ['全部类型', '都市', '玄幻', '奇幻', '历史', '科幻', '军事', '游戏'];

const BookList = ({ initialCategory = '全部类型' }: BookListProps) => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] =
    useState<Required<BookListProps['initialCategory']>>(initialCategory);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await http.get<Book[]>(`/hot?category=${category}`);

        setBooks(response);
      } catch (error) {
        console.error('获取书籍失败:', error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [category]);

  const JumpToTableOfContents = useCallback(
    async (name: string) => {
      const response = await http.get<BookDetail[]>(`/book?name=${name}`);
      if (response?.length > 0) {
        navigate(`/book/${getLastNumberFromUrl(response[0]?.url)}`);
      }
    },
    [navigate]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-16" />
      <Tabs
        initialActiveKey="全部类型"
        tabs={categories.map((key) => ({
          key,
          label: key,
        }))}
        onChange={(key) => {
          setCategory(key as Required<BookListProps['initialCategory']>);
        }}
      />
      <div className="h-8" />
      {loading ? (
        <Loading />
      ) : books?.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <div
              key={book.name}
              onClick={() => JumpToTableOfContents(book.name)}
              className="card card-compact hover:shadow-lg hover:rounded-lg transition-shadow duration-300" // 增加圆角样式
            >
              <img
                src={book.img}
                alt={book.name}
                className="w-full h-64 object-contain mt-4" // 增加上边距
              />
              <div className="card-body flex-col items-start p-4">
                <h2 className="text-xl font-semibold mb-2">{book.name}</h2>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{book.desc}</p>
                <div className="flex justify-between items-center w-full">
                  <span
                    role="button"
                    tabIndex={0}
                    className="text-sm px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full cursor-pointer"
                    onClick={() => {
                      if (category !== book.type) {
                        setCategory(book.type as BookListProps['initialCategory']);
                      }
                    }}
                  >
                    {book.type}
                  </span>
                  <span className="text-sm font-medium text-orange-500">热度: {book.hot}</span>
                </div>
                <div className="flex items-center space-x-1 mt-3 text-gray-500">
                  <Author />
                  <p className="text-sm truncate">{book.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">暂无相关书籍</p>
        </div>
      )}
    </div>
  );
};

export default BookList;

const getLastNumberFromUrl = (url: string) => {
  // 使用正则表达式匹配URL路径中的数字
  const regex = /\d+(?=\/?$)/;
  const match = url.match(regex);
  // 如果匹配成功，则返回匹配的数字，否则返回null
  return match ? parseInt(match[0], 10) : null;
};
