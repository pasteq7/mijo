import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';

interface ResetConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ResetConfirmDialog({ open, onCancel, onConfirm }: ResetConfirmDialogProps) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="reset-confirm"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-[var(--border)] bg-[var(--bg-subtle)] px-6 py-5">
              <h2 className="display-font text-lg font-light text-[var(--text-h)]">
                {t('goalsModal.resetConfirmTitle')}
              </h2>
            </div>
            <div className="px-6 py-6">
              <p className="text-sm leading-relaxed text-[var(--text)]">{t('goalsModal.resetConfirmText')}</p>
            </div>
            <div className="flex gap-3 border-t border-[var(--border)] bg-[var(--bg-subtle)] px-6 py-4">
              <button
                onClick={onCancel}
                className="flex-1 rounded-xl bg-[var(--warm-100)] py-2.5 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--warm-200)]"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition-colors hover:bg-red-600"
              >
                {t('common.reset')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
