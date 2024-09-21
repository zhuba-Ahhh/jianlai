import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import BookList from '../views/BookListView';
import SearchPage from '../views/SearchView';
import BookView from '../views/BookView';
import Navbar from 'components/Navbar';

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
    path: '/book/:url',
    element: (
      <>
        <Navbar />
        <BookView />
      </>
    ),
  },
]);

export default router;
