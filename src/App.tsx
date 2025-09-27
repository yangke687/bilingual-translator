import * as Tooltip from '@radix-ui/react-tooltip';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import Toaster from './components/Toaster';
import { ToastProvider } from './lib/ToastContext';
import { AuthProvier } from './lib/auth-context';
import HomePage from './pages/HomePage';
import VocabPage from './pages/VocabPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const router = createBrowserRouter([
    { path: '/', element: <HomePage /> },
    { path: '/vocab', element: <VocabPage /> },
    { path: '*', element: <NotFoundPage /> },
  ]);

  return (
    <Tooltip.Provider>
      <ToastProvider>
        <AuthProvier>
          <RouterProvider router={router} />
        </AuthProvier>
        <Toaster />
      </ToastProvider>
    </Tooltip.Provider>
  );
}

export default App;
