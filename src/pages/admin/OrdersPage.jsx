import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Download,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  Calendar,
  ArrowUpDown,
  Printer,
  MoreVertical,
  Edit,
} from 'lucide-react';
import { cn, formatPrice, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import {
  FadeInOnScroll,
  StaggerChildren,
  StaggerItem,
} from '@/components/ui';
import { useUIStore } from '@/stores/uiStore';
import { supabase } from '@/lib/supabase/client';

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Pending' },
  confirmed: { color: 'bg-blue-100 text-blue-700', icon: CheckCircle, label: 'Confirmed' },
  processing: { color: 'bg-indigo-100 text-indigo-700', icon: Package, label: 'Processing' },
  shipped: { color: 'bg-purple-100 text-purple-700', icon: Truck, label: 'Shipped' },
  out_for_delivery: { color: 'bg-cyan-100 text-cyan-700', icon: Truck, label: 'Out for Delivery' },
  delivered: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Cancelled' },
  returned: { color: 'bg-orange-100 text-orange-700', icon: XCircle, label: 'Returned' },
  refunded: { color: 'bg-gray-100 text-gray-700', icon: XCircle, label: 'Refunded' },
};

const paymentStatusColors = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
  partially_refunded: 'bg-orange-100 text-orange-700',
};

const statusOptions = ['All Status', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
const paymentOptions = ['All Payment', 'Paid', 'Pending', 'Failed'];

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [paymentFilter, setPaymentFilter] = useState('All Payment');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeliveryDateModalOpen, setIsDeliveryDateModalOpen] = useState(false);
  const [actionMenu, setActionMenu] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const { showSuccess, showError } = useUIStore();

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            phone,
            avatar_url
          ),
          order_items (
            id,
            product_name,
            product_image,
            product_sku,
            variant_name,
            quantity,
            unit_price,
            discount_amount,
            total_price
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      order.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      order.profiles?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All Status' ||
      order.status === statusFilter.toLowerCase().replace(/ /g, '_');

    const matchesPayment =
      paymentFilter === 'All Payment' ||
      order.payment_status === paymentFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Update order status
  const handleUpdateStatus = async (orderId, status) => {
    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString(),
      };

      // Add timestamp for status changes
      if (status === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString();
      } else if (status === 'shipped') {
        updateData.shipped_at = new Date().toISOString();
      } else if (status === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      showSuccess(`Order status updated to ${status}`);
      fetchOrders();
      setIsStatusModalOpen(false);
      setActionMenu(null);
    } catch (error) {
      console.error('Error updating status:', error);
      showError('Failed to update order status');
    }
  };

  // Confirm order (pending -> confirmed)
  const handleConfirmOrder = async (orderId) => {
    await handleUpdateStatus(orderId, 'confirmed');
  };

  // Cancel order
  const handleCancelOrder = async () => {
    if (!selectedOrder || !cancelReason.trim()) {
      showError('Please provide a cancellation reason');
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          notes: cancelReason,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      showSuccess('Order cancelled successfully');
      setCancelReason('');
      setIsCancelModalOpen(false);
      fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      showError('Failed to cancel order');
    }
  };

  // Update delivery date and tracking
  const handleUpdateDelivery = async () => {
    if (!selectedOrder) return;

    try {
      const updateData = {
        updated_at: new Date().toISOString(),
      };

      if (deliveryDate) {
        updateData.estimated_delivery = deliveryDate;
      }

      if (trackingNumber) {
        updateData.tracking_number = trackingNumber;
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', selectedOrder.id);

      if (error) throw error;

      showSuccess('Delivery information updated');
      setIsDeliveryDateModalOpen(false);
      setDeliveryDate('');
      setTrackingNumber('');
      fetchOrders();
    } catch (error) {
      console.error('Error updating delivery:', error);
      showError('Failed to update delivery information');
    }
  };

  // Print order/invoice
  const handlePrintOrder = (order) => {
    // Create a printable invoice
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order.order_number}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #d97706; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f3f4f6; }
            .total { font-size: 18px; font-weight: bold; }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .info { margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>ALMIRA</h1>
              <p>Invoice</p>
            </div>
            <div style="text-align: right;">
              <p><strong>Order #:</strong> ${order.order_number}</p>
              <p><strong>Date:</strong> ${formatDate(order.created_at)}</p>
              <p><strong>Status:</strong> ${order.status}</p>
            </div>
          </div>

          <div class="info">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${order.profiles?.full_name || 'N/A'}</p>
            <p><strong>Email:</strong> ${order.profiles?.email || 'N/A'}</p>
            <p><strong>Phone:</strong> ${order.profiles?.phone || 'N/A'}</p>
          </div>

          <div class="info">
            <h3>Shipping Address</h3>
            <p>${order.shipping_address || 'N/A'}</p>
          </div>

          <h3>Order Items</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.order_items?.map(item => `
                <tr>
                  <td>${item.product_name}${item.variant_name ? ` - ${item.variant_name}` : ''}</td>
                  <td>${item.product_sku || '-'}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.unit_price.toFixed(2)}</td>
                  <td>₹${item.total_price.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="text-align: right; margin-top: 20px;">
            <p><strong>Subtotal:</strong> ₹${order.subtotal.toFixed(2)}</p>
            <p><strong>Shipping:</strong> ₹${order.shipping_amount.toFixed(2)}</p>
            <p><strong>Tax:</strong> ₹${order.tax_amount.toFixed(2)}</p>
            ${order.discount_amount > 0 ? `<p><strong>Discount:</strong> -₹${order.discount_amount.toFixed(2)}</p>` : ''}
            <p class="total">Total: ₹${order.total_amount.toFixed(2)}</p>
          </div>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p><strong>Payment Method:</strong> ${order.payment_method?.toUpperCase() || 'N/A'}</p>
            <p><strong>Payment Status:</strong> ${order.payment_status}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
    setActionMenu(null);
  };

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsStatusModalOpen(true);
    setActionMenu(null);
  };

  const handleOpenCancelModal = (order) => {
    setSelectedOrder(order);
    setIsCancelModalOpen(true);
    setActionMenu(null);
  };

  const handleOpenDeliveryModal = (order) => {
    setSelectedOrder(order);
    setDeliveryDate(order.estimated_delivery || '');
    setTrackingNumber(order.tracking_number || '');
    setIsDeliveryDateModalOpen(true);
    setActionMenu(null);
  };

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped' || o.status === 'out_for_delivery').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <FadeInOnScroll>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-gray-500 mt-1">{filteredOrders.length} orders found</p>
          </div>
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
            Export Orders
          </Button>
        </div>
      </FadeInOnScroll>

      {/* Stats Cards */}
      <StaggerChildren staggerDelay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { label: 'Total', value: stats.total, color: 'bg-gray-500' },
            { label: 'Pending', value: stats.pending, color: 'bg-yellow-500' },
            { label: 'Confirmed', value: stats.confirmed, color: 'bg-blue-500' },
            { label: 'Processing', value: stats.processing, color: 'bg-indigo-500' },
            { label: 'Shipped', value: stats.shipped, color: 'bg-purple-500' },
            { label: 'Delivered', value: stats.delivered, color: 'bg-green-500' },
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
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by order number, customer name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Select>
            <Select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full md:w-40"
            >
              {paymentOptions.map((payment) => (
                <option key={payment} value={payment}>{payment}</option>
              ))}
            </Select>
          </div>
        </Card>
      </FadeInOnScroll>

      {/* Orders Table */}
      <FadeInOnScroll>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">
                    Order Number
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">Customer</th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">Items</th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">Total</th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">Payment</th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="py-4 px-4 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <AnimatePresence>
                  {filteredOrders.map((order, index) => {
                    const StatusIcon = statusConfig[order.status]?.icon || Clock;

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
                          <span className="font-medium text-gray-900">{order.order_number}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{order.profiles?.full_name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{order.profiles?.email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-600">{order.order_items?.length || 0} items</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">{formatPrice(order.total_amount)}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
                            statusConfig[order.status]?.color || 'bg-gray-100 text-gray-700'
                          )}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[order.status]?.label || order.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <span className={cn(
                              'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                              paymentStatusColors[order.payment_status] || 'bg-gray-100 text-gray-700'
                            )}>
                              {order.payment_status}
                            </span>
                            <p className="text-xs text-gray-400 mt-1 uppercase">{order.payment_method}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-900">{formatDate(order.created_at)}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(order.created_at).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Quick Confirm Button for Pending Orders */}
                            {order.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => handleConfirmOrder(order.id)}
                                className="text-xs"
                              >
                                Confirm
                              </Button>
                            )}

                            {/* Actions Dropdown */}
                            <div className="relative">
                              <button
                                onClick={() => setActionMenu(actionMenu === order.id ? null : order.id)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                              >
                                <MoreVertical className="h-4 w-4 text-gray-500" />
                              </button>

                              <AnimatePresence>
                                {actionMenu === order.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border z-10"
                                  >
                                    <div className="py-1">
                                      <button
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => handleViewDetails(order)}
                                      >
                                        <Eye className="h-4 w-4" />
                                        View Details
                                      </button>
                                      <button
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => handlePrintOrder(order)}
                                      >
                                        <Printer className="h-4 w-4" />
                                        Print Invoice
                                      </button>
                                      <hr className="my-1" />
                                      <button
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => handleOpenStatusModal(order)}
                                      >
                                        <Edit className="h-4 w-4" />
                                        Update Status
                                      </button>
                                      <button
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => handleOpenDeliveryModal(order)}
                                      >
                                        <Calendar className="h-4 w-4" />
                                        Update Delivery
                                      </button>
                                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                        <>
                                          <hr className="my-1" />
                                          <button
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            onClick={() => handleOpenCancelModal(order)}
                                          >
                                            <XCircle className="h-4 w-4" />
                                            Cancel Order
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
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
        </Card>
      </FadeInOnScroll>

      {/* Order Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Order ${selectedOrder?.order_number}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Status Row */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm text-gray-500">Order Status</p>
                <span className={cn(
                  'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mt-1',
                  statusConfig[selectedOrder.status]?.color || 'bg-gray-100 text-gray-700'
                )}>
                  {statusConfig[selectedOrder.status]?.label || selectedOrder.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Payment Status</p>
                <span className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium mt-1 inline-block capitalize',
                  paymentStatusColors[selectedOrder.payment_status] || 'bg-gray-100 text-gray-700'
                )}>
                  {selectedOrder.payment_status}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
              <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                <p className="font-medium text-gray-900">{selectedOrder.profiles?.full_name || 'N/A'}</p>
                <p className="text-sm text-gray-500">{selectedOrder.profiles?.email || 'N/A'}</p>
                {selectedOrder.profiles?.phone && (
                  <p className="text-sm text-gray-500">{selectedOrder.profiles.phone}</p>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Shipping Address</h4>
              <p className="text-gray-600 p-4 bg-gray-50 rounded-xl whitespace-pre-line">
                {selectedOrder.shipping_address || 'No address provided'}
              </p>
            </div>

            {/* Tracking Info */}
            {(selectedOrder.tracking_number || selectedOrder.estimated_delivery) && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Delivery Information</h4>
                <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                  {selectedOrder.tracking_number && (
                    <p className="text-sm">
                      <span className="text-gray-500">Tracking Number:</span>{' '}
                      <span className="font-medium">{selectedOrder.tracking_number}</span>
                    </p>
                  )}
                  {selectedOrder.estimated_delivery && (
                    <p className="text-sm">
                      <span className="text-gray-500">Estimated Delivery:</span>{' '}
                      <span className="font-medium">{formatDate(selectedOrder.estimated_delivery)}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
              <div className="space-y-3">
                {selectedOrder.order_items?.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    {item.product_image && (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.product_name}</p>
                      {item.variant_name && (
                        <p className="text-xs text-gray-500">Variant: {item.variant_name}</p>
                      )}
                      {item.product_sku && (
                        <p className="text-xs text-gray-400">SKU: {item.product_sku}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatPrice(item.total_price)}</p>
                      <p className="text-xs text-gray-500">{formatPrice(item.unit_price)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Shipping</span>
                <span className="text-gray-900">{formatPrice(selectedOrder.shipping_amount)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-900">{formatPrice(selectedOrder.tax_amount)}</span>
              </div>
              {selectedOrder.discount_amount > 0 && (
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Discount</span>
                  <span className="text-green-600">-{formatPrice(selectedOrder.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total</span>
                <span>{formatPrice(selectedOrder.total_amount)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handlePrintOrder(selectedOrder)}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Invoice
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setIsDetailOpen(false);
                  handleOpenStatusModal(selectedOrder);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Update Order
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Update Order Status"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select New Status
            </label>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </Select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsStatusModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleUpdateStatus(selectedOrder.id, newStatus)}
              className="flex-1"
            >
              Update Status
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setCancelReason('');
        }}
        title="Cancel Order"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cancellation Reason
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter reason for cancellation..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              rows={4}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsCancelModalOpen(false);
                setCancelReason('');
              }}
              className="flex-1"
            >
              Keep Order
            </Button>
            <Button
              onClick={handleCancelOrder}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Cancel Order
            </Button>
          </div>
        </div>
      </Modal>

      {/* Update Delivery Date Modal */}
      <Modal
        isOpen={isDeliveryDateModalOpen}
        onClose={() => {
          setIsDeliveryDateModalOpen(false);
          setDeliveryDate('');
          setTrackingNumber('');
        }}
        title="Update Delivery Information"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Delivery Date
            </label>
            <Input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tracking Number
            </label>
            <Input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number..."
              className="w-full"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeliveryDateModalOpen(false);
                setDeliveryDate('');
                setTrackingNumber('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateDelivery}
              className="flex-1"
            >
              Update
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default OrdersPage;
