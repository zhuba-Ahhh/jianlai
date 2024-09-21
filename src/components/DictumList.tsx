import { dictums } from '../data/dictum';
import { uuid } from 'zhuba-tools';

const DictumList = () => (
  <div className="grid gap-8 p-8 md:grid-cols-2 lg:grid-cols-3">
    {dictums.map((dictum) => (
      <div
        key={uuid()}
        className="p-8 bg-white rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-300 border border-gray-300 transform hover:-translate-y-1 hover:scale-105"
      >
        <p className="text-lg font-semibold text-gray-900 leading-relaxed">{dictum}</p>
      </div>
    ))}
  </div>
);

export default DictumList;
