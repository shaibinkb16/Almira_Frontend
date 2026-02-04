import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  ArrowRight,
  MoreVertical,
  Eye,
  Edit,
  Star,
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  FadeInOnScroll,
  StaggerChildren,
  StaggerItem,
  CountUp,
} from '@/components/ui';
import { ROUTES } from '@/config/routes';
import { IMAGES, AVATARS } from '@/data/sampleData';

// Sample data
const stats = [
  {
    label: 'Total Revenue',
    value: 847520,
    change: 12.5,
    icon: DollarSign,
    color: 'bg-emerald-500',
    prefix: '₹',
  },
  {
    label: 'Orders',
    value: 1284,
    change: 8.2,
    icon: ShoppingBag,
    color: 'bg-blue-500',
  },
  {
    label: 'Customers',
    value: 5420,
    change: 15.3,
    icon: Users,
    color: 'bg-purple-500',
  },
  {
    label: 'Products',
    value: 248,
    change: -2.1,
    icon: Package,
    color: 'bg-amber-500',
  },
];

const recentOrders = [
  {
    id: 'ORD-2024-001',
    customer: 'Priya Sharma',
    avatar: AVATARS.woman1,
    total: 15999,
    status: 'delivered',
    date: '2 hours ago',
  },
  {
    id: 'ORD-2024-002',
    customer: 'Anjali Patel',
    avatar: AVATARS.woman2,
    total: 8499,
    status: 'shipped',
    date: '5 hours ago',
  },
  {
    id: 'ORD-2024-003',
    customer: 'Meera Reddy',
    avatar: AVATARS.woman3,
    total: 45999,
    status: 'processing',
    date: '1 day ago',
  },
  {
    id: 'ORD-2024-004',
    customer: 'Rahul Kumar',
    avatar: AVATARS.man1,
    total: 12499,
    status: 'pending',
    date: '1 day ago',
  },
];

const topProducts = [
  {
    id: 1,
    name: 'Kundan Necklace Set',
    image: IMAGES.necklace1,
    sales: 156,
    revenue: 2027844,
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Diamond Studded Ring',
    image: IMAGES.ring1,
    sales: 89,
    revenue: 4093911,
    rating: 4.9,
  },
  {
    id: 3,
    name: 'Designer Silk Saree',
    image: IMAGES.saree1,
    sales: 124,
    revenue: 2479876,
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Temple Jhumkas',
    image: IMAGES.earrings1,
    sales: 234,
    revenue: 1169766,
    rating: 4.6,
  },
];

const recentReviews = [
  {
    id: 1,
    customer: 'Priya S.',
    product: 'Kundan Necklace Set',
    rating: 5,
    comment: 'Absolutely stunning! The quality is exceptional.',
    date: '2 hours ago',
  },
  {
    id: 2,
    customer: 'Anjali P.',
    product: 'Diamond Ring',
    rating: 4,
    comment: 'Beautiful ring, delivery was a bit slow.',
    date: '5 hours ago',
  },
  {
    id: 3,
    customer: 'Meera R.',
    product: 'Silk Saree',
    rating: 5,
    comment: 'Perfect for my wedding! Loved it.',
    date: '1 day ago',
  },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <FadeInOnScroll>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your store overview.</p>
        </div>
      </FadeInOnScroll>

      {/* Stats Grid */}
      <StaggerChildren staggerDelay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-sm"
                whileHover={{ y: -4, boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
              >
                <div className="flex items-start justify-between">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stat.color)}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                  )}>
                    {stat.change >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {Math.abs(stat.change)}%
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.prefix}
                    <CountUp end={stat.value} duration={2} />
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </div>
      </StaggerChildren>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart Placeholder */}
        <FadeInOnScroll className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Revenue Overview</CardTitle>
              <select className="text-sm border rounded-lg px-3 py-1.5">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </CardHeader>
            <CardContent>
              {/* Chart placeholder */}
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                <p className="text-gray-400">Revenue chart will be rendered here</p>
              </div>
            </CardContent>
          </Card>
        </FadeInOnScroll>

        {/* Recent Reviews */}
        <FadeInOnScroll>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Reviews</CardTitle>
              <Link
                to="#"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                View All
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 text-sm">{review.customer}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'h-3 w-3',
                              i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{review.product}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-2">{review.date}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeInOnScroll>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <FadeInOnScroll>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link
                to={ROUTES.ADMIN.ORDERS}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <Avatar src={order.avatar} alt={order.customer} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 text-sm">{order.id}</span>
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                          statusColors[order.status]
                        )}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
                      <p className="text-xs text-gray-400">{order.date}</p>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeInOnScroll>

        {/* Top Products */}
        <FadeInOnScroll>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Products</CardTitle>
              <Link
                to={ROUTES.ADMIN.PRODUCTS}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <span className="absolute -top-1 -left-1 w-5 h-5 bg-amber-500 rounded-full text-white text-xs flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{product.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{product.sales} sales</span>
                        <span>•</span>
                        <div className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {product.rating}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatPrice(product.revenue)}</p>
                      <p className="text-xs text-gray-400">Revenue</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeInOnScroll>
      </div>

      {/* Quick Actions */}
      <FadeInOnScroll>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Add Product', icon: Package, href: `${ROUTES.ADMIN.PRODUCTS}/new`, color: 'bg-blue-500' },
                { label: 'View Orders', icon: ShoppingBag, href: ROUTES.ADMIN.ORDERS, color: 'bg-purple-500' },
                { label: 'Manage Users', icon: Users, href: ROUTES.ADMIN.USERS, color: 'bg-emerald-500' },
                { label: 'View Reports', icon: TrendingUp, href: '#', color: 'bg-amber-500' },
              ].map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={action.href}
                    className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', action.color)}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {action.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeInOnScroll>
    </div>
  );
}

export default DashboardPage;
