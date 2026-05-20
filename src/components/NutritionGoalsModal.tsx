import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Download,
  RotateCcw,
  SlidersHorizontal,
  Sun,
  Moon,
  Upload,
  X,
} from 'lucide-react';
import { DAILY_GOALS, MEAL_GOALS, NUTRIENT_META } from '../data/nutrients';
import { ACTIVITY_LABELS, CALORIE_TARGET_LABELS, calculateGoals } from '../utils/goalCalculations';
import type { DailyGoals, MealGoals, NutrientGoals, NutrientKey } from '../types';
import type { ActivityLevel, CalorieTarget, GoalProfile, Sex } from '../utils/goalCalculations';
import { useLanguage } from '../hooks/useLanguage';
import type { ReactNode } from 'react';

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

type Tab = 'daily' | 'meal';
type ViewMode = 'simple' | 'advanced';

const SUMMARY_KEYS: NutrientKey[] = ['calories', 'proteines', 'glucides', 'lipides', 'fibres'];

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function scaleGoalsFromCalories(current: NutrientGoals, defaults: NutrientGoals, calories: number): NutrientGoals {
  const nextCalories = Math.max(0, calories);
  const previousCalories = current.calories > 0 ? current.calories : defaults.calories;
  const scaleFactor = previousCalories > 0 ? nextCalories / previousCalories : 1;

  const next = { ...current, calories: Math.round(nextCalories) };

  for (const meta of NUTRIENT_META) {
    const key = meta.id as NutrientKey;
    if (key === 'calories') continue;

    if (key === 'proteines') next[key] = round1((nextCalories * 0.2) / 4);
    else if (key === 'glucides') next[key] = round1((nextCalories * 0.5) / 4);
    else if (key === 'lipides') next[key] = round1((nextCalories * 0.3) / 9);
    else if (key === 'fibres') next[key] = round1((14 * nextCalories) / 1000);
    else next[key] = round1((current[key] || defaults[key] || 0) * scaleFactor);
  }

  return next;
}

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
  const [activeTab, setActiveTab] = useState<Tab>('daily');
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

  const handleChange = (tab: Tab, key: NutrientKey, val: string) => {
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-2xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-[var(--border)] bg-[var(--bg-subtle)] px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="display-font text-xl font-light text-[var(--text-h)]">{t('goalsModal.title')}</h2>
                <p className="mt-1 text-xs text-[var(--text)]">
                  {t('goalsModal.subTitle')}
                </p>
              </div>

              <div className="flex items-center gap-1">
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
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  viewMode === 'simple'
                    ? 'bg-[var(--bg)] text-[var(--text-h)] shadow-[var(--shadow-sm)]'
                    : 'text-[var(--text)] hover:text-[var(--text-h)]'
                }`}
              >
                <Calculator size={16} strokeWidth={1.5} />
                {t('goalsModal.viewModeSmart')}
              </button>
              <button
                onClick={() => setViewMode('advanced')}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  viewMode === 'advanced'
                    ? 'bg-[var(--bg)] text-[var(--text-h)] shadow-[var(--shadow-sm)]'
                    : 'text-[var(--text)] hover:text-[var(--text-h)]'
                }`}
              >
                <SlidersHorizontal size={16} strokeWidth={1.5} />
                {t('goalsModal.viewModeManual')}
              </button>
            </div>

            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            <AnimatePresence mode="wait">
              {viewMode === 'simple' ? (
                <motion.div
                  key="simple"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-5"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label={t('goalsModal.fieldAge')} suffix={t('goalsModal.yearsSuffix')}>
                      <input
                        type="number"
                        min={10}
                        max={120}
                        value={formAge || ''}
                        onChange={(e) => setFormAge(parseInt(e.target.value) || 0)}
                        className="w-full bg-transparent text-right text-sm font-medium text-[var(--text-h)] outline-none"
                      />
                    </Field>
                    <Field label={t('goalsModal.fieldWeight')} suffix="kg">
                      <input
                        type="number"
                        min={20}
                        max={300}
                        step={0.1}
                        value={formWeight || ''}
                        onChange={(e) => setFormWeight(parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent text-right text-sm font-medium text-[var(--text-h)] outline-none"
                      />
                    </Field>
                    <Field label={t('goalsModal.fieldHeight')} suffix="cm">
                      <input
                        type="number"
                        min={50}
                        max={250}
                        value={formHeight || ''}
                        onChange={(e) => setFormHeight(parseInt(e.target.value) || 0)}
                        className="w-full bg-transparent text-right text-sm font-medium text-[var(--text-h)] outline-none"
                      />
                    </Field>
                    <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--warm-100)] p-1">
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          onClick={() => setFormSex('male')}
                          className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                            formSex === 'male'
                              ? 'bg-[var(--bg)] text-[var(--text-h)] shadow-[var(--shadow-sm)]'
                              : 'text-[var(--text)]'
                          }`}
                        >
                          {t('goalsModal.sexMale')}
                        </button>
                        <button
                          onClick={() => setFormSex('female')}
                          className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                            formSex === 'female'
                              ? 'bg-[var(--bg)] text-[var(--text-h)] shadow-[var(--shadow-sm)]'
                              : 'text-[var(--text)]'
                          }`}
                        >
                          {t('goalsModal.sexFemale')}
                        </button>
                      </div>
                    </div>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-xs font-medium uppercase tracking-[0.08em] text-[var(--text)]">
                      {t('goalsModal.fieldTarget')}
                    </span>
                    <div className="grid grid-cols-3 gap-1 rounded-xl border border-[var(--border-soft)] bg-[var(--warm-100)] p-1">
                      {(Object.keys(CALORIE_TARGET_LABELS) as CalorieTarget[]).map((target) => (
                        <button
                          key={target}
                          onClick={() => setFormTarget(target)}
                          className={`rounded-lg px-2 py-2 text-sm font-medium transition-all ${
                            formTarget === target
                              ? 'bg-[var(--bg)] text-[var(--text-h)] shadow-[var(--shadow-sm)]'
                              : 'text-[var(--text)] hover:text-[var(--text-h)]'
                          }`}
                        >
                          {t('targets.' + target)}
                        </button>
                      ))}
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-medium uppercase tracking-[0.08em] text-[var(--text)]">
                      {t('goalsModal.fieldActivity')}
                    </span>
                    <select
                      value={formActivity}
                      onChange={(e) => setFormActivity(e.target.value as ActivityLevel)}
                      className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--warm-100)] px-3 py-2.5 text-sm font-medium text-[var(--text-h)] outline-none transition-all focus:ring-2 focus:ring-[var(--accent-soft)]"
                    >
                      {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((level) => (
                        <option key={level} value={level}>
                          {t('activities.' + level)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-4">
                    <div className="mb-4 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--text)]">{t('goalsModal.previewTitle')}</p>
                        <p className="display-font mt-1 text-3xl font-light leading-none text-[var(--text-h)]">
                          {preview.daily.calories}
                          <span className="ml-1 text-sm font-normal text-[var(--text)]"> {t('goalsModal.kcalPerDay')}</span>
                        </p>
                      </div>
                      <p className="text-right text-xs text-[var(--text)]">
                        {t('goalsModal.kcalPerMeal', { calories: preview.meal.calories })}
                      </p>
                    </div>
                    <SummaryGrid goals={summaryGoals} />
                  </div>

                </motion.div>
              ) : (
                <motion.div
                  key="advanced"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-1 rounded-xl border border-[var(--border-soft)] bg-[var(--warm-100)] p-1">
                    <button
                      onClick={() => setActiveTab('daily')}
                      className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        activeTab === 'daily'
                          ? 'bg-[var(--bg)] text-[var(--text-h)] shadow-[var(--shadow-sm)]'
                          : 'text-[var(--text)] hover:text-[var(--text-h)]'
                      }`}
                    >
                      <Sun size={16} strokeWidth={1.5} />
                      {t('goalsModal.dailyTab')}
                    </button>
                    <button
                      onClick={() => setActiveTab('meal')}
                      className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        activeTab === 'meal'
                          ? 'bg-[var(--bg)] text-[var(--text-h)] shadow-[var(--shadow-sm)]'
                          : 'text-[var(--text)] hover:text-[var(--text-h)]'
                      }`}
                    >
                      <Moon size={16} strokeWidth={1.5} />
                      {t('goalsModal.mealTab')}
                    </button>
                  </div>

                  <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-4">
                    <label className="mb-2 block text-xs font-medium uppercase tracking-[0.08em] text-[var(--text)]">
                      {t('nutrients.calories.label')}
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={0}
                        step={10}
                        value={currentDraft.calories}
                        onChange={(e) => handleChange(activeTab, 'calories', e.target.value)}
                        className="min-w-0 flex-1 bg-transparent text-4xl font-light leading-none text-[var(--text-h)] outline-none display-font tabular-nums"
                      />
                      <span className="text-sm font-medium text-[var(--text)]">kcal</span>
                    </div>
                    <p className="mt-2 text-xs text-[var(--text)]">
                      {t('goalsModal.manualEditHint')}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(
                      NUTRIENT_META.filter((meta) => meta.id !== 'calories').reduce<
                        Record<string, typeof NUTRIENT_META>
                      >((groups, meta) => {
                        groups[meta.group] = groups[meta.group] || [];
                        groups[meta.group].push(meta);
                        return groups;
                      }, {}),
                    ).map(([group, items]) => (
                      <div key={group} className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-3">
                        <p className="mb-2 px-1 text-xs font-medium uppercase tracking-[0.08em] text-[var(--text)]">
                          {t('goalsModal.nutrientGroups.' + group)}
                        </p>
                        <div className="space-y-1">
                          {items.map((meta) => {
                            const key = meta.id as NutrientKey;
                            const defaultValue = defaultGoals[key];
                            const currentValue = currentDraft[key] as number;
                            const isModified = currentValue !== defaultValue;

                            return (
                              <div
                                key={meta.id}
                                className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-[var(--warm-100)]"
                              >
                                <label className="min-w-0 flex-1 text-sm font-medium text-[var(--text-h)]">
                                  {t('nutrients.' + meta.id + '.label')}
                                  <span className="ml-1.5 text-xs font-normal text-[var(--text)]">({meta.unit})</span>
                                </label>
                                <div className="flex items-center gap-1.5">
                                  {isModified && (
                                    <button
                                      onClick={() => handleChange(activeTab, key, String(defaultValue))}
                                      className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text)] transition-colors hover:bg-[var(--warm-200)] hover:text-[var(--action)]"
                                      title={t('goalsModal.resetToDefault', { val: defaultValue, unit: meta.unit })}
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
                                    className="w-24 rounded-lg bg-[var(--warm-100)] px-2.5 py-1.5 text-right text-sm font-medium text-[var(--text-h)] shadow-inner outline-none transition-all focus:ring-2 focus:ring-[var(--accent-soft)]"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
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

      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            key="reset-confirm"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              className="w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-[var(--border)] bg-[var(--bg-subtle)] px-6 py-5">
                <h2 className="display-font text-lg font-light text-[var(--text-h)]">{t('goalsModal.resetConfirmTitle')}</h2>
              </div>
              <div className="px-6 py-6">
                <p className="text-sm leading-relaxed text-[var(--text)]">
                  {t('goalsModal.resetConfirmText')}
                </p>
              </div>
              <div className="flex gap-3 border-t border-[var(--border)] bg-[var(--bg-subtle)] px-6 py-4">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 rounded-xl bg-[var(--warm-100)] py-2.5 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--warm-200)]"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition-colors hover:bg-red-600"
                >
                  {t('common.reset')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}

function Field({ label, suffix, children }: { label: string; suffix: string; children: ReactNode }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-soft)] bg-[var(--warm-100)] px-3 py-2.5 transition-all focus-within:ring-2 focus-within:ring-[var(--accent-soft)]">
      <span className="text-sm font-medium text-[var(--text-h)]">{label}</span>
      <span className="flex min-w-0 items-center gap-2">
        {children}
        <span className="text-xs text-[var(--text)]">{suffix}</span>
      </span>
    </label>
  );
}

function SummaryGrid({ goals }: { goals: NutrientGoals }) {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {SUMMARY_KEYS.map((key) => {
        const meta = NUTRIENT_META.find((item) => item.id === key);
        if (!meta) return null;

        return (
          <div key={key} className="rounded-lg bg-[var(--warm-100)] px-3 py-2">
            <p className="truncate text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text)]">
              {t('nutrients.' + meta.id + '.label')}
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--text-h)] tabular-nums">
              {goals[key]}
              <span className="ml-1 text-[11px] font-normal text-[var(--text)]">{meta.unit}</span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
