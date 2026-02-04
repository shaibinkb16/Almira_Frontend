import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { Drawer, DrawerFooter } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/stores/uiStore';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/utils';
import { ROUTES } from '@/config/routes';
import { PLACEHOLDER_IMAGE } from '@/config/constants';

function CartDrawer() {
  const { isCartDrawerOpen, closeCartDrawer } = useUIStore();
  const { items, getSubtotal, updateQuantity, removeItem } = useCartStore();

  const subtotal = getSubtotal();
  const isEmpty = items.length === 0;

  return (
    <Drawer
      isOpen={isCartDrawerOpen}
      onClose={closeCartDrawer}
      title="Shopping Cart"
      position="right"
      size="md"
    >
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Your cart is empty
          </h3>
          <p className="text-gray-500 mb-6">
            Looks like you haven&apos;t added any items yet.
          </p>
          <Button onClick={closeCartDrawer} asChild>
            <Link to={ROUTES.PRODUCTS}>Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto -mx-4 px-4">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 border-b border-gray-100"
                >
                  {/* Image */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || PLACEHOLDER_IMAGE}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </h4>
                    {item.variantName && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.variantName}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.variantId,
                              item.quantity - 1
                            )
                          }
                          className="p-1 rounded-md hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.variantId,
                              item.quantity + 1
                            )
                          }
                          className="p-1 rounded-md hover:bg-gray-100"
                          disabled={item.quantity >= item.maxQuantity}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() =>
                          removeItem(item.productId, item.variantId)
                        }
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatPrice((item.salePrice || item.basePrice) * item.quantity)}
                    </p>
                    {item.salePrice && (
                      <p className="text-xs text-gray-400 line-through">
                        {formatPrice(item.basePrice * item.quantity)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-medium text-gray-900">
                Subtotal
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="space-y-3">
              <Button className="w-full" onClick={closeCartDrawer} asChild>
                <Link to={ROUTES.CHECKOUT}>Proceed to Checkout</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={closeCartDrawer}
                asChild
              >
                <Link to={ROUTES.CART}>View Cart</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}

export default CartDrawer;
