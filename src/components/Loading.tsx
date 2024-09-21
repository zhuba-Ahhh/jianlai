import { Spinner } from '@nextui-org/react';
const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Spinner color="default" />
    </div>
  );
};

export default Loading;
