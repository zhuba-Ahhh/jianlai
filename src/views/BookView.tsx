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

interface listItem {
  name: string;
  url: string;
}

interface BookDetails {
  img: string;
  desc: string;
  name: string;
  type: string;
  author: string;
  list: Array<listItem>;
}

const SkeletonLoader = () => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <div className="card card-side bg-base-100 shadow-xl">
      <figure className="ml-6 w-48 h-64 mb-4 rounded-lg skeleton"></figure>
      <div className="card-body">
        <h1 className="skeleton h-8 mb-2"> </h1>
        <p className="skeleton h-6 mb-2"></p>
        <p className="skeleton h-6 mb-4"></p>
        <p className="skeleton h-4"></p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {Array.from({ length: 24 }).map(
        (
          _,
          index // 假设有6个章节
        ) => (
          <div key={index} className="card bg-base-100 shadow-md skeleton">
            <div className="card-body">
              <h3 className="skeleton h-6 mb-2"> </h3>
            </div>
          </div>
        )
      )}
    </div>
  </div>
);

const BookView = () => {
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>();
  const [book, setBook] = useState<BookDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [defaultSelect, setDefalutSelect] = useState('');

  const getBookDetails = useCallback(async (url: string) => {
    setLoading(true); // 开始加载
    try {
      const response = await http.get<BookDetails>(url);
      setDefalutSelect(url);
      setBook(response);
    } catch (error) {
      console.error('获取书籍详情失败:', error);
    } finally {
      setLoading(false); // 结束加载
    }
  }, []);

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUrl = e.target.value;
    if (selectedUrl) {
      getBookDetails(selectedUrl);
    }
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const origins = await http.get<BookDetail[]>(`/book?name=${name}`);
        setOptions(
          origins.map((origin) => ({ value: origin?.url, label: `${origin?.name}-${origin?.new}` }))
        );
        setDefalutSelect(origins?.[0].url);
        getBookDetails(origins[0].url);
      } catch (error) {
        console.error('获取书籍详情失败:', error);
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
    return <SkeletonLoader />; // 使用封装的骨架屏组件
  }

  return book ? (
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
          <span className="font-medium">源:</span>
          <select
            className="select select-bordered select-sm w-full max-w-xs ml-4"
            value={defaultSelect}
            style={{ outlineOffset: 0 }}
            onChange={handleSourceChange}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {loading && <Loading />}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {book.list.map((chapter, index) => (
          <div
            key={index}
            className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow transform hover:scale-105"
          >
            <div className="card-body">
              <h3 className="text-lg font-semibold cursor-pointer">
                <a
                  className="link link-hover text-blue-600 hover:text-blue-800 transition-colors no-underline hover:no-underline"
                  onClick={() => {
                    JumpToBookChapter(getLastNumbersFromUrl(chapter.url).join('-'));
                  }}
                >
                  {chapter.name}
                </a>
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="mx-auto height-full">
      <p className="text-center">未找到书籍信息</p>
    </div>
  );
};

export default BookView;
