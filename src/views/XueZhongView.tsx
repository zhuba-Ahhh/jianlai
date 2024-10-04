import { useEffect, useState } from 'react';
import DictumList from '../components/DictumList';
import Loading from '../components/Loading';
import { dictums1 } from 'data';
import { useNavigate } from 'react-router-dom';

const XueZhongView = () => {
  const navigate = useNavigate();
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
        <DictumList
          origin="烽火戏诸侯《雪中悍刀行》"
          dictums={dictums1}
          onClick={() => navigate(`/directory?id=189169`)}
        />
      )}
    </main>
  );
};

export default XueZhongView;
