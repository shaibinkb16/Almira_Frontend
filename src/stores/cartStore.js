import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase/client';

export const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      isLoading: false,
      isSyncing: false,
      error: null,

      // Get item count
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // Get subtotal
      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.salePrice || item.basePrice;
          return total + price * item.quantity;
        }, 0);
      },

      // Get total with discounts (can be extended for coupons)
      getTotal: () => {
        return get().getSubtotal();
      },

      // Find item in cart
      findItem: (productId, variantId = null) => {
        return get().items.find(
          (item) =>
            item.productId === productId &&
            item.variantId === variantId
        );
      },

      // Add item to cart
      addItem: async (product, variant = null, quantity = 1) => {
        const { items, syncToServer } = get();

        const existingItem = get().findItem(product.id, variant?.id || null);

        if (existingItem) {
          // Update quantity if item exists
          const newQuantity = existingItem.quantity + quantity;
          await get().updateQuantity(product.id, variant?.id || null, newQuantity);
          return;
        }

        // Create new cart item
        const newItem = {
          id: `${product.id}-${variant?.id || 'default'}`,
          productId: product.id,
          variantId: variant?.id || null,
          name: product.name,
          variantName: variant?.name || null,
          sku: variant ? `${product.sku}-${variant.skuSuffix}` : product.sku,
          basePrice: product.basePrice + (variant?.priceAdjustment || 0),
          salePrice: product.salePrice
            ? product.salePrice + (variant?.priceAdjustment || 0)
            : null,
          image: variant?.imageUrl || product.images?.[0]?.url || null,
          quantity,
          maxQuantity: variant?.stockQuantity ?? product.stockQuantity,
        };

        set({ items: [...items, newItem] });
        await syncToServer();
      },

      // Update item quantity
      updateQuantity: async (productId, variantId, quantity) => {
        const { items, syncToServer } = get();

        if (quantity <= 0) {
          await get().removeItem(productId, variantId);
          return;
        }

        const updatedItems = items.map((item) => {
          if (item.productId === productId && item.variantId === variantId) {
            return {
              ...item,
              quantity: Math.min(quantity, item.maxQuantity),
            };
          }
          return item;
        });

        set({ items: updatedItems });
        await syncToServer();
      },

      // Remove item from cart
      removeItem: async (productId, variantId = null) => {
        const { items, syncToServer } = get();

        const updatedItems = items.filter(
          (item) =>
            !(item.productId === productId && item.variantId === variantId)
        );

        set({ items: updatedItems });
        await syncToServer();
      },

      // Clear cart
      clearCart: async () => {
        set({ items: [] });
        await get().syncToServer();
      },

      // Sync cart to server (for logged-in users)
      syncToServer: async () => {
        const session = await supabase.auth.getSession();
        if (!session?.data?.session?.user) return;

        const userId = session.data.session.user.id;
        const { items } = get();

        set({ isSyncing: true });

        try {
          // Delete existing cart items
          await supabase.from('cart_items').delete().eq('user_id', userId);

          // Insert new cart items
          if (items.length > 0) {
            const cartItems = items.map((item) => ({
              user_id: userId,
              product_id: item.productId,
              variant_id: item.variantId,
              quantity: item.quantity,
            }));

            await supabase.from('cart_items').insert(cartItems);
          }
        } catch (error) {
          console.error('Cart sync error:', error);
          set({ error: error.message });
        } finally {
          set({ isSyncing: false });
        }
      },

      // Load cart from server (for logged-in users)
      loadFromServer: async () => {
        const session = await supabase.auth.getSession();
        if (!session?.data?.session?.user) return;

        const userId = session.data.session.user.id;
        set({ isLoading: true });

        try {
          const { data: cartItems, error } = await supabase
            .from('cart_items')
            .select(
              `
              id,
              quantity,
              product:products (
                id,
                name,
                sku,
                base_price,
                sale_price,
                stock_quantity,
                images
              ),
              variant:product_variants (
                id,
                name,
                sku_suffix,
                price_adjustment,
                stock_quantity,
                image_url
              )
            `
            )
            .eq('user_id', userId);

          if (error) throw error;

          if (cartItems && cartItems.length > 0) {
            const items = cartItems
              .filter((item) => item.product) // Filter out items with deleted products
              .map((item) => ({
                id: `${item.product.id}-${item.variant?.id || 'default'}`,
                productId: item.product.id,
                variantId: item.variant?.id || null,
                name: item.product.name,
                variantName: item.variant?.name || null,
                sku: item.variant
                  ? `${item.product.sku}-${item.variant.sku_suffix}`
                  : item.product.sku,
                basePrice:
                  item.product.base_price +
                  (item.variant?.price_adjustment || 0),
                salePrice: item.product.sale_price
                  ? item.product.sale_price +
                    (item.variant?.price_adjustment || 0)
                  : null,
                image:
                  item.variant?.image_url ||
                  item.product.images?.[0]?.url ||
                  null,
                quantity: item.quantity,
                maxQuantity:
                  item.variant?.stock_quantity ?? item.product.stock_quantity,
              }));

            set({ items });
          }
        } catch (error) {
          console.error('Cart load error:', error);
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      // Merge local cart with server cart (on login)
      mergeWithServer: async () => {
        const { items: localItems, loadFromServer } = get();

        // Load server cart
        await loadFromServer();
        const serverItems = get().items;

        // Merge: local items take priority for quantity
        const mergedItems = [...serverItems];

        localItems.forEach((localItem) => {
          const existingIndex = mergedItems.findIndex(
            (item) =>
              item.productId === localItem.productId &&
              item.variantId === localItem.variantId
          );

          if (existingIndex >= 0) {
            // Update quantity (take higher value)
            mergedItems[existingIndex].quantity = Math.max(
              mergedItems[existingIndex].quantity,
              localItem.quantity
            );
          } else {
            // Add new item
            mergedItems.push(localItem);
          }
        });

        set({ items: mergedItems });
        await get().syncToServer();
      },

      // Reset store
      reset: () => {
        set({
          items: [],
          isLoading: false,
          isSyncing: false,
          error: null,
        });
      },
    }),
    {
      name: 'almira-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

export default useCartStore;
