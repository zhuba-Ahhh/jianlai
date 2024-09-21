import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { http } from '../utils/request';
import { Card, CardBody, Image, Link } from '@nextui-org/react';

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
    return <p className="text-center">加载中...</p>;
  }

  if (!book) {
    return <p className="text-center">未找到书籍信息</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardBody className="flex flex-col md:flex-row">
          <Image
            src={`https://api.book.bbdaxia.com${book.img}`}
            alt={book.name}
            className="w-48 h-auto mb-4 md:mb-0 md:mr-6 object-contain"
            removeWrapper
          />
          <div>
            <h1 className="text-2xl font-bold mb-2">{book.name}</h1>
            <p className="mb-2">作者：{book.author}</p>
            <p className="mb-2">类型：{book.type}</p>
            <p className="mb-4">{book.desc}</p>
          </div>
        </CardBody>
      </Card>

      <h2 className="text-xl font-semibold mb-4">章节列表</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {book.list.map((chapter, index) => (
          <Link key={index} href={chapter.url} className="text-blue-600 hover:underline">
            {chapter.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BookView;
