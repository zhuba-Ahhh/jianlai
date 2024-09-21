import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <ul className="navbar bg-base-100">
      <li className="navbar-start">
        <Link to="/" className="text-2xl font-bold">
          剑来小说
        </Link>
      </li>
      <div className="navbar-end flex-grow flex justify-end items-center space-x-4">
        <li className="hover:text-gray-400">
          <Link to="/">首页</Link>
        </li>
        <li className="hover:text-gray-400">
          <Link to="/list">章节列表</Link>
        </li>
        <li className="hover:text-gray-400">
          <Link to="/search">搜索</Link>
        </li>
      </div>
    </ul>
  );
};

export default Navbar;
