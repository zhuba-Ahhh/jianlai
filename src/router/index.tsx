import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import BookList from '../views/BookListView';
import SearchPage from '../views/SearchView';
import BookView from '../views/BookView';
import BookChapter from '../views/BookChapter';
import Navbar from '../components/Navbar';

const router = createBrowserRouter([
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
]);

export default router;
