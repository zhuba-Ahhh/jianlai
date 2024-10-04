// 章节返回类型
export interface ChapterRes {
  name: string;
  title: string;
  content: string;
  category: string;
  path: string[];
  author?: string;
  wordCount?: string;
  updateTime?: string;
  preUrl?: string;
  nextUrl?: string;
}

export interface DirectoryRes {
  info?: {
    title: string;
    author: string;
    latestChapter: string;
    latestChapterUrl: string;
    updateTime: string;
    path: string[];
  };
  chapterList: Array<{
    name: string;
    url: string;
  }>;
  volumeList: Array<{
    volume: {
      name: string;
      chapterCount: string;
      totalWords: string;
    };
    chapters: {
      name: string;
      url: string;
    }[];
  }>;
}
