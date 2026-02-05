import { Card } from '@/components/ui/Card';
import { APP_NAME } from '@/config/constants';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Cookie Policy
        </h1>
        <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <Card className="p-8">
          <div className="prose prose-gray max-w-none">
            <h2>1. What Are Cookies</h2>
            <p>
              Cookies are small text files that are stored on your computer or mobile device when
              you visit a website. They are widely used to make websites work more efficiently and
              provide information to website owners.
            </p>

            <h2>2. How We Use Cookies</h2>
            <p>
              {APP_NAME} uses cookies to enhance your browsing experience, analyze site traffic,
              and personalize content. We use both session cookies (temporary) and persistent
              cookies (stored on your device).
            </p>

            <h2>3. Types of Cookies We Use</h2>

            <h3>Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly. They enable core
              functionality such as security, authentication, and shopping cart operations.
            </p>
            <ul>
              <li>Session management cookies</li>
              <li>Authentication cookies</li>
              <li>Shopping cart cookies</li>
              <li>Security cookies</li>
            </ul>

            <h3>Performance Cookies</h3>
            <p>
              These cookies collect information about how visitors use our website, such as which
              pages are visited most often. This helps us improve our website performance.
            </p>
            <ul>
              <li>Analytics cookies (Google Analytics)</li>
              <li>Page load time tracking</li>
              <li>Error reporting cookies</li>
            </ul>

            <h3>Functional Cookies</h3>
            <p>
              These cookies allow the website to remember choices you make and provide enhanced
              features and personalization.
            </p>
            <ul>
              <li>Language preference cookies</li>
              <li>Region selection cookies</li>
              <li>User interface customization</li>
              <li>Remembered login details</li>
            </ul>

            <h3>Advertising Cookies</h3>
            <p>
              These cookies are used to deliver advertisements relevant to you and your interests.
              They also help measure the effectiveness of advertising campaigns.
            </p>
            <ul>
              <li>Targeted advertising cookies</li>
              <li>Social media cookies (Facebook, Instagram)</li>
              <li>Retargeting cookies</li>
              <li>Conversion tracking cookies</li>
            </ul>

            <h2>4. Third-Party Cookies</h2>
            <p>
              We work with third-party service providers who may set cookies on your device. These
              include:
            </p>
            <ul>
              <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
              <li><strong>Facebook Pixel:</strong> For advertising and conversion tracking</li>
              <li><strong>Payment Processors:</strong> For secure payment processing</li>
              <li><strong>Social Media Platforms:</strong> For social sharing features</li>
            </ul>

            <h2>5. Cookie Duration</h2>
            <ul>
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain for a set period (1 month to 2 years)</li>
            </ul>

            <h2>6. Managing Cookies</h2>
            <p>
              You have the right to decide whether to accept or reject cookies. You can manage
              cookie preferences through:
            </p>

            <h3>Browser Settings</h3>
            <p>Most browsers allow you to:</p>
            <ul>
              <li>View and delete cookies</li>
              <li>Block third-party cookies</li>
              <li>Block cookies from specific sites</li>
              <li>Block all cookies</li>
              <li>Delete all cookies when closing the browser</li>
            </ul>

            <h3>Browser-Specific Instructions</h3>
            <ul>
              <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
              <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
              <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies</li>
            </ul>

            <h3>Opt-Out Tools</h3>
            <ul>
              <li>Google Analytics Opt-out: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">https://tools.google.com/dlpage/gaoptout</a></li>
              <li>Facebook Opt-out: Ad preferences in your Facebook settings</li>
            </ul>

            <h2>7. Impact of Disabling Cookies</h2>
            <p>
              Please note that blocking cookies may impact your experience on our website:
            </p>
            <ul>
              <li>You may not be able to use shopping cart features</li>
              <li>You'll need to log in on every visit</li>
              <li>Website functionality may be limited</li>
              <li>Personalization features won't work</li>
              <li>You may see irrelevant advertisements</li>
            </ul>

            <h2>8. Cookies We Set</h2>
            <table className="min-w-full divide-y divide-gray-200 my-4">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Cookie Name</th>
                  <th className="px-4 py-2 text-left">Purpose</th>
                  <th className="px-4 py-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">session_id</td>
                  <td className="px-4 py-2">User session management</td>
                  <td className="px-4 py-2">Session</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">auth_token</td>
                  <td className="px-4 py-2">Authentication</td>
                  <td className="px-4 py-2">30 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">cart_items</td>
                  <td className="px-4 py-2">Shopping cart</td>
                  <td className="px-4 py-2">7 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">preferences</td>
                  <td className="px-4 py-2">User preferences</td>
                  <td className="px-4 py-2">1 year</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">_ga</td>
                  <td className="px-4 py-2">Google Analytics</td>
                  <td className="px-4 py-2">2 years</td>
                </tr>
              </tbody>
            </table>

            <h2>9. Web Beacons and Pixels</h2>
            <p>
              In addition to cookies, we may use web beacons (also called pixels or tracking pixels)
              to collect information about your visit. These are small transparent images used to
              track user behavior and measure campaign effectiveness.
            </p>

            <h2>10. Do Not Track Signals</h2>
            <p>
              Some browsers have a "Do Not Track" feature that lets you tell websites you don't want
              to have your online activities tracked. We currently do not respond to Do Not Track
              signals.
            </p>

            <h2>11. Mobile Devices</h2>
            <p>
              Mobile devices have settings to control advertising tracking:
            </p>
            <ul>
              <li><strong>iOS:</strong> Settings → Privacy → Advertising → Limit Ad Tracking</li>
              <li><strong>Android:</strong> Settings → Google → Ads → Opt out of Ads Personalization</li>
            </ul>

            <h2>12. Updates to Cookie Policy</h2>
            <p>
              We may update this Cookie Policy periodically to reflect changes in our practices or
              for legal/regulatory reasons. Please check this page regularly for updates.
            </p>

            <h2>13. Contact Us</h2>
            <p>
              If you have questions about our use of cookies, please contact us at:
            </p>
            <p>
              Email: privacy@almira.com<br />
              Phone: +91 98765 43210<br />
              Address: 123 Fashion Street, Mumbai, Maharashtra 400001
            </p>

            <h2>14. Consent</h2>
            <p>
              By continuing to use our website, you consent to our use of cookies as described in
              this policy. You can withdraw consent at any time by adjusting your cookie settings.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
