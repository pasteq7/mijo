import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  visible: boolean;
}

export function TutorialPanel({ visible }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="spotlight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[15] pointer-events-none bg-black/[0.06]"
        />
      )}
    </AnimatePresence>
  );
}
