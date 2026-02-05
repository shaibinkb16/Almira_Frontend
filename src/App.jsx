import { Suspense, useEffect, useRef } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ToastContainer } from './components/ui/Toast';
import { LoadingSpinner } from './components/ui/Spinner';
import { setupAuthListener } from './stores/authStore';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const hasSetupAuth = useRef(false);

  // Initialize auth listener on app mount
  useEffect(() => {
    if (hasSetupAuth.current) return; // Prevent double execution in React Strict Mode
    hasSetupAuth.current = true;

    const unsubscribe = setupAuthListener();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
