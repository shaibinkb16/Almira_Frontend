import { useRouteError, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

export default function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error('Route error:', error);

  const isChunkError = error?.message?.includes('Failed to fetch dynamically imported module') ||
                       error?.message?.includes('Failed to fetch') ||
                       error?.message?.includes('dynamically imported');

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-amber-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isChunkError ? 'Loading Error' : 'Something went wrong'}
        </h1>

        <p className="text-gray-600 mb-6">
          {isChunkError
            ? 'The page failed to load properly. This might be due to a recent update. Please try refreshing the page.'
            : 'We encountered an unexpected error. Please try again or go back to the previous page.'}
        </p>

        {error?.status && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-semibold text-gray-900 mb-1">
              Error {error.status}
            </p>
            <p className="text-sm text-gray-600">
              {error.statusText || error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleReload}
            className="flex items-center justify-center gap-2 w-full"
          >
            <RefreshCw size={16} />
            Reload Page
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="flex items-center justify-center gap-2 flex-1"
            >
              <ArrowLeft size={16} />
              Go Back
            </Button>
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="flex items-center justify-center gap-2 flex-1"
            >
              <Home size={16} />
              Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
