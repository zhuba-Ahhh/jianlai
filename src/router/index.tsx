import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import BookList from '../views/BookListView';
import SearchPage from '../views/SearchView';
import BookView from '../views/BookView';
import BookChapter from '../views/BookChapter';
import Navbar from '../components/Navbar';
import XueZhongView from '../views/XueZhongView';
import AnimationView from 'views/AnimationView';
import RomanticView from 'views/RomanticView';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <>
          <Navbar />
          <App />
        </>
      ),
    },
    {
      path: '/list',
      element: (
        <>
          <Navbar />
          <BookList />
        </>
      ),
    },
    {
      path: '/xuezhong',
      element: (
        <>
          <Navbar />
          <XueZhongView />
        </>
      ),
    },
    {
      path: '/animation',
      element: (
        <>
          <Navbar />
          <AnimationView />
        </>
      ),
    },
    {
      path: '/romantic',
      element: (
        <>
          <Navbar />
          <RomanticView />
        </>
      ),
    },
    {
      path: '/search',
      element: (
        <>
          <Navbar />
          <SearchPage />
        </>
      ),
    },
    {
      path: '/book/:name',
      element: (
        <>
          <Navbar />
          <BookView />
        </>
      ),
    },
    {
      path: '/chapter/:url',
      element: (
        <>
          <Navbar />
          <BookChapter />
        </>
      ),
    },
    {
      path: '*', // 匹配所有未定义的路径
      element: <Navigate to="/" />, // 重定向到首页
    },
  ]
  // { basename: process.env.NODE_ENV === 'production' ? '/jianlai' : '' }
);

export default router;
