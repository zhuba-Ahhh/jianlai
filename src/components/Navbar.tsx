import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 fixed w-full">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          剑来小说
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-white hover:text-gray-300">
              首页
            </Link>
          </li>
          <li>
            <Link to="/list" className="text-white hover:text-gray-300">
              章节列表
            </Link>
          </li>
          <li>
            <Link to="/search" className="text-white hover:text-gray-300">
              搜索
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
