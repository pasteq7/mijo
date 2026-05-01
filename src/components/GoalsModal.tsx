import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Sun, Moon } from 'lucide-react';
import { NUTRIENT_META, MEAL_GOALS, multiplyGoals } from '../data/nutrients';
import type { DailyGoals, MealGoals, NutrientKey } from '../types';

interface Props {
  dailyGoals: DailyGoals;
  mealGoals: MealGoals;
  mealsPerDay: number;
  onSaveDaily: (goals: DailyGoals) => void;
  onSaveMeal: (goals: MealGoals) => void;
  onSaveMealsPerDay: (n: number) => void;
  onClose: () => void;
}

type Tab = 'daily' | 'meal';

export function GoalsModal({ dailyGoals, mealGoals, mealsPerDay, onSaveDaily, onSaveMeal, onSaveMealsPerDay, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('daily');
  const [dailyDraft, setDailyDraft] = useState<DailyGoals>({ ...dailyGoals });
  const [mealDraft, setMealDraft] = useState<MealGoals>({ ...mealGoals });
  const [localMeals, setLocalMeals] = useState(mealsPerDay);

  const handleChange = (
    tab: Tab,
    key: NutrientKey,
    val: string
  ) => {
    const num = parseFloat(val) || 0;
    if (tab === 'daily') {
      setDailyDraft((prev) => ({ ...prev, [key]: num }));
    } else {
      setMealDraft((prev) => ({ ...prev, [key]: num }));
    }
  };

  const handleSave = () => {
    onSaveDaily(dailyDraft);
    onSaveMeal(mealDraft);
    onSaveMealsPerDay(localMeals);
    onClose();
  };

  const currentDraft = activeTab === 'daily' ? dailyDraft : mealDraft;
  const defaultGoals = activeTab === 'daily' ? multiplyGoals(MEAL_GOALS, localMeals) : MEAL_GOALS;
  const setDraft = activeTab === 'daily' ? setDailyDraft : setMealDraft;

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
          className="bg-[var(--bg)] rounded-[2rem] w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-[var(--border)]"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center px-6 py-5 border-b border-[var(--border)] bg-white">
            <h2 className="text-xl font-light text-[--text-h] display-font">Objectifs nutritionnels</h2>
            <div className="flex gap-2">
              <button onClick={onClose} className="text-[--text] hover:text-[--action] transition-colors">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div className="px-6 py-4 bg-white border-b border-[var(--border)]">
            <div className="flex items-center justify-between max-w-44 mx-auto w-full">
              <label className="text-sm font-medium text-[--text-h]">Repas / jour</label>
              <input
                type="number"
                min={1}
                max={6}
                step={1}
                value={localMeals}
                onChange={(e) => {
                  const newVal = Math.max(1, Math.min(6, parseInt(e.target.value) || 1));
                  setLocalMeals(newVal);
                  setDailyDraft(multiplyGoals(mealDraft, newVal));
                }}
                className="w-16 text-right bg-[var(--warm-100)] rounded-xl px-2 py-1.5 text-sm font-medium text-[--text-h] outline-none focus:ring-2 focus:ring-[--accent-soft] shadow-inner"
              />
            </div>
          </div>

          <div className="flex border-b border-[var(--border)] px-6 bg-[var(--bg-subtle)]">
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-all ${
                activeTab === 'daily'
                  ? 'border-[--accent] text-[--text-h]'
                  : 'border-transparent text-[--text] hover:text-[--text-h]'
              }`}
            >
              <Sun size={18} strokeWidth={1.5} />
              <span className="text-sm font-medium uppercase tracking-[0.05em]">Journalier</span>
            </button>
            <button
              onClick={() => setActiveTab('meal')}
              className={`flex items-center gap-2 py-4 px-2 ml-4 border-b-2 transition-all ${
                activeTab === 'meal'
                  ? 'border-[--accent] text-[--text-h]'
                  : 'border-transparent text-[--text] hover:text-[--text-h]'
              }`}
            >
              <Moon size={18} strokeWidth={1.5} />
              <span className="text-sm font-medium uppercase tracking-[0.05em]">Par repas</span>
            </button>
          </div>

          <div className="px-6 py-3 flex justify-end">
            <button
              onClick={() => setDraft({ ...defaultGoals })}
              className="flex items-center gap-1.5 text-xs text-[--text] hover:text-[--action] px-3 py-1.5 rounded-lg hover:bg-[var(--warm-200)] transition-colors font-medium"
            >
              <RotateCcw size={14} strokeWidth={1.5} />
              Réinitialiser
            </button>
          </div>

          <div className="overflow-y-auto px-6 pb-6 space-y-4 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                className="space-y-3 bg-white p-4 rounded-2xl shadow-[var(--shadow-sm)] border border-[var(--border)]"
              >
                {NUTRIENT_META.map((meta) => (
                  <div key={meta.id} className="flex items-center justify-between gap-4 py-1">
                    <label className="text-sm text-[--text-h] font-medium flex-1">
                      {meta.label}
                      <span className="text-[--text] ml-1.5 text-xs font-normal">({meta.unit})</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={meta.unit === 'µg' || meta.unit === 'mg' ? 0.1 : 1}
                      value={currentDraft[meta.id as NutrientKey] as number}
                      onChange={(e) => handleChange(activeTab, meta.id as NutrientKey, e.target.value)}
                      className="w-24 text-right bg-[var(--warm-100)] rounded-lg px-2.5 py-1.5 text-sm font-medium text-[--text-h] outline-none focus:ring-2 focus:ring-[--accent-soft] shadow-inner"
                    />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="px-6 py-5 border-t border-[var(--border)] bg-white">
            <button
              onClick={handleSave}
              className="w-full bg-[--accent] hover:bg-[#5C7D5B] text-white font-medium py-3 rounded-2xl transition-colors shadow-[var(--shadow-sm)]"
            >
              Enregistrer
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}