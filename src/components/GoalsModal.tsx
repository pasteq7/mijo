import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import { NUTRIENT_META } from '../data/nutrients';
import { DEFAULT_GOALS } from '../data/nutrients';
import type { DailyGoals, NutrientKey } from '../types';

interface Props {
  goals: DailyGoals;
  onSave: (goals: DailyGoals) => void;
  onClose: () => void;
}

export function GoalsModal({ goals, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<DailyGoals>({ ...goals });

  const handleChange = (key: NutrientKey, val: string) => {
    setDraft((prev) => ({ ...prev, [key]: parseFloat(val) || 0 }));
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-[#FAFAF7] rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center px-5 py-4 border-b border-stone-200">
            <h2 className="font-semibold text-stone-800">Objectifs nutritionnels</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setDraft({ ...DEFAULT_GOALS })}
                className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 px-2 py-1 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <RotateCcw size={12} />
                Réinitialiser
              </button>
              <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="overflow-y-auto px-5 py-4 space-y-3">
            {NUTRIENT_META.map((meta) => (
              <div key={meta.id} className="flex items-center justify-between gap-4">
                <label className="text-sm text-stone-700 flex-1">
                  {meta.label}
                  <span className="text-stone-400 ml-1 text-xs">({meta.unit})</span>
                </label>
                <input
                  type="number"
                  min={0}
                  step={meta.unit === 'µg' || meta.unit === 'mg' ? 0.1 : 1}
                  value={draft[meta.id as NutrientKey] as number}
                  onChange={(e) => handleChange(meta.id as NutrientKey, e.target.value)}
                  className="w-24 text-right bg-[#F0EBE0] rounded-lg px-2 py-1 text-sm text-stone-700 outline-none focus:ring-2 focus:ring-[#7C9A6E]/40"
                />
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-stone-200">
            <button
              onClick={() => { onSave(draft); onClose(); }}
              className="w-full bg-[#7C9A6E] hover:bg-[#6a8760] text-white font-medium py-2.5 rounded-xl transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}