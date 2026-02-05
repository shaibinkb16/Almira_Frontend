import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { Search, Eye, UserCheck, UserX, MapPin, ShoppingBag, Star } from 'lucide-react';
import { adminService } from '@/services/api/adminService';
import { supabase } from '@/lib/supabase/client';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const [userResult, ordersResult, addressesResult, reviewsResult] = await Promise.all([
        adminService.getUserDetails(userId),
        adminService.getUserOrders(userId),
        adminService.getUserAddresses(userId),
        adminService.getUserReviews(userId),
      ]);

      setUserDetails({
        user: userResult.data,
        orders: ordersResult.data || [],
        addresses: addressesResult.data || [],
        reviews: reviewsResult.data || [],
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    setShowModal(true);
    await fetchUserDetails(user.id);
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const result = await adminService.toggleUserStatus(userId, !currentStatus);
      if (result.success) {
        await fetchUsers();
        if (selectedUser?.id === userId) {
          setSelectedUser({ ...selectedUser, is_active: !currentStatus });
        }
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const result = await adminService.updateUserRole(userId, newRole);
      if (result.success) {
        await fetchUsers();
        if (selectedUser?.id === userId) {
          setSelectedUser({ ...selectedUser, role: newRole });
        }
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.is_active.toString() === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage customer accounts and orders</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <CardTitle>All Customers ({filteredUsers.length})</CardTitle>
            <div className="flex gap-2 items-center">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Roles</option>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-semibold">
                            {user.full_name?.[0] || user.email?.[0] || '?'}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.full_name || 'N/A'}</div>
                            {user.phone && (
                              <div className="text-sm text-gray-500">{user.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <Badge variant={user.role === 'admin' ? 'primary' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={user.is_active ? 'success' : 'secondary'}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewUser(user)}
                            className="p-1"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleStatus(user.id, user.is_active)}
                            className="p-1"
                          >
                            {user.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-gray-500">No customers found</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
          setUserDetails(null);
        }}
        title="Customer Details"
        size="large"
      >
        {selectedUser && (
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <p className="mt-1 text-gray-900">{selectedUser.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-gray-900">{selectedUser.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Gender</label>
                    <p className="mt-1 text-gray-900 capitalize">{selectedUser.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Role</label>
                    <div className="mt-1">
                      <select
                        value={selectedUser.role}
                        onChange={(e) => handleUpdateRole(selectedUser.id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">
                      <Badge variant={selectedUser.is_active ? 'success' : 'secondary'}>
                        {selectedUser.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatus(selectedUser.id, selectedUser.is_active)}
                        className="ml-2"
                      >
                        Toggle
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Joined</label>
                    <p className="mt-1 text-gray-900">
                      {new Date(selectedUser.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email Verified</label>
                    <p className="mt-1">
                      <Badge variant={selectedUser.email_verified ? 'success' : 'warning'}>
                        {selectedUser.email_verified ? 'Verified' : 'Not Verified'}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              {!userDetails ? (
                <div className="text-center py-8">Loading orders...</div>
              ) : userDetails.orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingBag className="mx-auto mb-2 text-gray-400" size={48} />
                  <p>No orders found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userDetails.orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Order #{order.order_number}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">₹{order.total_amount}</div>
                          <Badge variant="secondary" className="mt-1">
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="addresses">
              {!userDetails ? (
                <div className="text-center py-8">Loading addresses...</div>
              ) : userDetails.addresses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="mx-auto mb-2 text-gray-400" size={48} />
                  <p>No addresses found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userDetails.addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{address.full_name}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {address.address_line1}
                            {address.address_line2 && `, ${address.address_line2}`}
                          </div>
                          <div className="text-sm text-gray-600">
                            {address.city}, {address.state} {address.postal_code}
                          </div>
                          <div className="text-sm text-gray-600">{address.phone}</div>
                        </div>
                        <div className="flex gap-2">
                          {address.is_default && <Badge variant="primary">Default</Badge>}
                          {address.label && (
                            <Badge variant="secondary" className="capitalize">
                              {address.label}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews">
              {!userDetails ? (
                <div className="text-center py-8">Loading reviews...</div>
              ) : userDetails.reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Star className="mx-auto mb-2 text-gray-400" size={48} />
                  <p>No reviews found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userDetails.reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <Badge variant="secondary">{review.status}</Badge>
                      </div>
                      {review.title && <div className="font-medium mt-2">{review.title}</div>}
                      {review.comment && <p className="text-sm text-gray-600 mt-1">{review.comment}</p>}
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </Modal>
    </div>
  );
};

export default UsersPage;
