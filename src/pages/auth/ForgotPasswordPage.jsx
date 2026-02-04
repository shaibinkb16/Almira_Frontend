import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { forgotPasswordSchema } from '@/lib/validators';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/hooks/useAuth';

function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { requestPasswordReset, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    const result = await requestPasswordReset(data.email);
    if (result.success) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
        <p className="text-gray-600 mb-8">
          We&apos;ve sent a password reset link to{' '}
          <span className="font-medium">{getValues('email')}</span>
        </p>
        <Link
          to={ROUTES.LOGIN}
          className="text-amber-600 hover:text-amber-700 font-medium"
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to={ROUTES.LOGIN}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Sign In
      </Link>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
      <p className="text-gray-600 mb-8">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-5 w-5" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Send Reset Link
        </Button>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
