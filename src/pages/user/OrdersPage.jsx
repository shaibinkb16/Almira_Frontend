import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  ChevronRight,
  Search,
  Filter,
  Eye,
  Download,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Box,
} from 'lucide-react';
import { cn, formatPrice, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import {
  FadeInOnScroll,
  StaggerChildren,
  StaggerItem,
} from '@/components/ui';
import { ROUTES } from '@/config/routes';
import { IMAGES } from '@/data/sampleData';

// Sample orders data
const sampleOrders = [
  {
    id: 'ORD-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 15999,
    items: [
      {
        id: 1,
        name: 'Kundan Necklace Set with Matching Earrings',
        quantity: 1,
        price: 12999,
        image: IMAGES.necklace1,
      },
      {
        id: 2,
        name: 'Pearl Drop Earrings',
        quantity: 1,
        price: 3000,
        image: IMAGES.earrings2,
      },
    ],
    shipping: {
      address: '123 Main Street, Mumbai, Maharashtra 400001',
      method: 'Express Delivery',
    },
    timeline: [
      { status: 'ordered', date: '2024-01-15 10:30 AM', completed: true },
      { status: 'confirmed', date: '2024-01-15 11:00 AM', completed: true },
      { status: 'shipped', date: '2024-01-16 02:00 PM', completed: true },
      { status: 'delivered', date: '2024-01-18 11:30 AM', completed: true },
    ],
  },
  {
    id: 'ORD-2024-002',
    date: '2024-01-20',
    status: 'shipped',
    total: 8499,
    items: [
      {
        id: 3,
        name: 'Antique Gold Bangles Set',
        quantity: 1,
        price: 7499,
        image: IMAGES.bangles1,
      },
      {
        id: 4,
        name: 'Oxidized Silver Anklets',
        quantity: 1,
        price: 1000,
        image: IMAGES.anklet,
      },
    ],
    shipping: {
      address: '456 Park Avenue, Delhi 110001',
      method: 'Standard Delivery',
    },
    timeline: [
      { status: 'ordered', date: '2024-01-20 09:00 AM', completed: true },
      { status: 'confirmed', date: '2024-01-20 10:30 AM', completed: true },
      { status: 'shipped', date: '2024-01-21 03:00 PM', completed: true },
      { status: 'delivered', date: '', completed: false },
    ],
  },
  {
    id: 'ORD-2024-003',
    date: '2024-01-25',
    status: 'processing',
    total: 45999,
    items: [
      {
        id: 5,
        name: 'Diamond Studded Ring',
        quantity: 1,
        price: 45999,
        image: IMAGES.ring1,
      },
    ],
    shipping: {
      address: '789 Lake View, Bangalore 560001',
      method: 'Express Delivery',
    },
    timeline: [
      { status: 'ordered', date: '2024-01-25 04:00 PM', completed: true },
      { status: 'confirmed', date: '2024-01-25 05:00 PM', completed: true },
      { status: 'shipped', date: '', completed: false },
      { status: 'delivered', date: '', completed: false },
    ],
  },
  {
    id: 'ORD-2024-004',
    date: '2024-01-10',
    status: 'cancelled',
    total: 24999,
    items: [
      {
        id: 6,
        name: 'Designer Silk Saree - Banarasi',
        quantity: 1,
        price: 24999,
        image: IMAGES.saree1,
      },
    ],
    shipping: {
      address: '321 Green Road, Chennai 600001',
      method: 'Standard Delivery',
    },
    timeline: [
      { status: 'ordered', date: '2024-01-10 02:00 PM', completed: true },
      { status: 'cancelled', date: '2024-01-10 06:00 PM', completed: true },
    ],
  },
];

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Pending' },
  processing: { color: 'bg-blue-100 text-blue-700', icon: Box, label: 'Processing' },
  shipped: { color: 'bg-purple-100 text-purple-700', icon: Truck, label: 'Shipped' },
  delivered: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Cancelled' },
};

const filterOptions = [
  { value: 'all', label: 'All Orders' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

function OrdersPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const filteredOrders = sampleOrders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || order.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeInOnScroll>
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-500">Track and manage your orders</p>
          </div>
        </FadeInOnScroll>

        {/* Filters */}
        <FadeInOnScroll>
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by order ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full md:w-48"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </FadeInOnScroll>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 text-center shadow-sm"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">
              {search ? 'Try a different search term' : "You haven't placed any orders yet"}
            </p>
            <Button asChild>
              <Link to={ROUTES.PRODUCTS}>Start Shopping</Link>
            </Button>
          </motion.div>
        ) : (
          <StaggerChildren staggerDelay={0.1}>
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                const isExpanded = expandedOrder === order.id;

                return (
                  <StaggerItem key={order.id}>
                    <motion.div
                      layout
                      className="bg-white rounded-2xl shadow-sm overflow-hidden"
                    >
                      {/* Order Header */}
                      <div
                        className="p-4 md:p-6 cursor-pointer"
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          {/* Order Images */}
                          <div className="flex -space-x-3">
                            {order.items.slice(0, 3).map((item, index) => (
                              <motion.img
                                key={item.id}
                                src={item.image}
                                alt={item.name}
                                className="w-14 h-14 rounded-lg object-cover border-2 border-white"
                                style={{ zIndex: 3 - index }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                              />
                            ))}
                            {order.items.length > 3 && (
                              <div className="w-14 h-14 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-sm font-medium text-gray-600">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>

                          {/* Order Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-semibold text-gray-900">{order.id}</span>
                              <span className={cn(
                                'px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1',
                                statusConfig[order.status].color
                              )}>
                                <StatusIcon className="h-3 w-3" />
                                {statusConfig[order.status].label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {order.items.length} item{order.items.length > 1 ? 's' : ''} • Placed on {formatDate(order.date)}
                            </p>
                          </div>

                          {/* Order Total */}
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-bold text-gray-900">{formatPrice(order.total)}</div>
                              <p className="text-xs text-gray-500">Total Amount</p>
                            </div>
                            <motion.div
                              animate={{ rotate: isExpanded ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </motion.div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t"
                          >
                            <div className="p-4 md:p-6">
                              {/* Order Timeline */}
                              <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-4">Order Status</h4>
                                <div className="flex items-center justify-between relative">
                                  {/* Progress Line */}
                                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200">
                                    <motion.div
                                      className="h-full bg-amber-500"
                                      initial={{ width: 0 }}
                                      animate={{
                                        width: `${(order.timeline.filter(t => t.completed).length - 1) / (order.timeline.length - 1) * 100}%`
                                      }}
                                      transition={{ duration: 0.5 }}
                                    />
                                  </div>

                                  {order.timeline.map((step, index) => (
                                    <div key={step.status} className="relative z-10 text-center">
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={cn(
                                          'w-8 h-8 rounded-full flex items-center justify-center mx-auto',
                                          step.completed ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400'
                                        )}
                                      >
                                        {step.completed ? (
                                          <CheckCircle className="h-4 w-4" />
                                        ) : (
                                          <Clock className="h-4 w-4" />
                                        )}
                                      </motion.div>
                                      <p className={cn(
                                        'text-xs mt-2 capitalize',
                                        step.completed ? 'text-gray-900 font-medium' : 'text-gray-400'
                                      )}>
                                        {step.status}
                                      </p>
                                      {step.date && (
                                        <p className="text-[10px] text-gray-400">{step.date}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Order Items */}
                              <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-4">Items</h4>
                                <div className="space-y-3">
                                  {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 rounded-lg object-cover"
                                      />
                                      <div className="flex-1">
                                        <h5 className="font-medium text-gray-900">{item.name}</h5>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                      </div>
                                      <div className="font-semibold text-gray-900">
                                        {formatPrice(item.price)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Shipping Info */}
                              <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                                <p className="text-sm text-gray-600">{order.shipping.address}</p>
                                <p className="text-sm text-gray-500 mt-1">{order.shipping.method}</p>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-wrap gap-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  leftIcon={<Eye className="h-4 w-4" />}
                                >
                                  View Details
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  leftIcon={<Download className="h-4 w-4" />}
                                >
                                  Download Invoice
                                </Button>
                                {order.status === 'delivered' && (
                                  <Button size="sm">
                                    Write Review
                                  </Button>
                                )}
                                {order.status === 'shipped' && (
                                  <Button
                                    size="sm"
                                    leftIcon={<Truck className="h-4 w-4" />}
                                  >
                                    Track Package
                                  </Button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </div>
          </StaggerChildren>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
