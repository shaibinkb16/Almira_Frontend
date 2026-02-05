import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import { ToastContainer } from '@/components/ui/Toast';
import CartDrawer from '@/features/cart/components/CartDrawer';
import SearchModal from '@/features/search/components/SearchModal';
import { EmailCapturePopup } from '@/components/marketing/EmailCapturePopup';
import ScrollToTop from '@/components/ScrollToTop';

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Scroll to top on route change */}
      <ScrollToTop />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 pt-16 lg:pt-28">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Components */}
      <ToastContainer />
      <CartDrawer />
      <SearchModal />
      <EmailCapturePopup />
    </div>
  );
}

export default MainLayout;
