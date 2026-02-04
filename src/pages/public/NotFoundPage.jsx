import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/config/routes';

function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-amber-600">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mt-4 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, the page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
          <Button leftIcon={<Home className="h-4 w-4" />} asChild>
            <Link to={ROUTES.HOME}>Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
