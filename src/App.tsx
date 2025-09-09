import * as Tooltip from '@radix-ui/react-tooltip';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import About from './pages/About';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const router = createBrowserRouter([
    { path: '/', element: <HomePage /> },
    { path: '/about', element: <About /> },
    { path: '*', element: <NotFoundPage /> },
  ]);

  return (
    <Tooltip.Provider>
      <RouterProvider router={router} />
    </Tooltip.Provider>
  );
}

export default App;
