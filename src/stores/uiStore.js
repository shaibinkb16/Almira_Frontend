import { create } from 'zustand';

export const useUIStore = create((set, get) => ({
  // Mobile Menu
  isMobileMenuOpen: false,
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  // Cart Drawer
  isCartDrawerOpen: false,
  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),

  // Search Modal
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  // Filter Drawer (mobile)
  isFilterDrawerOpen: false,
  openFilterDrawer: () => set({ isFilterDrawerOpen: true }),
  closeFilterDrawer: () => set({ isFilterDrawerOpen: false }),
  toggleFilterDrawer: () => set((state) => ({ isFilterDrawerOpen: !state.isFilterDrawerOpen })),

  // Quick View Modal
  quickViewProduct: null,
  isQuickViewOpen: false,
  openQuickView: (product) => set({ quickViewProduct: product, isQuickViewOpen: true }),
  closeQuickView: () => set({ quickViewProduct: null, isQuickViewOpen: false }),

  // Auth Modal
  authModalType: null, // 'login' | 'register' | 'forgot-password'
  isAuthModalOpen: false,
  openAuthModal: (type = 'login') => set({ authModalType: type, isAuthModalOpen: true }),
  closeAuthModal: () => set({ authModalType: null, isAuthModalOpen: false }),
  switchAuthModal: (type) => set({ authModalType: type }),

  // Toast Notifications
  toasts: [],
  addToast: (toast) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      type: 'info', // 'success' | 'error' | 'warning' | 'info'
      duration: 5000,
      ...toast,
    };

    set((state) => ({ toasts: [...state.toasts, newToast] }));

    // Auto remove toast
    if (newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }

    return id;
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  clearToasts: () => set({ toasts: [] }),

  // Shorthand toast methods
  showSuccess: (message, options = {}) => {
    return get().addToast({ type: 'success', message, ...options });
  },
  showError: (message, options = {}) => {
    return get().addToast({ type: 'error', message, ...options });
  },
  showWarning: (message, options = {}) => {
    return get().addToast({ type: 'warning', message, ...options });
  },
  showInfo: (message, options = {}) => {
    return get().addToast({ type: 'info', message, ...options });
  },

  // Loading States
  globalLoading: false,
  loadingMessage: '',
  setGlobalLoading: (loading, message = '') => {
    set({ globalLoading: loading, loadingMessage: message });
  },

  // Confirmation Modal
  confirmationModal: {
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null,
    variant: 'default', // 'default' | 'danger'
  },
  showConfirmation: ({
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'default',
  }) => {
    set({
      confirmationModal: {
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        onConfirm,
        onCancel,
        variant,
      },
    });
  },
  hideConfirmation: () => {
    set({
      confirmationModal: {
        ...get().confirmationModal,
        isOpen: false,
      },
    });
  },
  confirmAction: () => {
    const { onConfirm } = get().confirmationModal;
    if (onConfirm) onConfirm();
    get().hideConfirmation();
  },
  cancelAction: () => {
    const { onCancel } = get().confirmationModal;
    if (onCancel) onCancel();
    get().hideConfirmation();
  },

  // Admin Sidebar
  isAdminSidebarCollapsed: false,
  toggleAdminSidebar: () =>
    set((state) => ({ isAdminSidebarCollapsed: !state.isAdminSidebarCollapsed })),
  setAdminSidebarCollapsed: (collapsed) => set({ isAdminSidebarCollapsed: collapsed }),

  // Scroll Position (for header behavior)
  scrollPosition: 0,
  isScrolled: false,
  setScrollPosition: (position) => {
    set({
      scrollPosition: position,
      isScrolled: position > 50,
    });
  },

  // Close all modals/drawers
  closeAll: () => {
    set({
      isMobileMenuOpen: false,
      isCartDrawerOpen: false,
      isSearchOpen: false,
      isFilterDrawerOpen: false,
      isQuickViewOpen: false,
      quickViewProduct: null,
      isAuthModalOpen: false,
      authModalType: null,
    });
  },
}));

export default useUIStore;
