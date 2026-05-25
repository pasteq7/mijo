import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Download,
  RotateCcw,
  SlidersHorizontal,
  Upload,
  X,
} from 'lucide-react';
import { DAILY_GOALS, MEAL_GOALS } from '../data/nutrients';
import { calculateGoals } from '../utils/goalCalculations';
import type { DailyGoals, MealGoals, NutrientKey } from '../types';
import type { ActivityLevel, CalorieTarget, GoalProfile, Sex } from '../utils/goalCalculations';
import { useLanguage } from '../hooks/useLanguage';
import { scaleGoalsFromCalories } from '../utils/goalScaling';
import { ManualGoalEditor, type GoalTab } from './goals/ManualGoalEditor';
import { ResetConfirmDialog } from './goals/ResetConfirmDialog';
import { SmartGoalForm } from './goals/SmartGoalForm';

interface Props {
  dailyGoals: DailyGoals;
  mealGoals: MealGoals;
  smartProfile: GoalProfile;
  onSaveDaily: (goals: DailyGoals) => void;
  onSaveMeal: (goals: MealGoals) => void;
  onSaveSmartProfile: (profile: GoalProfile) => void;
  onClose: () => void;
  onExport: () => void;
  onImport: (json: string) => void;
  onResetAll: () => void;
}

type ViewMode = 'simple' | 'advanced';

function getPreviewGoals(profile: GoalProfile) {
  return calculateGoals(profile);
}

export function NutritionGoalsModal({
  dailyGoals,
  mealGoals,
  smartProfile,
  onSaveDaily,
  onSaveMeal,
  onSaveSmartProfile,
  onClose,
  onExport,
  onImport,
  onResetAll,
}: Props) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<GoalTab>('daily');
  const [dailyDraft, setDailyDraft] = useState<DailyGoals>({ ...dailyGoals });
  const [mealDraft, setMealDraft] = useState<MealGoals>({ ...mealGoals });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('simple');
  const [formAge, setFormAge] = useState(smartProfile.age);
  const [formWeight, setFormWeight] = useState(smartProfile.weight);
  const [formHeight, setFormHeight] = useState(smartProfile.height);
  const [formSex, setFormSex] = useState<Sex>(smartProfile.sex);
  const [formActivity, setFormActivity] = useState<ActivityLevel>(smartProfile.activity);
  const [formTarget, setFormTarget] = useState<CalorieTarget>(smartProfile.target ?? 'deficit');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profile = useMemo<GoalProfile>(
    () => ({
      age: formAge,
      weight: formWeight,
      height: formHeight,
      sex: formSex,
      activity: formActivity,
      target: formTarget,
    }),
    [formAge, formWeight, formHeight, formSex, formActivity, formTarget],
  );

  const preview = useMemo(() => getPreviewGoals(profile), [profile]);
  const currentDraft = activeTab === 'daily' ? dailyDraft : mealDraft;
  const defaultGoals = activeTab === 'daily' ? DAILY_GOALS : MEAL_GOALS;

  const handleImportFile = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleChange = (tab: GoalTab, key: NutrientKey, val: string) => {
    const num = parseFloat(val) || 0;

    if (tab === 'daily') {
      setDailyDraft((prev) =>
        key === 'calories' ? scaleGoalsFromCalories(prev, DAILY_GOALS, num) : { ...prev, [key]: num },
      );
      return;
    }

    setMealDraft((prev) =>
      key === 'calories' ? scaleGoalsFromCalories(prev, MEAL_GOALS, num) : { ...prev, [key]: num },
    );
  };

  const handleSave = () => {
    if (viewMode === 'simple') {
      onSaveDaily(preview.daily);
      onSaveMeal(preview.meal);
      onSaveSmartProfile(profile);
    } else {
      onSaveDaily(dailyDraft);
      onSaveMeal(mealDraft);
    }
    onClose();
  };

  const handleReset = () => {
    setShowResetConfirm(false);
    onResetAll();
  };

  const summaryGoals = viewMode === 'simple' ? preview.daily : dailyDraft;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-2xl sm:max-h-[88vh]"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-4 sm:px-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="display-font text-xl font-light text-[var(--text-h)]">{t('goalsModal.title')}</h2>
                <p className="mt-1 text-xs text-[var(--text)]">
                  {t('goalsModal.subTitle')}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text)] transition-colors hover:bg-[var(--warm-200)] hover:text-[var(--action)]"
                  title={t('goalsModal.importData')}
                >
                  <Upload size={15} strokeWidth={1.5} />
                </button>
                <button
                  onClick={onExport}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text)] transition-colors hover:bg-[var(--warm-200)] hover:text-[var(--action)]"
                  title={t('goalsModal.exportData')}
                >
                  <Download size={15} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text)] transition-colors hover:bg-[var(--warm-200)] hover:text-red-500"
                  title={t('goalsModal.resetGoals')}
                >
                  <RotateCcw size={15} strokeWidth={1.5} />
                </button>
                <button
                  onClick={onClose}
                  className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text)] transition-colors hover:bg-[var(--warm-200)]"
                  title={t('common.close')}
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl border border-[var(--border-soft)] bg-[var(--warm-100)] p-1">
              <button
                onClick={() => setViewMode('simple')}
                className={`flex min-w-0 items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-all sm:px-3 ${
                  viewMode === 'simple'
                    ? 'bg-[var(--bg)] text-[var(--text-h)] shadow-[var(--shadow-sm)]'
                    : 'text-[var(--text)] hover:text-[var(--text-h)]'
                }`}
              >
                <Calculator size={16} strokeWidth={1.5} />
                <span className="truncate">{t('goalsModal.viewModeSmart')}</span>
              </button>
              <button
                onClick={() => setViewMode('advanced')}
                className={`flex min-w-0 items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-all sm:px-3 ${
                  viewMode === 'advanced'
                    ? 'bg-[var(--bg)] text-[var(--text-h)] shadow-[var(--shadow-sm)]'
                    : 'text-[var(--text)] hover:text-[var(--text-h)]'
                }`}
              >
                <SlidersHorizontal size={16} strokeWidth={1.5} />
                <span className="truncate">{t('goalsModal.viewModeManual')}</span>
              </button>
            </div>

            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
            <AnimatePresence mode="wait">
              {viewMode === 'simple' ? (
                <SmartGoalForm
                  formAge={formAge}
                  setFormAge={setFormAge}
                  formWeight={formWeight}
                  setFormWeight={setFormWeight}
                  formHeight={formHeight}
                  setFormHeight={setFormHeight}
                  formSex={formSex}
                  setFormSex={setFormSex}
                  formActivity={formActivity}
                  setFormActivity={setFormActivity}
                  formTarget={formTarget}
                  setFormTarget={setFormTarget}
                  preview={preview}
                  summaryGoals={summaryGoals}
                />
              ) : (
                <ManualGoalEditor
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  currentDraft={currentDraft}
                  defaultGoals={defaultGoals}
                  onChange={handleChange}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-[var(--border)] bg-[var(--bg-subtle)] px-5 py-4">
            <button
              onClick={handleSave}
              className="w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition-colors hover:bg-[#5C7D5B]"
            >
              {viewMode === 'simple' ? t('common.saveThese') : t('common.saveAll')}
            </button>
          </div>
        </motion.div>
      </motion.div>

      <ResetConfirmDialog
        open={showResetConfirm}
        onCancel={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
      />
    </AnimatePresence>
  );
}
