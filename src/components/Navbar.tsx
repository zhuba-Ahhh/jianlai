import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <ul className="navbar bg-base-100 text-base-content sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-shadow duration-100 [transform:translate3d(0,0,0)] shadow-sm">
      <li className="navbar-start">
        <Link to="/" className="text-2xl font-bold">
          小说
        </Link>
      </li>
      <div className="navbar-end flex-grow flex justify-end items-center space-x-4">
        <li className="hover:text-black transition duration-200 ease-in-out">
          <Link to="/">首页</Link>
        </li>
        <li className="hover:text-black transition duration-200 ease-in-out">
          <Link to="/list">小说列表</Link>
        </li>
        <li className="hover:text-black transition duration-200 ease-in-out">
          <Link to="/search">搜索</Link>
        </li>
      </div>
    </ul>
  );
};

export default Navbar;
