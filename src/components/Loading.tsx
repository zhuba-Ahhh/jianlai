const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative transform scale-100 animate-bounce">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          style={{ animationDuration: '2s' }}
        />
      </div>
      <p className="mt-4 text-gray-600 animate-pulse">加载中...</p>
    </div>
  );
};

export default Loading;
