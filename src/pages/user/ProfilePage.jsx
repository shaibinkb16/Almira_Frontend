import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Edit3,
  Camera,
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  FadeInOnScroll,
  StaggerChildren,
  StaggerItem,
} from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';
import { IMAGES } from '@/data/sampleData';

// Sample data
const recentOrders = [
  {
    id: 'ORD-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 15999,
    items: 2,
    image: IMAGES.necklace1,
  },
  {
    id: 'ORD-2024-002',
    date: '2024-01-20',
    status: 'shipped',
    total: 8499,
    items: 1,
    image: IMAGES.earrings1,
  },
];

const wishlistItems = [
  {
    id: 1,
    name: 'Diamond Studded Ring',
    price: 45999,
    image: IMAGES.ring1,
  },
  {
    id: 2,
    name: 'Pearl Necklace Set',
    price: 12999,
    image: IMAGES.necklace2,
  },
];

const menuItems = [
  { icon: User, label: 'Personal Info', href: ROUTES.USER.PROFILE, description: 'Update your details' },
  { icon: Package, label: 'My Orders', href: ROUTES.USER.ORDERS, description: 'Track your orders' },
  { icon: Heart, label: 'Wishlist', href: ROUTES.USER.WISHLIST, description: 'Your saved items' },
  { icon: MapPin, label: 'Addresses', href: ROUTES.USER.ADDRESSES, description: 'Manage addresses' },
  { icon: CreditCard, label: 'Payment Methods', href: '#', description: 'Saved cards' },
  { icon: Bell, label: 'Notifications', href: '#', description: 'Manage alerts' },
  { icon: Shield, label: 'Security', href: '#', description: 'Password & 2FA' },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

function ProfilePage() {
  const { user, profile } = useAuthStore();
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FadeInOnScroll>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                {/* Profile Header */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <Avatar
                      src={profile?.avatar_url}
                      alt={profile?.full_name || user?.email}
                      size="xl"
                      className="mx-auto"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute bottom-0 right-0 p-2 bg-amber-500 rounded-full text-white shadow-lg"
                    >
                      <Camera className="h-4 w-4" />
                    </motion.button>
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-gray-900">
                    {profile?.full_name || 'User'}
                  </h2>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <Badge variant="primary" className="mt-2">
                    {profile?.role === 'admin' ? 'Admin' : 'Customer'}
                  </Badge>
                </div>

                {/* Menu */}
                <nav className="space-y-1">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors group"
                      >
                        <item.icon className="h-5 w-5 text-gray-400 group-hover:text-amber-500" />
                        <div className="flex-1">
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Logout */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 pt-6 border-t"
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    leftIcon={<LogOut className="h-5 w-5" />}
                    onClick={handleLogout}
                  >
                    Sign Out
                  </Button>
                </motion.div>
              </div>
            </FadeInOnScroll>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats */}
            <StaggerChildren staggerDelay={0.1}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Orders', value: '12', icon: Package, color: 'bg-blue-500' },
                  { label: 'Wishlist Items', value: '8', icon: Heart, color: 'bg-rose-500' },
                  { label: 'Saved Addresses', value: '3', icon: MapPin, color: 'bg-emerald-500' },
                  { label: 'Reward Points', value: '1,250', icon: CreditCard, color: 'bg-amber-500' },
                ].map((stat) => (
                  <StaggerItem key={stat.label}>
                    <motion.div
                      className="bg-white rounded-2xl p-4 shadow-sm"
                      whileHover={{ y: -4 }}
                    >
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', stat.color)}>
                        <stat.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerChildren>

            {/* Recent Orders */}
            <FadeInOnScroll>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Link
                    to={ROUTES.USER.ORDERS}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    View All
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
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <img
                          src={order.image}
                          alt="Order"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{order.id}</span>
                            <span className={cn(
                              'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                              statusColors[order.status]
                            )}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{order.items} items • {order.date}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{formatPrice(order.total)}</div>
                          <Link
                            to={`${ROUTES.USER.ORDERS}/${order.id}`}
                            className="text-sm text-amber-600 hover:underline"
                          >
                            View Details
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeInOnScroll>

            {/* Wishlist Preview */}
            <FadeInOnScroll>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Wishlist</CardTitle>
                  <Link
                    to={ROUTES.USER.WISHLIST}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    View All
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {wishlistItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="group"
                      >
                        <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                        <p className="text-sm text-amber-600 font-semibold">{formatPrice(item.price)}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeInOnScroll>

            {/* Personal Information */}
            <FadeInOnScroll>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Edit3 className="h-4 w-4" />}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      defaultValue={profile?.full_name || ''}
                      disabled={!isEditing}
                    />
                    <Input
                      label="Email"
                      type="email"
                      defaultValue={user?.email || ''}
                      disabled
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      defaultValue={profile?.phone || ''}
                      disabled={!isEditing}
                    />
                    <Input
                      label="Date of Birth"
                      type="date"
                      defaultValue={profile?.date_of_birth || ''}
                      disabled={!isEditing}
                    />
                  </div>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 flex gap-3"
                    >
                      <Button>Save Changes</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </FadeInOnScroll>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
