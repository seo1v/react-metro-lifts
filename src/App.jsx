import { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Layout from './components/Layout';
import NotFound from './routes/NotFound';
import Home from './routes/Home';
import Profile from './routes/Profile';
import Feed from './routes/Feed';
import SignIn from './routes/SignIn';
import SignUp from './routes/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import Modal from './components/ui/Modal';
import { auth } from './api/firebase';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        path: '/',
        element: <Home />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/feed',
        element: <Feed />,
      },
    ],
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
]);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const init = async () => {
    await auth.authStateReady();
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      {isLoading ? (
        <Modal message='로딩 중...' />
      ) : (
        <>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={true} />
          </QueryClientProvider>
        </>
      )}
    </>
  );
}

export default App;
