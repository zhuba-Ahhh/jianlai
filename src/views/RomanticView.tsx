import { useEffect, useState } from 'react';
import DictumList from '../components/DictumList';
import Loading from '../components/Loading';
import { dictums3 } from 'data';

const RomanticView = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <main className="container mx-auto">
      {isLoading ? (
        <Loading />
      ) : (
        <DictumList origin="烽火戏诸侯《雪中悍刀行》" dictums={dictums3} />
      )}
    </main>
  );
};

export default RomanticView;
