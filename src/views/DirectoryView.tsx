import { useCallback, useEffect, useState } from 'react';
import Loading from '../components/Loading';
import { http, resolveUrl } from 'utils';
import { DirectoryRes } from 'types';
import { useSearchParams } from 'react-router-dom';
import Switch from 'components/Switch';

const DirectoryView = () => {
  const [searchParams] = useSearchParams();
  const [id, setId] = useState('');
  useEffect(() => {
    setId(searchParams.get('id') || '');
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
        setList(res?.volumeList || []);
        setIsLoading(false);
      });
    }
  }, [id]);

  const renderBreadcrumbs = useCallback(
    () => (
      <div className="breadcrumbs text-sm m-2 mb-6">
        <ul>
          {data?.info?.path?.map((item: string, index) => (
            <li key={item + index} className="cursor-pointer">
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
    [data]
  );

  const renderInfo = useCallback(
    () => (
      <div className="flex">
        <span className="flex-1 text-center">作者：{data?.info?.author}</span>
        <span className="flex-1 text-center">{data?.info?.latestChapter}</span>
        <span className="flex-1 text-center">{data?.info?.updateTime}</span>
      </div>
    ),
    [data]
  );

  const [list, setList] = useState<DirectoryRes['volumeList']>([]);
  const handleSwitchChange = useCallback(
    (check: boolean) => {
      if (check) {
        setList([...list].sort((a, b) => a.volume.name.localeCompare(b.volume.name))); // 升序排序
      } else {
        setList([...list].sort((a, b) => b.volume.name.localeCompare(a.volume.name))); // 倒序排序
      }
    },
    [list]
  );

  const renderVolumeList = useCallback(
    () =>
      list?.map((volume, index) => (
        <div key={JSON.stringify(volume) + index} className={`${index !== 0 ? 'mt-8' : ''}`}>
          <div className="flex items-center mb-4">
            <em className="border-l-4 border-[#1f2937] pr-2 inline-block h-[17px]"></em>
            <h2 className="text-2xl mr-2">{volume?.volume.name}</h2>
            <span>
              共{volume?.volume.chapterCount}
              章·本卷共
              {volume?.volume.totalWords}字
            </span>
            {index === 0 && (
              <>
                <div className="ml-6">逆序：</div>
                <Switch onChange={handleSwitchChange} defaultChecked={false} />
              </>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {volume?.chapters.map((chapter, index) => {
              const [id, chapterId] = resolveUrl(chapter.url);
              return (
                <div
                  key={JSON.stringify(chapter) + index}
                  className="col-span-1 cursor-pointer truncate"
                >
                  <a href={`/chapter?id=${id}&chapterId=${chapterId}`}>{chapter.name}</a>
                </div>
              );
            })}
          </div>
        </div>
      )),
    [list, handleSwitchChange]
  );

  return (
    <main className="container mx-auto">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {renderBreadcrumbs()}
          <div className="bg-[--modBgColor] p-12 w-full max-w-[960px] mx-auto rounded-lg">
            <h1 className="text-center text-3xl mb-6">{data?.info?.title}</h1>
            {renderInfo()}
            <div className="w-full border-b border-dashed mt-3 mb-6" />
            {renderVolumeList()}
          </div>
        </>
      )}
    </main>
  );
};

export default DirectoryView;
