import { useEffect, useState } from 'react';
import DictumList from '../components/DictumList';
import Loading from '../components/Loading';
import { dictums2 } from 'data';

const AnimationView = () => {
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
        <DictumList origin="烽火戏诸侯《雪中悍刀行》" dictums={dictums2} />
      )}
    </main>
  );
};

export default AnimationView;
