import { Link } from 'react-router-dom';
import { Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/config/routes';

function VerifyEmailPage() {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Mail className="h-8 w-8 text-amber-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h2>
      <p className="text-gray-600 mb-8">
        We&apos;ve sent a verification link to your email address. Click the link
        to verify your account and start shopping.
      </p>

      <div className="space-y-4">
        <Button variant="outline" className="w-full">
          Resend Verification Email
        </Button>
        <Link
          to={ROUTES.LOGIN}
          className="block text-amber-600 hover:text-amber-700 font-medium"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
