import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { http } from '../utils/request';
import Loading from '../components/Loading';
import { getLastNumbersFromUrl } from 'utils';

type BookDetail = {
  name: string;
  url: string;
  new: string;
  newurl: string;
};

interface BookDetails {
  img: string;
  desc: string;
  name: string;
  type: string;
  author: string;
  list: { name: string; url: string }[];
}

const BookView = () => {
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>();
  const [book, setBook] = useState<BookDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  const getBookDetails = useCallback(async (url: string) => {
    try {
      const response = await http.get<BookDetails>(url);
      setBook(response);
    } catch (error) {
      console.error('获取书籍详情失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const origins = await http.get<BookDetail[]>(`/book?name=${name}`);
        setOptions(
          origins.map((origin) => ({ value: origin?.url, label: `${origin?.name}-${origin?.new}` }))
        );
        getBookDetails(origins[0].url);
      } catch (error) {
        console.error('获取书籍详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [getBookDetails, name]);

  const JumpToBookChapter = useCallback(
    (url: string) => {
      if (url) {
        navigate(`/chapter/${url}`);
      }
    },
    [navigate]
  );

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
      <div className="card card-side bg-base-100 shadow-xl transition-transform transform hover:scale-105">
        <figure className="ml-6 w-48 h-64 mb-4 rounded-lg shadow-md">
          <img
            src={`https://api.book.bbdaxia.com${book.img}`}
            alt={book.name}
            className="object-contain"
          />
        </figure>
        <div className="card-body">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">{book.name}</h1>
          <p className="mb-2 text-gray-600">作者：{book.author}</p>
          <p className="mb-2 text-gray-600">类型：{book.type}</p>
          <p className="mb-4 text-gray-700">{book.desc}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold mt-4 mb-4 text-gray-800">章节列表</h2>
        <div className="flex items-center">
          <span>源:</span>
          <select
            className="select select-bordered select-sm w-full max-w-xs ml-4"
            style={{ outlineOffset: 0 }}
            onChange={(e) => getBookDetails(e.target.value)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {book.list.map((chapter, index) => (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a
            className="link link-hover truncate hover:underline"
            key={index}
            onClick={() => {
              JumpToBookChapter(getLastNumbersFromUrl(chapter.url).join('-'));
            }}
          >
            {chapter.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default BookView;
