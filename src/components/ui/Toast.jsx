import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/uiStore';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-500',
    title: 'text-green-800',
    message: 'text-green-700',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-500',
    title: 'text-red-800',
    message: 'text-red-700',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: 'text-yellow-500',
    title: 'text-yellow-800',
    message: 'text-yellow-700',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-500',
    title: 'text-blue-800',
    message: 'text-blue-700',
  },
};

function Toast({ id, type = 'info', title, message, duration = 5000 }) {
  const { removeToast } = useUIStore();
  const Icon = icons[type];
  const colorClasses = colors[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        removeToast(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, removeToast]);

  return (
    <div
      className={cn(
        'w-full max-w-sm rounded-lg border shadow-lg p-4',
        'animate-in slide-in-from-right-full fade-in duration-300',
        colorClasses.bg,
        colorClasses.border
      )}
      role="alert"
    >
      <div className="flex gap-3">
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', colorClasses.icon)} />
        <div className="flex-1 min-w-0">
          {title && (
            <p className={cn('text-sm font-medium', colorClasses.title)}>
              {title}
            </p>
          )}
          {message && (
            <p className={cn('text-sm mt-1', colorClasses.message)}>
              {message}
            </p>
          )}
        </div>
        <button
          onClick={() => removeToast(id)}
          className="flex-shrink-0 p-1 -m-1 rounded-full hover:bg-black/5 transition-colors"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
}

// Toast container - renders all toasts
function ToastContainer() {
  const { toasts } = useUIStore();

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} />
        </div>
      ))}
    </div>,
    document.body
  );
}

export { Toast, ToastContainer };
export default Toast;
