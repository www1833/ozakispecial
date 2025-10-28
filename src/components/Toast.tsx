import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { Transition } from '@headlessui/react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('ToastProviderの内側で使用してください');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 w-full max-w-md -translate-x-1/2 space-y-3 px-4">
        {toasts.map((toast) => (
          <Transition
            key={toast.id}
            appear
            show
            enter="transform transition duration-200"
            enterFrom="translate-y-4 opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transition duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className={`pointer-events-auto rounded-lg border bg-white px-4 py-3 shadow ${
                toast.type === 'success'
                  ? 'border-emerald-200 text-emerald-700'
                  : toast.type === 'error'
                  ? 'border-rose-200 text-rose-700'
                  : 'border-primary-200 text-primary-700'
              }`}
              role="status"
              aria-live="assertive"
            >
              {toast.message}
            </div>
          </Transition>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
