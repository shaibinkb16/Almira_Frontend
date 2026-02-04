import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  Archive,
  ChevronDown,
  Star,
  ArrowUpDown,
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { ConfirmModal } from '@/components/ui/Modal';
import {
  FadeInOnScroll,
  StaggerChildren,
  StaggerItem,
} from '@/components/ui';
import { useUIStore } from '@/stores/uiStore';
import { ROUTES } from '@/config/routes';
import { sampleProducts as importedProducts } from '@/data/sampleData';

// Add admin-specific fields to sample products
const sampleProducts = importedProducts.map((product, index) => ({
  ...product,
  sku: `ALM-00${index + 1}`,
  sales: [156, 89, 124, 67, 145, 0, 178, 56][index] || 0,
  createdAt: `2024-01-${String(index * 3 + 1).padStart(2, '0')}`,
}));

const statusColors = {
  active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
  draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
  out_of_stock: { bg: 'bg-red-100', text: 'text-red-700', label: 'Out of Stock' },
  archived: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Archived' },
};

const categories = ['All Categories', 'Necklaces', 'Earrings', 'Rings', 'Bangles', 'Ethnic Wear', 'Western Wear'];
const statuses = ['All Status', 'Active', 'Draft', 'Out of Stock', 'Archived'];

function ProductsPage() {
  const [products, setProducts] = useState(sampleProducts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [status, setStatus] = useState('All Status');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });
  const [actionMenu, setActionMenu] = useState(null);

  const { showSuccess } = useUIStore();

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All Categories' || product.category === category;
    const matchesStatus = status === 'All Status' ||
      product.status === status.toLowerCase().replace(' ', '_');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleDeleteProduct = () => {
    if (deleteModal.product) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteModal.product.id));
      showSuccess(`${deleteModal.product.name} deleted`);
    }
    setDeleteModal({ isOpen: false, product: null });
  };

  const handleBulkDelete = () => {
    setProducts((prev) => prev.filter((p) => !selectedProducts.includes(p.id)));
    showSuccess(`${selectedProducts.length} products deleted`);
    setSelectedProducts([]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <FadeInOnScroll>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 mt-1">{filteredProducts.length} products found</p>
          </div>
          <Button asChild leftIcon={<Plus className="h-4 w-4" />}>
            <Link to={`${ROUTES.ADMIN.PRODUCTS}/new`}>Add Product</Link>
          </Button>
        </div>
      </FadeInOnScroll>

      {/* Filters */}
      <FadeInOnScroll>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search products by name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full md:w-48"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full md:w-40"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t flex items-center gap-4"
            >
              <span className="text-sm text-gray-600">
                {selectedProducts.length} selected
              </span>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleBulkDelete}
              >
                Delete Selected
              </Button>
              <Button size="sm" variant="outline">
                Archive Selected
              </Button>
            </motion.div>
          )}
        </div>
      </FadeInOnScroll>

      {/* Products Table */}
      <FadeInOnScroll>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="py-4 px-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">
                    <button className="flex items-center gap-1 hover:text-gray-700">
                      Product <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">SKU</th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">Category</th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">
                    <button className="flex items-center gap-1 hover:text-gray-700">
                      Price <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">Stock</th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">
                    <button className="flex items-center gap-1 hover:text-gray-700">
                      Sales <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="py-4 px-4 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'hover:bg-gray-50 transition-colors',
                        selectedProducts.includes(product.id) && 'bg-amber-50'
                      )}
                    >
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <Link
                              to={`${ROUTES.ADMIN.PRODUCTS}/${product.id}`}
                              className="font-medium text-gray-900 hover:text-amber-600 line-clamp-1"
                            >
                              {product.name}
                            </Link>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span className="text-xs text-gray-500">{product.rating}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{product.sku}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{product.category}</td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">
                          {formatPrice(product.salePrice || product.basePrice)}
                        </div>
                        {product.salePrice && (
                          <div className="text-xs text-gray-400 line-through">
                            {formatPrice(product.basePrice)}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={cn(
                          'text-sm font-medium',
                          product.stockQuantity === 0 ? 'text-red-600' :
                          product.stockQuantity < 10 ? 'text-yellow-600' : 'text-gray-900'
                        )}>
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          statusColors[product.status].bg,
                          statusColors[product.status].text
                        )}>
                          {statusColors[product.status].label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{product.sales}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="relative">
                          <button
                            onClick={() => setActionMenu(actionMenu === product.id ? null : product.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                          </button>

                          {/* Action Menu */}
                          <AnimatePresence>
                            {actionMenu === product.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border z-10"
                              >
                                <div className="py-1">
                                  <Link
                                    to={`/products/${product.slug}`}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    onClick={() => setActionMenu(null)}
                                  >
                                    <Eye className="h-4 w-4" />
                                    View
                                  </Link>
                                  <Link
                                    to={`${ROUTES.ADMIN.PRODUCTS}/${product.id}/edit`}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    onClick={() => setActionMenu(null)}
                                  >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                  </Link>
                                  <button
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    onClick={() => {
                                      showSuccess('Product duplicated');
                                      setActionMenu(null);
                                    }}
                                  >
                                    <Copy className="h-4 w-4" />
                                    Duplicate
                                  </button>
                                  <button
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    onClick={() => setActionMenu(null)}
                                  >
                                    <Archive className="h-4 w-4" />
                                    Archive
                                  </button>
                                  <hr className="my-1" />
                                  <button
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    onClick={() => {
                                      setDeleteModal({ isOpen: true, product });
                                      setActionMenu(null);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
              <Button asChild>
                <Link to={`${ROUTES.ADMIN.PRODUCTS}/new`}>Add New Product</Link>
              </Button>
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="px-4 py-4 border-t flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing 1-{filteredProducts.length} of {filteredProducts.length} products
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, product: null })}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteModal.product?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}

export default ProductsPage;
