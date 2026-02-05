import { Card } from '@/components/ui/Card';
import { APP_NAME } from '@/config/constants';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Terms of Service
        </h1>
        <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <Card className="p-8">
          <div className="prose prose-gray max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using {APP_NAME}, you accept and agree to be bound by the terms
              and provision of this agreement. If you do not agree to abide by the above, please
              do not use this service.
            </p>

            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials on {APP_NAME}'s
              website for personal, non-commercial transitory viewing only.
            </p>
            <ul>
              <li>This is the grant of a license, not a transfer of title</li>
              <li>Under this license you may not modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or public display</li>
              <li>Attempt to reverse engineer any software on {APP_NAME}'s website</li>
              <li>Remove any copyright or proprietary notations from the materials</li>
            </ul>

            <h2>3. Product Information</h2>
            <p>
              We strive to provide accurate product descriptions and images. However, we do not
              warrant that product descriptions, images, pricing, or other content is accurate,
              complete, reliable, current, or error-free.
            </p>

            <h2>4. Pricing and Availability</h2>
            <ul>
              <li>All prices are in Indian Rupees (INR)</li>
              <li>Prices are subject to change without notice</li>
              <li>We reserve the right to limit quantities</li>
              <li>Product availability may vary</li>
            </ul>

            <h2>5. Orders and Payment</h2>
            <p>
              By placing an order, you warrant that you are legally capable of entering into
              binding contracts. We reserve the right to refuse or cancel any order for any reason.
            </p>

            <h2>6. Shipping and Delivery</h2>
            <p>
              We aim to dispatch orders within 2-3 business days. Delivery times are estimates
              and not guaranteed. Risk of loss and title for items pass to you upon delivery.
            </p>

            <h2>7. Returns and Refunds</h2>
            <p>
              Please refer to our Returns & Exchanges policy for detailed information about
              returns, exchanges, and refunds.
            </p>

            <h2>8. User Accounts</h2>
            <ul>
              <li>You are responsible for maintaining account security</li>
              <li>You must provide accurate registration information</li>
              <li>You are responsible for all activities under your account</li>
              <li>We reserve the right to terminate accounts for violations</li>
            </ul>

            <h2>9. Intellectual Property</h2>
            <p>
              All content on {APP_NAME}, including text, graphics, logos, images, and software,
              is the property of {APP_NAME} and protected by copyright and trademark laws.
            </p>

            <h2>10. User Content</h2>
            <p>
              By submitting reviews, photos, or other content, you grant {APP_NAME} a non-exclusive,
              royalty-free, perpetual license to use, reproduce, and display such content.
            </p>

            <h2>11. Prohibited Activities</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the site for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access</li>
              <li>Interfere with site security features</li>
              <li>Upload viruses or malicious code</li>
              <li>Harass or harm other users</li>
            </ul>

            <h2>12. Limitation of Liability</h2>
            <p>
              {APP_NAME} shall not be liable for any indirect, incidental, special, consequential,
              or punitive damages resulting from your use of the site or products.
            </p>

            <h2>13. Disclaimer</h2>
            <p>
              The materials on {APP_NAME}'s website are provided on an 'as is' basis. {APP_NAME}
              makes no warranties, expressed or implied, and hereby disclaims all other warranties.
            </p>

            <h2>14. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India,
              and you irrevocably submit to the exclusive jurisdiction of the courts in Mumbai, India.
            </p>

            <h2>15. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting. Your continued use constitutes acceptance of modified terms.
            </p>

            <h2>16. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              Email: legal@almira.com<br />
              Phone: +91 98765 43210<br />
              Address: 123 Fashion Street, Mumbai, Maharashtra 400001
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
