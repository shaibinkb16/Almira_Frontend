import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Plus,
  Edit3,
  Trash2,
  Home,
  Briefcase,
  Star,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import {
  FadeInOnScroll,
  StaggerChildren,
  StaggerItem,
} from '@/components/ui';
import { useUIStore } from '@/stores/uiStore';
import { INDIAN_STATES } from '@/config/constants';

// Sample addresses
const sampleAddresses = [
  {
    id: 1,
    type: 'home',
    label: 'Home',
    fullName: 'Priya Sharma',
    phone: '+91 98765 43210',
    addressLine1: '123 Main Street, Apartment 4B',
    addressLine2: 'Near City Mall',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    isDefault: true,
  },
  {
    id: 2,
    type: 'work',
    label: 'Office',
    fullName: 'Priya Sharma',
    phone: '+91 98765 43210',
    addressLine1: '456 Business Park, Tower A, Floor 12',
    addressLine2: 'IT Hub',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400051',
    isDefault: false,
  },
  {
    id: 3,
    type: 'other',
    label: "Parent's House",
    fullName: 'Mr. Sharma',
    phone: '+91 91234 56789',
    addressLine1: '789 Green Colony',
    addressLine2: 'Sector 5',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    isDefault: false,
  },
];

const addressTypes = [
  { value: 'home', label: 'Home', icon: Home },
  { value: 'work', label: 'Work', icon: Briefcase },
  { value: 'other', label: 'Other', icon: MapPin },
];

function AddressesPage() {
  const [addresses, setAddresses] = useState(sampleAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useUIStore();

  const [formData, setFormData] = useState({
    type: 'home',
    label: '',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData(address);
    } else {
      setEditingAddress(null);
      setFormData({
        type: 'home',
        label: '',
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: addresses.length === 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (editingAddress) {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress.id
            ? { ...formData, id: addr.id }
            : formData.isDefault
            ? { ...addr, isDefault: false }
            : addr
        )
      );
      showSuccess('Address updated successfully');
    } else {
      const newAddress = {
        ...formData,
        id: Date.now(),
      };
      setAddresses((prev) =>
        formData.isDefault
          ? [newAddress, ...prev.map((addr) => ({ ...addr, isDefault: false }))]
          : [...prev, newAddress]
      );
      showSuccess('Address added successfully');
    }

    setIsSubmitting(false);
    handleCloseModal();
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    showSuccess('Address deleted');
  };

  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    showSuccess('Default address updated');
  };

  const getTypeIcon = (type) => {
    const addressType = addressTypes.find((t) => t.value === type);
    return addressType?.icon || MapPin;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeInOnScroll>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Saved Addresses
              </h1>
              <p className="text-gray-500">Manage your delivery addresses</p>
            </div>
            <Button
              onClick={() => handleOpenModal()}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add New Address
            </Button>
          </div>
        </FadeInOnScroll>

        {/* Addresses Grid */}
        {addresses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 text-center shadow-sm"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses saved</h3>
            <p className="text-gray-500 mb-6">Add your first delivery address</p>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </motion.div>
        ) : (
          <StaggerChildren staggerDelay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {addresses.map((address) => {
                  const TypeIcon = getTypeIcon(address.type);

                  return (
                    <StaggerItem key={address.id}>
                      <motion.div
                        layout
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={cn(
                          'bg-white rounded-2xl p-6 shadow-sm border-2 transition-colors',
                          address.isDefault ? 'border-amber-500' : 'border-transparent'
                        )}
                        whileHover={{ y: -4 }}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'w-10 h-10 rounded-xl flex items-center justify-center',
                              address.isDefault ? 'bg-amber-100' : 'bg-gray-100'
                            )}>
                              <TypeIcon className={cn(
                                'h-5 w-5',
                                address.isDefault ? 'text-amber-600' : 'text-gray-500'
                              )} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">
                                  {address.label || addressTypes.find(t => t.value === address.type)?.label}
                                </span>
                                {address.isDefault && (
                                  <Badge variant="primary" size="sm">Default</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">{address.phone}</p>
                            </div>
                          </div>
                        </div>

                        {/* Address Details */}
                        <div className="space-y-1 text-sm text-gray-600 mb-4">
                          <p className="font-medium text-gray-900">{address.fullName}</p>
                          <p>{address.addressLine1}</p>
                          {address.addressLine2 && <p>{address.addressLine2}</p>}
                          <p>
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-4 border-t">
                          <motion.button
                            onClick={() => handleOpenModal(address)}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-amber-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(address.id)}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </motion.button>
                          {!address.isDefault && (
                            <motion.button
                              onClick={() => handleSetDefault(address.id)}
                              className="flex items-center gap-1 text-sm text-gray-600 hover:text-amber-600 transition-colors ml-auto"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Star className="h-4 w-4" />
                              Set Default
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    </StaggerItem>
                  );
                })}
              </AnimatePresence>

              {/* Add New Address Card */}
              <StaggerItem>
                <motion.button
                  onClick={() => handleOpenModal()}
                  className="w-full h-full min-h-[200px] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-500 hover:border-amber-500 hover:text-amber-600 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Plus className="h-6 w-6" />
                  </div>
                  <span className="font-medium">Add New Address</span>
                </motion.button>
              </StaggerItem>
            </div>
          </StaggerChildren>
        )}

        {/* Address Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingAddress ? 'Edit Address' : 'Add New Address'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Address Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Address Type
              </label>
              <div className="flex gap-3">
                {addressTypes.map((type) => (
                  <motion.button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, type: type.value }))}
                    className={cn(
                      'flex-1 p-3 rounded-xl border-2 transition-colors flex flex-col items-center gap-2',
                      formData.type === type.value
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <type.icon className={cn(
                      'h-5 w-5',
                      formData.type === type.value ? 'text-amber-600' : 'text-gray-500'
                    )} />
                    <span className={cn(
                      'text-sm font-medium',
                      formData.type === type.value ? 'text-amber-600' : 'text-gray-700'
                    )}>
                      {type.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Custom Label */}
            <Input
              label="Label (Optional)"
              name="label"
              value={formData.label}
              onChange={handleInputChange}
              placeholder="e.g., Mom's House, Summer Home"
            />

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Address Lines */}
            <Textarea
              label="Address Line 1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              placeholder="House/Flat No., Building Name, Street"
              required
            />
            <Input
              label="Address Line 2 (Optional)"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleInputChange}
              placeholder="Landmark, Area"
            />

            {/* City, State, Pincode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
              <Select
                label="State"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state.code} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </Select>
              <Input
                label="PIN Code"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                pattern="[0-9]{6}"
                maxLength={6}
                required
              />
            </div>

            {/* Default Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                  formData.isDefault
                    ? 'bg-amber-500 border-amber-500'
                    : 'border-gray-300'
                )}>
                  {formData.isDefault && <Check className="h-3 w-3 text-white" />}
                </div>
              </div>
              <span className="text-sm text-gray-700">Set as default address</span>
            </label>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" isLoading={isSubmitting} className="flex-1">
                {editingAddress ? 'Update Address' : 'Save Address'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}

export default AddressesPage;
