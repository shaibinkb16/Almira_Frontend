import { Link } from 'react-router-dom';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/config/routes';

function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          You don&apos;t have permission to access this page. Please contact an
          administrator if you believe this is an error.
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

export default UnauthorizedPage;
