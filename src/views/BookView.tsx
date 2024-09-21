import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { http } from '../utils/request';
import Loading from '../components/Loading';

interface BookDetails {
  img: string;
  desc: string;
  name: string;
  type: string;
  author: string;
  list: { name: string; url: string }[];
}

const BookView = () => {
  const { url } = useParams<{ url: string }>();
  const [book, setBook] = useState<BookDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await http.get<BookDetails>(`/book/bqs/xiaoshuo/${url}`);
        setBook(response);
      } catch (error) {
        console.error('获取书籍详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [url]);

  if (loading) {
    return <Loading />;
  }

  if (!book) {
    return (
      <div className="mx-auto">
        <p className="text-center">未找到书籍信息</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="h-16" />
      <div className="card card-side bg-base-100 shadow-xl transition-transform transform hover:scale-105">
        <figure className="ml-6">
          <img
            src={`https://api.book.bbdaxia.com${book.img}`}
            alt={book.name}
            className="w-48 h-auto mb-4 md:mb-0 md:mr-6 object-contain rounded-lg shadow-md"
          />
        </figure>
        <div className="card-body">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">{book.name}</h1>
          <p className="mb-2 text-gray-600">作者：{book.author}</p>
          <p className="mb-2 text-gray-600">类型：{book.type}</p>
          <p className="mb-4 text-gray-700">{book.desc}</p>
        </div>
      </div>
      <h2 className="text-2xl font-semibold mt-4 mb-4 text-gray-800">章节列表</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {book.list.map((chapter, index) => (
          <a className="link link-hover truncate hover:underline" key={index} href={chapter.url}>
            {chapter.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default BookView;
