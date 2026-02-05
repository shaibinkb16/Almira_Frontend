import { Card } from '@/components/ui/Card';
import { APP_NAME } from '@/config/constants';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <Card className="p-8">
          <div className="prose prose-gray max-w-none">
            <h2>1. Introduction</h2>
            <p>
              {APP_NAME} ("we," "our," or "us") is committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you visit our website and make purchases.
            </p>

            <h2>2. Information We Collect</h2>

            <h3>Personal Information</h3>
            <p>We collect information that you provide directly to us, including:</p>
            <ul>
              <li>Name and contact information (email, phone, address)</li>
              <li>Account credentials (username, password)</li>
              <li>Payment information (processed securely by payment providers)</li>
              <li>Order history and preferences</li>
              <li>Communication preferences</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <ul>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>IP address</li>
              <li>Cookies and usage data</li>
              <li>Pages viewed and time spent on site</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use collected information for:</p>
            <ul>
              <li>Processing and fulfilling orders</li>
              <li>Communicating about orders and updates</li>
              <li>Providing customer support</li>
              <li>Improving our products and services</li>
              <li>Sending marketing communications (with consent)</li>
              <li>Preventing fraud and ensuring security</li>
              <li>Complying with legal obligations</li>
            </ul>

            <h2>4. Information Sharing</h2>
            <p>We do not sell your personal information. We may share information with:</p>
            <ul>
              <li><strong>Service Providers:</strong> Payment processors, shipping companies, email services</li>
              <li><strong>Business Partners:</strong> Only with your explicit consent</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect rights</li>
              <li><strong>Business Transfers:</strong> In case of merger or acquisition</li>
            </ul>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your
              personal information, including:
            </p>
            <ul>
              <li>256-bit SSL encryption for data transmission</li>
              <li>Secure servers and databases</li>
              <li>Regular security audits</li>
              <li>Employee training on data protection</li>
              <li>PCI DSS compliance for payment processing</li>
            </ul>

            <h2>6. Cookies and Tracking</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Remember your preferences</li>
              <li>Analyze site usage and improve performance</li>
              <li>Provide personalized content</li>
              <li>Enable shopping cart functionality</li>
            </ul>
            <p>
              You can control cookie settings through your browser. However, disabling cookies
              may limit site functionality.
            </p>

            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your data</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Data Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Withdraw Consent:</strong> At any time for consent-based processing</li>
            </ul>

            <h2>8. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 18. We do not knowingly collect
              information from children. If you believe we have collected data from a child,
              please contact us immediately.
            </p>

            <h2>9. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party sites. We are not responsible for
              their privacy practices. Please review their privacy policies before providing
              any information.
            </p>

            <h2>10. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than India.
              We ensure appropriate safeguards are in place for such transfers.
            </p>

            <h2>11. Data Retention</h2>
            <p>
              We retain personal information for as long as necessary to fulfill purposes outlined
              in this policy, unless a longer retention period is required by law.
            </p>

            <h2>12. Marketing Communications</h2>
            <p>
              With your consent, we may send promotional emails. You can opt-out at any time by:
            </p>
            <ul>
              <li>Clicking "unsubscribe" in any email</li>
              <li>Updating preferences in your account</li>
              <li>Contacting us directly</li>
            </ul>

            <h2>13. Changes to Privacy Policy</h2>
            <p>
              We may update this policy periodically. We will notify you of significant changes
              via email or website notice. Continued use after changes constitutes acceptance.
            </p>

            <h2>14. Contact Us</h2>
            <p>
              For privacy-related questions or to exercise your rights, contact us at:
            </p>
            <p>
              Email: privacy@almira.com<br />
              Phone: +91 98765 43210<br />
              Address: 123 Fashion Street, Mumbai, Maharashtra 400001
            </p>

            <h2>15. Complaints</h2>
            <p>
              If you have concerns about our data practices, you have the right to lodge a
              complaint with the relevant data protection authority.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
