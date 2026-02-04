import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  Download,
  ChevronDown,
  Calendar,
  ArrowUpDown,
} from 'lucide-react';
import { cn, formatPrice, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import {
  FadeInOnScroll,
  StaggerChildren,
  StaggerItem,
} from '@/components/ui';
import { useUIStore } from '@/stores/uiStore';
import { ROUTES } from '@/config/routes';
import { AVATARS } from '@/data/sampleData';

// Sample orders
const sampleOrders = [
  {
    id: 'ORD-2024-001',
    customer: {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      avatar: AVATARS.woman1,
    },
    items: [
      { name: 'Kundan Necklace Set', quantity: 1, price: 12999 },
      { name: 'Pearl Earrings', quantity: 1, price: 3000 },
    ],
    total: 15999,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    shippingAddress: '123 Main Street, Mumbai, MH 400001',
    createdAt: '2024-01-15T10:30:00',
    updatedAt: '2024-01-18T11:30:00',
  },
  {
    id: 'ORD-2024-002',
    customer: {
      name: 'Anjali Patel',
      email: 'anjali@example.com',
      avatar: AVATARS.woman2,
    },
    items: [
      { name: 'Antique Gold Bangles Set', quantity: 1, price: 7499 },
      { name: 'Oxidized Silver Anklets', quantity: 1, price: 1000 },
    ],
    total: 8499,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'Card',
    shippingAddress: '456 Park Avenue, Delhi 110001',
    createdAt: '2024-01-20T09:00:00',
    updatedAt: '2024-01-21T15:00:00',
  },
  {
    id: 'ORD-2024-003',
    customer: {
      name: 'Meera Reddy',
      email: 'meera@example.com',
      avatar: AVATARS.woman3,
    },
    items: [
      { name: 'Diamond Studded Ring', quantity: 1, price: 45999 },
    ],
    total: 45999,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'Net Banking',
    shippingAddress: '789 Lake View, Bangalore 560001',
    createdAt: '2024-01-25T16:00:00',
    updatedAt: '2024-01-25T17:00:00',
  },
  {
    id: 'ORD-2024-004',
    customer: {
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      avatar: AVATARS.man1,
    },
    items: [
      { name: 'Designer Silk Saree', quantity: 1, price: 19999 },
    ],
    total: 19999,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'COD',
    shippingAddress: '321 Green Road, Chennai 600001',
    createdAt: '2024-01-26T12:00:00',
    updatedAt: '2024-01-26T12:00:00',
  },
  {
    id: 'ORD-2024-005',
    customer: {
      name: 'Sneha Gupta',
      email: 'sneha@example.com',
      avatar: AVATARS.woman4,
    },
    items: [
      { name: 'Gold Plated Temple Jhumkas', quantity: 2, price: 9998 },
    ],
    total: 9998,
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'Card',
    shippingAddress: '555 Hill View, Hyderabad 500001',
    createdAt: '2024-01-22T14:00:00',
    updatedAt: '2024-01-23T10:00:00',
  },
];

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Pending' },
  processing: { color: 'bg-blue-100 text-blue-700', icon: Package, label: 'Processing' },
  shipped: { color: 'bg-purple-100 text-purple-700', icon: Truck, label: 'Shipped' },
  delivered: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Cancelled' },
};

const paymentStatusColors = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
};

const statusOptions = ['All Status', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const dateOptions = ['All Time', 'Today', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days'];

function OrdersPage() {
  const [orders, setOrders] = useState(sampleOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateFilter, setDateFilter] = useState('All Time');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [actionMenu, setActionMenu] = useState(null);

  const { showSuccess } = useUIStore();

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' ||
      order.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    showSuccess(`Order status updated to ${newStatus}`);
    setActionMenu(null);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
    setActionMenu(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <FadeInOnScroll>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-500 mt-1">{filteredOrders.length} orders found</p>
          </div>
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
            Export Orders
          </Button>
        </div>
      </FadeInOnScroll>

      {/* Stats Cards */}
      <StaggerChildren staggerDelay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total', value: orders.length, color: 'bg-gray-500' },
            { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'bg-yellow-500' },
            { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, color: 'bg-blue-500' },
            { label: 'Shipped', value: orders.filter(o => o.status === 'shipped').length, color: 'bg-purple-500' },
            { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: 'bg-green-500' },
          ].map((stat) => (
            <StaggerItem key={stat.label}>
              <motion.div
                className="bg-white rounded-xl p-4 shadow-sm"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-3">
                  <div className={cn('w-3 h-3 rounded-full', stat.color)} />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </div>
      </StaggerChildren>

      {/* Filters */}
      <FadeInOnScroll>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by order ID, customer name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-44"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Select>
            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full md:w-40"
            >
              {dateOptions.map((date) => (
                <option key={date} value={date}>{date}</option>
              ))}
            </Select>
          </div>
        </div>
      </FadeInOnScroll>

      {/* Orders Table */}
      <FadeInOnScroll>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">
                    <button className="flex items-center gap-1 hover:text-gray-700">
                      Order <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">Customer</th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">Items</th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">
                    <button className="flex items-center gap-1 hover:text-gray-700">
                      Total <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">Payment</th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">
                    <button className="flex items-center gap-1 hover:text-gray-700">
                      Date <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="py-4 px-4 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <AnimatePresence>
                  {filteredOrders.map((order, index) => {
                    const StatusIcon = statusConfig[order.status].icon;

                    return (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">{order.id}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar src={order.customer.avatar} alt={order.customer.name} size="sm" />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{order.customer.name}</p>
                              <p className="text-xs text-gray-500">{order.customer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-600">{order.items.length} items</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">{formatPrice(order.total)}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
                            statusConfig[order.status].color
                          )}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[order.status].label}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <span className={cn(
                              'px-2 py-0.5 rounded-full text-xs font-medium',
                              paymentStatusColors[order.paymentStatus]
                            )}>
                              {order.paymentStatus}
                            </span>
                            <p className="text-xs text-gray-400 mt-1">{order.paymentMethod}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-900">{formatDate(order.createdAt)}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="relative">
                            <button
                              onClick={() => setActionMenu(actionMenu === order.id ? null : order.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <MoreVertical className="h-4 w-4 text-gray-500" />
                            </button>

                            {/* Action Menu */}
                            <AnimatePresence>
                              {actionMenu === order.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border z-10"
                                >
                                  <div className="py-1">
                                    <button
                                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                      onClick={() => handleViewDetails(order)}
                                    >
                                      <Eye className="h-4 w-4" />
                                      View Details
                                    </button>
                                    <hr className="my-1" />
                                    <p className="px-4 py-1 text-xs text-gray-400 font-medium">
                                      Update Status
                                    </p>
                                    {['pending', 'processing', 'shipped', 'delivered'].map((status) => (
                                      <button
                                        key={status}
                                        className={cn(
                                          'w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 capitalize',
                                          order.status === status ? 'text-amber-600 font-medium' : 'text-gray-700'
                                        )}
                                        onClick={() => handleUpdateStatus(order.id, status)}
                                      >
                                        {order.status === status && <CheckCircle className="h-3 w-3" />}
                                        <span className={order.status === status ? '' : 'ml-5'}>{status}</span>
                                      </button>
                                    ))}
                                    <hr className="my-1" />
                                    <button
                                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                      onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                    >
                                      <XCircle className="h-4 w-4" />
                                      Cancel Order
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <div className="px-4 py-4 border-t flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing 1-{filteredOrders.length} of {filteredOrders.length} orders
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </FadeInOnScroll>

      {/* Order Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Order ${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm text-gray-500">Order Status</p>
                <span className={cn(
                  'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mt-1',
                  statusConfig[selectedOrder.status].color
                )}>
                  {statusConfig[selectedOrder.status].label}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Payment Status</p>
                <span className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium mt-1 inline-block',
                  paymentStatusColors[selectedOrder.paymentStatus]
                )}>
                  {selectedOrder.paymentStatus}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Avatar src={selectedOrder.customer.avatar} alt={selectedOrder.customer.name} />
                <div>
                  <p className="font-medium text-gray-900">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.customer.email}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Shipping Address</h4>
              <p className="text-gray-600 p-4 bg-gray-50 rounded-xl">{selectedOrder.shippingAddress}</p>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">{formatPrice(item.price)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">{formatPrice(selectedOrder.total)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
              <Button className="flex-1">
                <Truck className="h-4 w-4 mr-2" />
                Update Shipping
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default OrdersPage;
