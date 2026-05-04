import { motion } from 'framer-motion';

interface Props {
  step: 1 | 2 | 3;
  label: string;
}

export function StepIndicator({ step, label }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3 pb-1"
    >
      <span className="w-9 h-9 rounded-full border-2 border-[var(--accent)] text-[var(--accent)] text-[18px] font-[450] leading-none flex items-center justify-center" style={{ fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: '-0.02em' }}>
        {step}
      </span>
      <span className="display-font text-[13px] font-medium text-[var(--text)] uppercase tracking-[0.15em]">
        {label}
      </span>
    </motion.div>
  );
}
