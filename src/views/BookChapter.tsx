import Loading from 'components/Loading';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getLastNumbersFromUrl, http } from 'utils';

type ChapterDetails = {
  text: string;
  name: string;
  next?: string;
  up?: string;
};

const BookChapter = () => {
  const navigate = useNavigate();
  const { url } = useParams<{ url: string }>();
  const [chapter, setChapter] = useState<ChapterDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        if (url) {
          const urls = url?.split('-');
          const response = await http.get<ChapterDetails>(
            `book/read/bqs/xiaoshuo/${urls[0]}/${urls[1]}.html`
          );
          setChapter(response);
        }
      } catch (error) {
        console.error('获取书籍详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [url]);

  const JumpToBookChapter = useCallback(
    (url: string) => {
      const urls = getLastNumbersFromUrl(url);
      if (urls.length > 1) {
        navigate(`/chapter/${urls.join('-')}`);
      }
    },
    [navigate]
  );

  if (loading) {
    return <Loading />;
  }

  if (!chapter) {
    return (
      <div className="mx-auto">
        <p className="text-center">未找到章节信息</p>
      </div>
    );
  }

  const StoryText = (content: string) => {
    // 将HTML字符串分解为HTML对象
    const htmlContent = {
      __html: content,
    };

    return <div dangerouslySetInnerHTML={htmlContent} />;
  };

  return (
    <div>
      <div className="flex justify-between mt-4">
        {chapter?.up && (
          <button onClick={() => JumpToBookChapter(chapter.up || '')} className="btn">
            上一章
          </button>
        )}
        {chapter?.next && (
          <button onClick={() => JumpToBookChapter(chapter.next || '')} className="btn">
            下一章
          </button>
        )}
      </div>
      <h1 className="text-center font-bold mb-4">{chapter?.name}</h1>
      {StoryText(chapter?.text || '')}
    </div>
  );
};

export default BookChapter;
