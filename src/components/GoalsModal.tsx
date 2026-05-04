import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Sun, Moon, Download, Upload } from 'lucide-react';
import { NUTRIENT_META, MEAL_GOALS, DAILY_GOALS } from '../data/nutrients';
import type { DailyGoals, MealGoals, NutrientKey } from '../types';

interface Props {
  dailyGoals: DailyGoals;
  mealGoals: MealGoals;
  onSaveDaily: (goals: DailyGoals) => void;
  onSaveMeal: (goals: MealGoals) => void;
  onClose: () => void;
  onExport: () => void;
  onImport: (json: string) => void;
  onResetAll: () => void;
}

type Tab = 'daily' | 'meal';

export function GoalsModal({ dailyGoals, mealGoals, onSaveDaily, onSaveMeal, onClose, onExport, onImport, onResetAll }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('daily');
  const [dailyDraft, setDailyDraft] = useState<DailyGoals>({ ...dailyGoals });
  const [mealDraft, setMealDraft] = useState<MealGoals>({ ...mealGoals });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) onImport(text);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

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
    onClose();
  };

  const handleReset = () => {
    setShowResetConfirm(false);
    onResetAll();
  };

  const currentDraft = activeTab === 'daily' ? dailyDraft : mealDraft;
  const defaultGoals = activeTab === 'daily' ? DAILY_GOALS : MEAL_GOALS;

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
          className="bg-[var(--bg)] rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-[var(--border)]"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center px-6 py-5 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
            <h2 className="text-xl font-light text-[var(--text-h)] display-font">Objectifs nutritionnels</h2>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-lg text-[var(--text)] hover:text-[var(--action)] hover:bg-[var(--warm-200)] transition-colors"
                title="Importer les données"
              >
                <Upload size={15} strokeWidth={1.5} />
              </button>
              <button
                onClick={onExport}
                className="p-1.5 rounded-lg text-[var(--text)] hover:text-[var(--action)] hover:bg-[var(--warm-200)] transition-colors"
                title="Exporter les données"
              >
                <Download size={15} strokeWidth={1.5} />
              </button>
              <span className="w-px h-4 mx-0.5 bg-[var(--border)]" />
              <button
                onClick={() => setShowResetConfirm(true)}
                className="p-1.5 rounded-lg text-[var(--text)] hover:text-red-500 hover:bg-[var(--warm-200)] transition-colors"
                title="Réinitialiser les objectifs"
              >
                <RotateCcw size={15} strokeWidth={1.5} />
              </button>
              <button onClick={onClose} className="ml-2 p-1 rounded-lg hover:bg-[var(--warm-200)] transition-colors">
                <X size={18} strokeWidth={1.5} className="text-[var(--text)]" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>
          <div className="flex border-b border-[var(--border)] px-6 bg-[var(--bg-subtle)]">
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-all ${activeTab === 'daily'
                  ? 'border-[var(--accent)] text-[var(--text-h)]'
                  : 'border-transparent text-[var(--text)] hover:text-[var(--text-h)]'
                }`}
            >
              <Sun size={18} strokeWidth={1.5} />
              <span className="text-sm font-medium uppercase tracking-[0.05em]">Journalier</span>
            </button>
            <button
              onClick={() => setActiveTab('meal')}
              className={`flex items-center gap-2 py-4 px-2 ml-4 border-b-2 transition-all ${activeTab === 'meal'
                  ? 'border-[var(--accent)] text-[var(--text-h)]'
                  : 'border-transparent text-[var(--text)] hover:text-[var(--text-h)]'
                }`}
            >
              <Moon size={18} strokeWidth={1.5} />
              <span className="text-sm font-medium uppercase tracking-[0.05em]">Par repas</span>
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
                className="space-y-3 bg-[var(--bg-subtle)] p-4 rounded-xl shadow-[var(--shadow-sm)] border border-[var(--border)]"
              >
                {NUTRIENT_META.map((meta) => {
                  const key = meta.id as NutrientKey;
                  const defaultValue = defaultGoals[key];
                  const currentValue = currentDraft[key] as number;
                  const isModified = currentValue !== defaultValue;

                  return (
                    <div key={meta.id} className="flex items-center justify-between gap-4 py-1">
                      <label className="text-sm text-[var(--text-h)] font-medium flex-1">
                        {meta.label}
                        <span className="text-[var(--text)] ml-1.5 text-xs font-normal">({meta.unit})</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        {isModified && (
                          <button
                            onClick={() => handleChange(activeTab, key, String(defaultValue))}
                            className="text-[var(--text)] hover:text-[var(--action)] transition-colors p-0.5"
                            title={`Réinitialiser à ${defaultValue} ${meta.unit}`}
                          >
                            <RotateCcw size={12} strokeWidth={1.5} />
                          </button>
                        )}
                        <input
                          type="number"
                          min={0}
                          step={meta.unit === 'µg' || meta.unit === 'mg' ? 0.1 : 1}
                          value={currentValue}
                          onChange={(e) => handleChange(activeTab, key, e.target.value)}
                          className="w-24 text-right bg-[var(--warm-100)] rounded-lg px-2.5 py-1.5 text-sm font-medium text-[var(--text-h)] outline-none focus:ring-2 focus:ring-[var(--accent-soft)] shadow-inner"
                        />
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="px-6 py-5 border-t border-[var(--border)] bg-[var(--bg-subtle)]">
            <button
              onClick={handleSave}
              className="w-full bg-[var(--accent)] hover:bg-[#5C7D5B] text-white font-medium py-3 rounded-xl transition-colors shadow-[var(--shadow-sm)]"
            >
              Enregistrer
            </button>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            key="reset-confirm"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              className="bg-[var(--bg)] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-[var(--border)]"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
                <h2 className="text-lg font-light text-[var(--text-h)] display-font">Réinitialiser les objectifs</h2>
              </div>
              <div className="px-6 py-6">
                <p className="text-sm text-[var(--text)] leading-relaxed">
                  Êtes-vous sûr de vouloir réinitialiser tous les objectifs&nbsp;? Cette action remettra toutes les valeurs par défaut.
                </p>
              </div>
              <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-subtle)] flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[var(--text)] bg-[var(--warm-100)] hover:bg-[var(--warm-200)] transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors shadow-[var(--shadow-sm)]"
                >
                  Réinitialiser
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
