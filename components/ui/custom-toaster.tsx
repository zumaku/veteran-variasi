"use client";

import { useEffect, useState } from "react";
import { toast } from "@/lib/toast-store";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";

export function Toaster() {
  const [toasts, setToasts] = useState<any[]>([]);

  useEffect(() => {
    return toast.subscribe((newToasts) => {
      setToasts(newToasts);
    });
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`
              pointer-events-auto min-w-[320px] max-w-md p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-xl
              ${t.type === 'success' ? 'bg-white/90 dark:bg-zinc-900/90 border-green-200 dark:border-green-900/30' : 
                t.type === 'error' ? 'bg-white/90 dark:bg-zinc-900/90 border-red-200 dark:border-red-900/30' : 
                'bg-white/90 dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800'}
            `}
          >
            <div className={`mt-0.5 rounded-full p-0.5 ${
              t.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {t.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-bold tracking-tight">
                {t.type === 'success' ? 'Berhasil' : 'Kesalahan'}
              </p>
              <p className="text-[13px] leading-tight text-muted-foreground mt-0.5">
                {t.message}
              </p>
            </div>

            <button 
              onClick={() => toast.dismiss(t.id)}
              className="mt-0.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
