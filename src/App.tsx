import { useEffect, useState } from 'react';
import DictumList from './components/DictumList';
import Loading from './components/Loading';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return <main className="container mx-auto">{isLoading ? <Loading /> : <DictumList />}</main>;
}

export default App;
