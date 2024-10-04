import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <ul className="navbar bg-base-100 text-base-content sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-shadow duration-100 shadow-sm p-3 bg-background/95 supports-[backdrop-filter]:bg-background/40">
      <li className="navbar-start">
        <Link to="/" className="text-2xl font-bold">
          小说
        </Link>
      </li>
      <div className="navbar-end flex-grow flex justify-end items-center space-x-4">
        {[
          { name: '剑来', path: '/' },
          { name: '雪中', path: '/xuezhong' },
          { name: '动漫', path: '/animation' },
          { name: '浪漫', path: '/romantic' },
        ].map((item, index) => (
          <li key={index} className="hover:text-black transition duration-200 ease-in-out">
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </div>
    </ul>
  );
};

export default Navbar;
