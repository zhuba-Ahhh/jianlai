// 解析链接
export const resolveUrl = (url: string) => {
  const match = url.match(/(\d+)\/(\d+)/);

  return [match?.[1] || '', match?.[2] || ''];
};
