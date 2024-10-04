import { useCallback, useEffect, useMemo, useState } from 'react';
import Loading from '../components/Loading';
import { http, resolveUrl } from 'utils';
import { ChapterRes } from '../types';
import './ChapterView.less';
import { useSearchParams } from 'react-router-dom';

const ChapterView = () => {
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ChapterRes | null>(null);

  useEffect(() => {
    const id = searchParams.get('id') || '';
    const chapterId = searchParams.get('chapterId') || '';
    setUrl(`https://read.zongheng.com/chapter/${id}/${chapterId}.html`);
  }, [searchParams]);
  useEffect(() => {
    if (url) {
      http
        .post<ChapterRes>('/chapter', {
          url: url || 'https://read.zongheng.com/chapter/672340/38518947.html',
        })
        .then((res) => {
          setData(res);
          setIsLoading(false);
        });
    }
  }, [url]);

  const bookId = useMemo(() => {
    const match = url?.match(/chapter\/(\d+)\//);
    if (match && match[1]) {
      return match[1];
    } else {
      return '';
    }
  }, [url]);

  const renderBreadcrumbs = useCallback(
    () => (
      <div className="breadcrumbs text-sm m-2 mb-6">
        <ul>
          {data?.path?.map((item: string, index) => (
            <li key={item + index} className="cursor-pointer">
              {item}
            </li>
          ))}
          <li>
            <a href={`/directory?id=${bookId}`}>{data?.name}</a>
          </li>
        </ul>
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
        <div>
          <a href={`/chapter?id=${id}&chapterId=${chapterId}`}>上一章</a>
        </div>
        <div>
          <a href={`/directory?id=${bookId}`}>目录</a>
        </div>
        <div>
          <a href={`/chapter?id=${id1}&chapterId=${chapterId1}`}>下一章</a>
        </div>
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
          <div className="bg-[--modBgColor] p-12 w-full max-w-[960px] mx-auto rounded-lg">
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