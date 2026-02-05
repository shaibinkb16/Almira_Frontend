import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUIStore } from '@/stores/uiStore';

export default function ContactPage() {
  const { showSuccess, showError } = useUIStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      showError('Please fill in all required fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement contact form submission
      // await contactService.submitContactForm(formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      showSuccess('Thank you for contacting us! We will get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      showError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have a question or need assistance? We're here to help! Reach out to us through any of
            the methods below, and our team will get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Information Cards */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Phone className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600 text-sm mb-1">+91 98765 43210</p>
                <p className="text-gray-600 text-sm">Mon-Sat: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Mail className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600 text-sm mb-1">support@almira.com</p>
                <p className="text-gray-600 text-sm">We'll respond within 24 hours</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
                <p className="text-gray-600 text-sm">123 Fashion Street</p>
                <p className="text-gray-600 text-sm">Mumbai, Maharashtra 400001</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="h-6 w-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">Send Us a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                <Send className="h-4 w-4 mr-2" />
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </Card>

          {/* Additional Information */}
          <div className="space-y-6">
            {/* Business Hours */}
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-6 w-6 text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-900">Business Hours</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium text-red-600">Closed</span>
                </div>
              </div>
            </Card>

            {/* FAQ Link */}
            <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h3>
              <p className="text-gray-600 mb-6">
                Find quick answers to common questions about orders, shipping, returns, and more.
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/faqs'}>
                Visit FAQ Page
              </Button>
            </Card>

            {/* Customer Support */}
            <Card className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Need Immediate Assistance?
              </h3>
              <p className="text-gray-600 mb-4">
                For urgent inquiries or order-related issues, please call us directly or use our
                live chat feature during business hours.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Order Support:</span>
                  <span className="font-medium">support@almira.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Bulk Orders:</span>
                  <span className="font-medium">wholesale@almira.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Careers:</span>
                  <span className="font-medium">careers@almira.com</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
