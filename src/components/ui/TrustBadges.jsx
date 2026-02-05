import { Shield, Lock, RotateCcw, Truck, Award, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Trust badges component for building customer confidence
 * Displays security, guarantee, and service badges
 */

const trustFeatures = [
  {
    icon: Shield,
    title: '100% Secure',
    description: 'SSL Encrypted',
    color: 'text-green-600',
  },
  {
    icon: RotateCcw,
    title: '30-Day Returns',
    description: 'Money Back Guarantee',
    color: 'text-blue-600',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over ₹2,999',
    color: 'text-purple-600',
  },
  {
    icon: Award,
    title: 'Authentic',
    description: 'Certified Products',
    color: 'text-amber-600',
  },
];

export function TrustBadges({ variant = 'default', className }) {
  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-4 flex-wrap', className)}>
        {trustFeatures.map((feature) => (
          <div key={feature.title} className="flex items-center gap-2 text-gray-600">
            <feature.icon className={cn('h-4 w-4', feature.color)} />
            <span className="text-sm font-medium">{feature.title}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {trustFeatures.map((feature) => (
        <div
          key={feature.title}
          className="flex flex-col items-center text-center p-4 bg-white rounded-lg border border-gray-200 hover:border-amber-500 transition-colors"
        >
          <feature.icon className={cn('h-8 w-8 mb-2', feature.color)} />
          <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
          <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Security badges for checkout and footer
 */
export function SecurityBadges({ className }) {
  return (
    <div className={cn('flex items-center gap-4 flex-wrap', className)}>
      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-green-600" />
        <span className="text-sm text-gray-600">256-bit SSL Secure</span>
      </div>
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-blue-600" />
        <span className="text-sm text-gray-600">PCI DSS Compliant</span>
      </div>
      <div className="flex items-center gap-2">
        <Award className="h-4 w-4 text-amber-600" />
        <span className="text-sm text-gray-600">Certified Authentic</span>
      </div>
    </div>
  );
}

/**
 * Payment method logos
 */
export function PaymentMethods({ variant = 'default', className }) {
  const paymentMethods = [
    { name: 'Visa', logo: '💳' },
    { name: 'Mastercard', logo: '💳' },
    { name: 'Amex', logo: '💳' },
    { name: 'UPI', logo: '📱' },
    { name: 'PayPal', logo: 'PP' },
    { name: 'COD', logo: '💵' },
  ];

  if (variant === 'icons') {
    return (
      <div className={cn('flex items-center gap-2 flex-wrap', className)}>
        {paymentMethods.map((method) => (
          <div
            key={method.name}
            className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center text-xs font-semibold text-gray-600 hover:border-amber-500 transition-colors"
            title={method.name}
          >
            <span className="text-lg">{method.logo}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2 text-gray-600">
        <CreditCard className="h-4 w-4" />
        <span className="text-sm font-medium">Accepted Payment Methods:</span>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {/* Visa */}
        <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center">
          <svg className="h-5" viewBox="0 0 48 16" fill="none">
            <rect width="48" height="16" rx="2" fill="white"/>
            <path d="M19.8 12h-2.4l1.5-8h2.4l-1.5 8zm7.8-7.8c-.5-.2-1.2-.4-2.1-.4-2.3 0-3.9 1.2-3.9 2.9 0 1.3 1.1 2 2 2.4.9.4 1.2.7 1.2 1.1 0 .6-.7.9-1.4.9-.9 0-1.4-.1-2.2-.5l-.3-.1-.3 1.9c.5.2 1.5.4 2.5.4 2.4 0 4-1.2 4-3 0-1-.6-1.8-1.9-2.4-.8-.4-1.3-.6-1.3-1 0-.4.4-.7 1.3-.7.7 0 1.3.2 1.7.3l.2.1.3-1.8zm6 7.8h-2.1c-.4 0-.6-.2-.8-.5l-2.8-6.7h2.4l.5 1.3h2.9l.3-1.3H36l-1.9 8h-.5zm-2.6-3.2l1.2-3.3.7 3.3h-1.9zM14 4l-2.4 5.4-.3-1.3c-.5-1.6-1.9-3.3-3.6-4.2l2.2 7.9h2.4l3.5-8h-2.4l.6.2z" fill="#1434CB"/>
          </svg>
        </div>

        {/* Mastercard */}
        <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center">
          <svg className="h-5" viewBox="0 0 48 30" fill="none">
            <circle cx="18" cy="15" r="10" fill="#EB001B"/>
            <circle cx="30" cy="15" r="10" fill="#F79E1B"/>
            <path d="M24 9c-1.3 1.4-2 3.2-2 5s.7 3.6 2 5c1.3-1.4 2-3.2 2-5s-.7-3.6-2-5z" fill="#FF5F00"/>
          </svg>
        </div>

        {/* American Express */}
        <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center">
          <svg className="h-5" viewBox="0 0 48 30" fill="none">
            <rect width="48" height="30" rx="2" fill="#006FCF"/>
            <text x="24" y="20" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">AMEX</text>
          </svg>
        </div>

        {/* UPI */}
        <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center">
          <span className="text-sm font-bold text-orange-600">UPI</span>
        </div>

        {/* PayPal */}
        <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center">
          <svg className="h-4" viewBox="0 0 100 32" fill="none">
            <path d="M12 4h-8l-4 24h6l1-6h4c6 0 10-3 11-8 1-5-2-10-10-10zm0 11h-3l1-6h3c3 0 4 1 4 3s-2 3-5 3z" fill="#003087"/>
            <path d="M35 4h-8l-4 24h6l1-6h4c6 0 10-3 11-8 1-5-2-10-10-10zm0 11h-3l1-6h3c3 0 4 1 4 3s-2 3-5 3z" fill="#009CDE"/>
          </svg>
        </div>

        {/* COD */}
        <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center">
          <span className="text-xs font-bold text-gray-700">COD</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Guarantee badge for product pages
 */
export function GuaranteeBadge({ className }) {
  return (
    <div className={cn('inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg', className)}>
      <Shield className="h-5 w-5 text-green-600" />
      <div>
        <p className="text-sm font-semibold text-green-900">100% Authentic Guarantee</p>
        <p className="text-xs text-green-700">30-Day Money Back</p>
      </div>
    </div>
  );
}

/**
 * Quick trust indicators for checkout
 */
export function CheckoutTrustIndicators({ className }) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <Lock className="h-4 w-4 text-green-600" />
        <span>Your payment information is secure and encrypted</span>
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <Shield className="h-4 w-4 text-blue-600" />
        <span>PCI DSS Level 1 certified payment processing</span>
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <RotateCcw className="h-4 w-4 text-purple-600" />
        <span>30-day hassle-free return policy</span>
      </div>
    </div>
  );
}

export default TrustBadges;
