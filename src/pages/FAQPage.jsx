import { useState } from 'react';
import { ChevronDown, Search, Package, CreditCard, Truck, RefreshCw, Shield, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

const FAQ_CATEGORIES = [
  {
    id: 'orders',
    title: 'Orders & Payment',
    icon: CreditCard,
    faqs: [
      {
        question: 'How do I place an order?',
        answer: 'Browse our products, add items to your cart, and proceed to checkout. You can checkout as a guest or create an account for faster future purchases. Follow the steps to enter shipping information and payment details.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept Credit/Debit Cards (Visa, Mastercard, Amex), UPI payments, Net Banking, Wallets (Paytm, PhonePe, Google Pay), and Cash on Delivery (COD) for eligible orders.',
      },
      {
        question: 'Is it safe to use my credit card on your site?',
        answer: 'Yes, absolutely! We use 256-bit SSL encryption and are PCI DSS compliant. Your payment information is processed securely by certified payment gateways. We never store your complete card details.',
      },
      {
        question: 'Can I modify or cancel my order?',
        answer: 'You can modify or cancel your order within 1 hour of placing it. Contact our customer support immediately. Once the order is processed, it cannot be cancelled, but you can return it as per our return policy.',
      },
      {
        question: 'Do you offer Cash on Delivery (COD)?',
        answer: 'Yes, COD is available for orders under ₹50,000. Additional COD charges of ₹50 may apply. COD may not be available in certain remote locations.',
      },
    ],
  },
  {
    id: 'shipping',
    title: 'Shipping & Delivery',
    icon: Truck,
    faqs: [
      {
        question: 'What are your shipping charges?',
        answer: 'We offer FREE shipping on orders over ₹2,999. For orders below ₹2,999, shipping charges are ₹99. Express shipping is available for ₹199 with guaranteed 2-day delivery in metro cities.',
      },
      {
        question: 'How long will delivery take?',
        answer: 'Standard delivery takes 5-7 business days. Metro cities: 3-5 days. Remote areas: 7-10 days. Express shipping: 2-3 days. You will receive tracking information via email once your order ships.',
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Currently, we only ship within India. We are working on expanding to international shipping soon. Sign up for our newsletter to be notified when international shipping becomes available.',
      },
      {
        question: 'Can I track my order?',
        answer: 'Yes! Once your order ships, you will receive a tracking number via email and SMS. You can track your order in real-time from your account dashboard or using the tracking link provided.',
      },
      {
        question: 'What if I\'m not home for delivery?',
        answer: 'Our delivery partners will attempt delivery 3 times. If unsuccessful, the package will be held at the local facility for 7 days. You will receive notifications to schedule re-delivery or pick up from the facility.',
      },
    ],
  },
  {
    id: 'returns',
    title: 'Returns & Exchanges',
    icon: RefreshCw,
    faqs: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy from the date of delivery. Items must be unused, unworn, and in original packaging with all tags attached. Jewelry items should be in their original boxes.',
      },
      {
        question: 'How do I return an item?',
        answer: 'Log into your account, go to Orders, select the item to return, choose a reason, and request pickup. Our team will schedule a free pickup from your address. Refunds are processed within 5-7 business days after inspection.',
      },
      {
        question: 'Can I exchange an item?',
        answer: 'Yes! You can exchange items for different size, color, or design within 30 days. The exchange process is the same as returns. Exchanges are subject to product availability.',
      },
      {
        question: 'Are there any items that cannot be returned?',
        answer: 'Pierced jewelry (earrings), personalized/customized items, items on final sale, and products without original tags cannot be returned for hygiene and customization reasons.',
      },
      {
        question: 'When will I receive my refund?',
        answer: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item. The amount will be credited to your original payment method. Bank processing may take additional 5-10 days.',
      },
    ],
  },
  {
    id: 'products',
    title: 'Products & Quality',
    icon: Package,
    faqs: [
      {
        question: 'Are your products authentic?',
        answer: 'Yes, all our products are 100% authentic and sourced directly from trusted manufacturers and brands. We guarantee the authenticity and quality of every item we sell.',
      },
      {
        question: 'Do you provide certificates for jewelry?',
        answer: 'Yes, all gold and diamond jewelry comes with authenticity certificates. Precious gemstone jewelry includes gemstone certificates. Sterling silver items are hallmarked.',
      },
      {
        question: 'What materials do you use?',
        answer: 'We use high-quality materials including 14K/18K/22K gold, sterling silver, stainless steel, brass, and authentic gemstones. Material details are provided on each product page.',
      },
      {
        question: 'How do I know my ring size?',
        answer: 'Visit our Size Guide page for detailed instructions on measuring your ring size. We provide conversion charts for US, UK, and EU sizes. You can also download our printable ring sizer.',
      },
      {
        question: 'Can I request custom designs?',
        answer: 'Yes, we offer custom design services for jewelry. Contact our design team at custom@almira.com with your requirements. Custom orders take 2-4 weeks and require 50% advance payment.',
      },
    ],
  },
  {
    id: 'account',
    title: 'Account & Privacy',
    icon: Shield,
    faqs: [
      {
        question: 'Do I need an account to shop?',
        answer: 'No, you can checkout as a guest. However, creating an account allows you to track orders, save addresses, maintain wishlist, earn rewards, and enjoy faster checkout.',
      },
      {
        question: 'How do I reset my password?',
        answer: 'Click on "Sign In" and select "Forgot Password". Enter your email address and you will receive a password reset link. Follow the instructions in the email to create a new password.',
      },
      {
        question: 'Is my personal information secure?',
        answer: 'Yes, we take data security seriously. We use industry-standard encryption, secure servers, and comply with data protection regulations. Read our Privacy Policy for detailed information.',
      },
      {
        question: 'How do I update my account information?',
        answer: 'Log into your account and go to Account Settings. You can update your name, email, phone number, shipping addresses, and password. Changes are saved automatically.',
      },
      {
        question: 'Can I delete my account?',
        answer: 'Yes, you can request account deletion by contacting support@almira.com. Please note that active orders must be completed or cancelled before deletion. This action is irreversible.',
      },
    ],
  },
  {
    id: 'other',
    title: 'Other Questions',
    icon: HelpCircle,
    faqs: [
      {
        question: 'Do you have a physical store?',
        answer: 'Yes, we have retail stores in Mumbai, Delhi, and Bangalore. Visit our Store Locator page for addresses, timings, and directions. You can also shop in-store and enjoy personal styling services.',
      },
      {
        question: 'Do you offer gift wrapping?',
        answer: 'Yes, we offer complimentary gift wrapping for all orders. Select the gift wrap option during checkout and add a personalized message. Premium gift boxes are available for ₹199.',
      },
      {
        question: 'How can I apply a discount code?',
        answer: 'Enter your coupon code in the "Discount Code" field at checkout and click Apply. The discount will be reflected in your order total. One coupon per order. Terms and conditions apply.',
      },
      {
        question: 'Do you have a loyalty program?',
        answer: 'Yes! Join our Almira Rewards program and earn points on every purchase. 1 point = ₹1 spent. Redeem points for discounts on future orders. Members get exclusive early access to sales.',
      },
      {
        question: 'How do I contact customer support?',
        answer: 'Email us at support@almira.com, call +91 98765 43210 (Mon-Sat, 9AM-6PM), or use the contact form on our Contact Us page. We respond to all inquiries within 24 hours.',
      },
    ],
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('orders');

  const toggleItem = (categoryId, index) => {
    const itemId = `${categoryId}-${index}`;
    setOpenItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredCategories = FAQ_CATEGORIES.map(category => ({
    ...category,
    faqs: category.faqs.filter(
      faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.faqs.length > 0);

  const activeData = searchQuery
    ? filteredCategories
    : FAQ_CATEGORIES.filter(cat => cat.id === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Find answers to common questions about our products, orders, shipping, and more.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3 text-lg"
            />
          </div>
        </div>

        {!searchQuery && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {FAQ_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all text-center hover:shadow-md',
                    activeCategory === category.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 bg-white hover:border-amber-200'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-6 w-6 mx-auto mb-2',
                      activeCategory === category.id ? 'text-amber-600' : 'text-gray-600'
                    )}
                  />
                  <span className={cn(
                    'text-sm font-medium',
                    activeCategory === category.id ? 'text-amber-900' : 'text-gray-700'
                  )}>
                    {category.title}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {activeData.length === 0 ? (
          <Card className="p-12 text-center">
            <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any FAQs matching your search. Try different keywords or browse by category.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Clear search
            </button>
          </Card>
        ) : (
          <div className="space-y-8">
            {activeData.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id}>
                  {searchQuery && (
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className="h-6 w-6 text-amber-600" />
                      <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                    </div>
                  )}

                  <div className="space-y-3">
                    {category.faqs.map((faq, index) => {
                      const itemId = `${category.id}-${index}`;
                      const isOpen = openItems.includes(itemId);

                      return (
                        <Card key={index} className="overflow-hidden">
                          <button
                            onClick={() => toggleItem(category.id, index)}
                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                            <ChevronDown
                              className={cn(
                                'h-5 w-5 text-gray-500 transition-transform flex-shrink-0',
                                isOpen && 'transform rotate-180'
                              )}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-4 text-gray-700 leading-relaxed">
                              {faq.answer}
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Contact Support */}
        <Card className="mt-12 p-8 bg-gradient-to-br from-amber-50 to-orange-50 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our customer support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/contact'}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              Contact Support
            </button>
            <button
              onClick={() => window.location.href = 'tel:+919876543210'}
              className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium border-2 border-gray-200 hover:border-amber-200 transition-colors"
            >
              Call +91 98765 43210
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
