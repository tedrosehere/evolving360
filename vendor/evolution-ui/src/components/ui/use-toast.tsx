"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "../../utils";
import { Button } from "./button";

const ToastContext = React.createContext<{
  toast: (props: ToastProps) => void;
}>({
  toast: () => {}
});

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<(ToastProps & { id: string })[]>(
    []
  );

  const toast = React.useCallback(
    ({
      title,
      description,
      variant = "default",
      duration = 5000
    }: ToastProps) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts(prev => [
        ...prev,
        { id, title, description, variant, duration }
      ]);

      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, duration);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-md w-full">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={cn(
              "flex w-full items-start gap-4 rounded-lg border p-4 shadow-lg transition-all animate-in fade-in slide-in-from-bottom-5",
              toast.variant === "destructive"
                ? "border-red-500 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50"
                : "border-border bg-surface-background text-ink"
            )}
          >
            <div className="flex-1 space-y-1">
              {toast.title && <div className="font-medium">{toast.title}</div>}
              {toast.description && (
                <div className="text-md opacity-90">{toast.description}</div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() =>
                setToasts(prev => prev.filter(t => t.id !== toast.id))
              }
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export const toast = (props: ToastProps) => {
  if (typeof window !== "undefined") {
    const event = new CustomEvent("toast", { detail: props });
    window.dispatchEvent(event);
  }
};

export function Toaster() {
  const { toast } = useToast();

  React.useEffect(() => {
    const handleToast = (event: Event) => {
      const { detail } = event as CustomEvent<ToastProps>;
      toast(detail);
    };

    window.addEventListener("toast", handleToast);
    return () => window.removeEventListener("toast", handleToast);
  }, [toast]);

  return null;
}
