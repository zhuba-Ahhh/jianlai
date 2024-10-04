import { uuid } from 'zhuba-tools';
import { createSwapy } from 'swapy';

import { dictums as defalutDictums, dictumsType } from '../data/dictum';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DictumList = (props: { origin?: string; dictums?: dictumsType; onClick?: () => void }) => {
  const navigate = useNavigate();
  const {
    origin = `烽火戏诸侯《剑来》`,
    dictums = defalutDictums,
    onClick = () => navigate(`/directory/672340`),
  } = props;
  useEffect(() => {
    const container = document.querySelector('#container')!;
    const swapy = createSwapy(container, {
      swapMode: 'hover',
      continuousMode: false,
    });
    swapy.onSwap(({ data }) => {
      console.log('swap', data);
      localStorage.setItem('slotItem', JSON.stringify(data.object));
    });

    swapy.onSwapEnd(({ data }) => {
      console.log('end', data);
    });

    swapy.onSwapStart(() => {
      console.log('start');
    });

    return () => {
      swapy.destroy();
    };
  }, []);

  return (
    <div className="grid gap-8 p-8 md:grid-cols-2 lg:grid-cols-3" id="container">
      {dictums.map((dictum, index) => (
        <div key={uuid()} data-swapy-slot={index} className="h-full cursor-pointer">
          <div
            className="p-8 bg-white rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-300 border border-gray-300 transform hover:-translate-y-1 hover:scale-105"
            data-swapy-item={dictum}
            onClick={() => onClick && onClick()}
          >
            <p className="text-lg font-semibold text-gray-900 leading-relaxed">
              {typeof dictum === 'string' ? dictum : dictum.dictum}
            </p>
            <p className="text-right text-[#6f7070]">
              —— {typeof dictum === 'string' ? origin : dictum.origin || '佚名'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DictumList;
