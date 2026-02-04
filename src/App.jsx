import { Suspense, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ToastContainer } from './components/ui/Toast';
import { LoadingSpinner } from './components/ui/Spinner';
import { setupAuthListener } from './stores/authStore';

function App() {
  // Initialize auth listener on app mount
  useEffect(() => {
    const unsubscribe = setupAuthListener();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
      <ToastContainer />
    </>
  );
}

export default App;
