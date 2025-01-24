import { useCallback, useEffect, useState } from 'react';
import Loading from 'components/Loading';
import DisplayDateTime from 'components/DisplayDateTime';
import { http, resolveUrl } from 'utils';
import { DirectoryRes } from 'types';
import { useSearchParams } from 'react-router-dom';
import { NiXuIcon, ShunXuIcon } from 'assets/svg';

const DirectoryView = () => {
  const [searchParams] = useSearchParams();
  const [id, setId] = useState('');
  const [lastReadingRecord, setLastReadingRecord] = useState<{
    url: string;
    bookId: string;
    title: string;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    setId(searchParams.get('id') || '');
    // 获取上次阅读记录
    const record = localStorage.getItem('lastReadingRecord');
    if (record) {
      const parsedRecord = JSON.parse(record);
      if (parsedRecord.bookId === (searchParams.get('id') || '')) {
        setLastReadingRecord(parsedRecord);
      }
    }
  }, [searchParams]);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DirectoryRes>({
    chapterList: [],
    volumeList: [],
    info: {
      title: '',
      author: '',
      latestChapter: '',
      latestChapterUrl: '',
      updateTime: '',
      path: [],
    },
  });
  useEffect(() => {
    if (id) {
      http.get<DirectoryRes>(`/directory?id=${id || 672340}`).then((res) => {
        setData(res);
        setList(
          res?.volumeList.map((volumes, index) => ({
            ...volumes,
            chapters: volumes.chapters?.map((chapter, idx) => ({ ...chapter, idx })),
            idx: index,
          })) || []
        );
        setIsLoading(false);
      });
    }
  }, [id]);

  const renderBreadcrumbs = useCallback(
    () => (
      <div className="breadcrumbs text-sm m-2 mb-8 flex justify-between bg-base-200/50 p-3 rounded-lg backdrop-blur-sm">
        <ul className="flex gap-2">
          {data?.info?.path?.map((item: string, index) => (
            <li
              key={item + index}
              className="cursor-pointer hover:text-primary transition-colors duration-300"
            >
              {item}
              {index < (data?.info?.path?.length || 0) - 1 && (
                <span className="mx-2 text-base-content/50">/</span>
              )}
            </li>
          ))}
        </ul>
        <DisplayDateTime />
      </div>
    ),
    [data]
  );

  const renderInfo = useCallback(
    () => (
      <div className="flex flex-col gap-4 p-4 bg-base-200/30 rounded-lg">
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <div className="flex items-center gap-2">
            <span className="text-primary font-medium">作者</span>
            <span className="px-3 py-1 bg-base-100/50 rounded-full text-base-content/80">
              {data?.info?.author}
            </span>
          </div>
          <div className="h-4 w-px bg-base-content/20 hidden md:block" />
          <div className="flex items-center gap-2">
            <span className="text-primary font-medium">最新章节</span>
            <span
              className="px-3 py-1 bg-base-100/50 rounded-full text-base-content/80 max-w-[400px] truncate"
              title={data?.info?.latestChapter?.replace('最新章节：', '')}
            >
              {data?.info?.latestChapter?.replace('最新章节：', '')}
            </span>
          </div>
        </div>
        <div className="flex justify-center items-center gap-2">
          <span className="text-primary font-medium">更新时间</span>
          <span className="px-3 py-1 bg-base-100/50 rounded-full text-base-content/80">
            {data?.info?.updateTime?.replace('更新时间：', '')}
          </span>
        </div>
      </div>
    ),
    [data]
  );

  const [list, setList] = useState<DirectoryRes['volumeList']>([]);
  const handleSwitchChange = useCallback((check: boolean) => {
    const sortOrder = check ? -1 : 1; // 1 为升序，-1 为倒序
    setIsChecked(check);
    setList((prevList) =>
      prevList
        .slice() // 创建列表的副本
        .sort((a, b) => (a.idx - b.idx) * sortOrder) // 根据 sortOrder 进行排序
        .map((volume) => ({
          ...volume,
          chapters: [...volume.chapters].sort((c1, c2) => (c1.idx - c2.idx) * sortOrder), // 根据 sortOrder 对章节排序
        }))
    );
  }, []);

  const [isChecked, setIsChecked] = useState(false);

  const renderVolumeList = useCallback(
    () =>
      list?.map((volume, index) => (
        <div
          key={JSON.stringify(volume) + index}
          className={`${index !== 0 ? 'mt-8' : ''} transition-all duration-500`}
        >
          <div className="flex items-center justify-between mb-4 bg-gradient-to-r from-base-100 to-base-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center">
              <em className="border-l-4 border-primary pr-2 inline-block h-[17px]"></em>
              <h2 className="text-2xl mr-2 font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                {volume?.volume.name}
              </h2>
              <span className="text-base-content/80">
                共{volume?.volume.chapterCount}
                章·本卷共
                {volume?.volume.totalWords}字
              </span>
            </div>
            {index === 0 && (
              <label className="swap swap-rotate ml-6 hover:scale-110 transition-transform duration-200">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleSwitchChange(!isChecked)}
                />
                <div className="swap-on text-primary">
                  <ShunXuIcon />
                </div>
                <div className="swap-off text-primary">
                  <NiXuIcon />
                </div>
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {volume?.chapters.map((chapter, chapterIndex) => {
              const [id, chapterId] = resolveUrl(chapter.url);
              return (
                <div
                  key={JSON.stringify(chapter) + chapterIndex}
                  className="col-span-1 cursor-pointer transition-all duration-300 ease-in-out"
                >
                  <a
                    href={`/chapter?id=${id}&chapterId=${chapterId}`}
                    className="hover:text-primary transition-colors duration-300 block p-4 rounded-lg hover:bg-base-200/70 active:scale-95 border border-base-content/10 truncate tooltip tooltip-primary"
                    data-tip={chapter.name}
                  >
                    {chapter.name}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )),
    [list, handleSwitchChange, isChecked]
  );

  const renderLastReadingRecord = useCallback(
    () =>
      lastReadingRecord && (
        <div className="animate-slideDown mb-6 p-4 bg-base-200/50 rounded-lg backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-primary font-medium">继续阅读</span>
              <span className="text-base-content/80">{lastReadingRecord.title}</span>
            </div>
            <a
              href={lastReadingRecord.url}
              className="btn btn-ghost btn-sm hover:text-primary transition-colors duration-300"
            >
              继续阅读
            </a>
          </div>
        </div>
      ),
    [lastReadingRecord]
  );

  return (
    <main className="container mx-auto transition-all duration-300 ease-in-out">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="opacity-0 animate-fadeIn">
          {renderBreadcrumbs()}
          <div className="bg-[--modBgColor] p-6 md:p-12 w-full max-w-[960px] mx-auto rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
            {renderLastReadingRecord()}
            <h1 className="text-center text-3xl mb-6">{data?.info?.title}</h1>
            {renderInfo()}
            <div className="w-full border-b border-dashed mt-3 mb-6" />
            {renderVolumeList()}
          </div>
        </div>
      )}
    </main>
  );
};

export default DirectoryView;
