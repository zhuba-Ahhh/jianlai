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
      NProgress.set(percentage / 100);
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
      });
    }
  }, [url]);

  const bookId = useMemo(() => {
    const match = url?.match(/chapter\?id=(\d+)&chapterId=\d+/);
    if (match && match[1]) {
      return match[1];
    } else {
      return '';
    }
  }, [url]);

  const renderBreadcrumbs = useCallback(
    () => (
      <div className="breadcrumbs text-sm m-2 mb-6 flex justify-between">
        <ul>
          {data?.path?.map((item: string, index) => (
            <li key={item + index} className="cursor-pointer no-underline hover:underline">
              {item}
            </li>
          ))}
          <li>
            <a href={`/directory?id=${bookId}`} className="no-underline hover:no-underline">
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
      <div className="flex">
        <span className="flex-1 text-center">作者：{data?.author}</span>
        <span className="flex-1 text-center">本章字数：{data?.wordCount}</span>
        <span className="flex-1 text-center">更新时间：{data?.updateTime}</span>
      </div>
    ),
    [data]
  );

  const renderBtns = useCallback(() => {
    const [id, chapterId] = resolveUrl(data?.preUrl || '');
    const [id1, chapterId1] = resolveUrl(data?.nextUrl || '');
    return (
      <div className="flex mx-auto mt-6 w-full max-w-[960px] bg-[--modBgColor] justify-evenly items-center h-12">
        <div>{id && <a href={`/chapter?id=${id}&chapterId=${chapterId}`}>上一章</a>}</div>
        <div>
          <a href={`/directory?id=${bookId}`}>目录</a>
        </div>
        <div>{id1 && <a href={`/chapter?id=${id1}&chapterId=${chapterId1}`}>下一章</a>}</div>
      </div>
    );
  }, [data, bookId]);

  return (
    <main className="container mx-auto">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {renderBreadcrumbs()}
          <div className="bg-[--modBgColor] p-6 md:p-12 w-full max-w-[960px] mx-auto rounded-lg">
            <h1 className="text-center text-3xl mb-6">{data?.title}</h1>
            {renderInfo()}
            {data?.content && (
              <>
                <div className="w-full border-b border-dashed mt-3 mb-6" />
                <div dangerouslySetInnerHTML={{ __html: data?.content }} className="content" />
              </>
            )}
          </div>
          {renderBtns()}
          <div className="h-8" />
        </>
      )}
    </main>
  );
};

export default ChapterView;
