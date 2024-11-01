import { useEffect, useState } from 'react';
import DictumList from './components/DictumList';
import Loading from './components/Loading';
import NProgress from 'nprogress';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    NProgress.start();
    setTimeout(() => {
      setIsLoading(false);
      NProgress.done();
    }, 1000);
  }, []);

  return <main className="container mx-auto">{isLoading ? <Loading /> : <DictumList />}</main>;
}

export default App;
