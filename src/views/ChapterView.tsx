import { useCallback, useEffect, useMemo, useState } from 'react';
import Loading from 'components/Loading';
import DisplayDateTime from 'components/DisplayDateTime';
import { http, resolveUrl } from 'utils';
import { ChapterRes } from '../types';
import './ChapterView.less';
import { useSearchParams } from 'react-router-dom';
import NProgress from 'nprogress';

const ChapterView = () => {
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ChapterRes | null>(null);

  const scrollHeight = () =>
    document.documentElement.scrollHeight - document.documentElement.clientHeight;

  const calculateScrollDistance = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop;
    const percentage = (scrollTop / scrollHeight()) * 100;
    if (percentage > 0) {
      NProgress.set(percentage / 100 - 0.0000001);
    } else {
      NProgress.done();
    }
  }, []);

  useEffect(() => {
    NProgress.start();
    window.addEventListener('scroll', calculateScrollDistance);
    return () => {
      window.removeEventListener('scroll', calculateScrollDistance);
      NProgress.done();
    };
  }, [calculateScrollDistance]);

  const bookId = useMemo(() => {
    const match = url?.match(/chapter\?id=(\d+)&chapterId=\d+/);
    if (match && match[1]) {
      return match[1];
    } else {
      return '';
    }
  }, [url]);

  useEffect(() => {
    const id = searchParams.get('id') || '';
    const chapterId = searchParams.get('chapterId') || '';
    setUrl(`/chapter?id=${id}&chapterId=${chapterId}`);
  }, [searchParams]);
  useEffect(() => {
    if (url) {
      http.get<ChapterRes>(url || '/chapter').then((res) => {
        setData(res);
        setIsLoading(false);
        // 保存阅读记录
        const readingRecord = {
          url,
          bookId,
          title: res.title,
          timestamp: new Date().toISOString(),
        };

        // 获取现有的阅读记录
        const existingRecords = localStorage.getItem('readingRecords');
        let records = existingRecords ? JSON.parse(existingRecords) : [];

        // 移除同一本书的旧记录
        records = records.filter((record: { bookId: string }) => record.bookId !== bookId);

        // 添加新记录
        records.push(readingRecord);

        // 限制记录数量，保留最新的 10 条
        if (records.length > 10) {
          records = records.slice(-10);
        }

        localStorage.setItem('readingRecords', JSON.stringify(records));
      });
    }
  }, [bookId, url]);

  const renderBreadcrumbs = useCallback(
    () => (
      <div className="breadcrumbs text-sm mx-4 mb-10 flex justify-between bg-base-200/50 p-4 rounded-xl backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
        <ul className="flex gap-2">
          {data?.path?.map((item: string, index) => (
            <li
              key={item + index}
              className="cursor-pointer hover:text-primary transition-colors duration-300"
            >
              {item}
              {index < (data?.path?.length || 0) - 1 && (
                <span className="mx-2 text-base-content/50">/</span>
              )}
            </li>
          ))}
          <li>
            <a
              href={`/directory?id=${bookId}`}
              className="hover:text-primary transition-colors duration-300"
            >
              {data?.name}
            </a>
          </li>
        </ul>
        <DisplayDateTime />
      </div>
    ),
    [data, bookId]
  );

  const renderInfo = useCallback(
    () => (
      <div className="flex flex-col gap-4 p-4 bg-base-200/30 rounded-lg">
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <div className="flex items-center gap-2">
            <span className="text-primary font-medium">作者</span>
            <span className="px-3 py-1 bg-base-100/50 rounded-full text-base-content/80">
              {data?.author}
            </span>
          </div>
          <div className="h-4 w-px bg-base-content/20 hidden md:block" />
          <div className="flex items-center gap-2">
            <span className="text-primary font-medium">本章字数</span>
            <span className="px-3 py-1 bg-base-100/50 rounded-full text-base-content/80">
              {data?.wordCount}
            </span>
          </div>
          <div className="h-4 w-px bg-base-content/20 hidden md:block" />
          <div className="flex items-center gap-2">
            <span className="text-primary font-medium">更新时间</span>
            <span className="px-3 py-1 bg-base-100/50 rounded-full text-base-content/80">
              {data?.updateTime}
            </span>
          </div>
        </div>
      </div>
    ),
    [data]
  );

  const updateReadingRecord = useCallback(
    (url: string, title: string) => {
      const readingRecord = {
        url,
        bookId,
        title,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('lastReadingRecord', JSON.stringify(readingRecord));
    },
    [bookId]
  );

  const renderBtns = useCallback(() => {
    const [id, chapterId] = resolveUrl(data?.preUrl || '');
    const [id1, chapterId1] = resolveUrl(data?.nextUrl || '');
    return (
      <div className="mt-8 flex mx-auto w-full max-w-[800px] bg-base-100/95 backdrop-blur-sm rounded-xl justify-evenly items-center h-16 shadow-lg hover:shadow-xl transition-all duration-300 px-8">
        <div className="flex-1 flex justify-center">
          {id && (
            <a
              href={`/chapter?id=${id}&chapterId=${chapterId}`}
              className="btn btn-primary btn-outline hover:scale-105 hover:shadow-md transition-all duration-300 min-w-[120px]"
              onClick={() =>
                updateReadingRecord(`/chapter?id=${id}&chapterId=${chapterId}`, data?.title || '')
              }
            >
              上一章
            </a>
          )}
        </div>
        <div className="flex-1 flex justify-center">
          <a
            href={`/directory?id=${bookId}`}
            className="btn btn-ghost hover:text-primary hover:bg-base-100/50 transition-all duration-300 min-w-[120px]"
          >
            目录
          </a>
        </div>
        <div className="flex-1 flex justify-center">
          {id1 && (
            <a
              href={`/chapter?id=${id1}&chapterId=${chapterId1}`}
              className="btn btn-primary btn-outline hover:scale-105 hover:shadow-md transition-all duration-300 min-w-[120px]"
              onClick={() =>
                updateReadingRecord(`/chapter?id=${id1}&chapterId=${chapterId1}`, data?.title || '')
              }
            >
              下一章
            </a>
          )}
        </div>
      </div>
    );
  }, [data, bookId, updateReadingRecord]);

  return (
    <main className="container mx-auto">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="opacity-0 animate-fadeIn">
          {renderBreadcrumbs()}
          <div className="bg-base-100/95 backdrop-blur-sm p-8 md:p-16 w-full max-w-[800px] mx-auto rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <h1 className="text-center text-4xl mb-10 font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">
              {data?.title}
            </h1>
            {renderInfo()}
            {data?.content && (
              <>
                <div className="w-full border-b border-base-content/10 my-8" />
                <div
                  dangerouslySetInnerHTML={{ __html: data?.content }}
                  className="content prose prose-lg max-w-none leading-relaxed prose-headings:text-primary prose-p:text-base-content/90 prose-p:leading-8 prose-p:my-6"
                />
              </>
            )}
          </div>
          {renderBtns()}
          <div className="h-8" />
        </div>
      )}
    </main>
  );
};

export default ChapterView;
