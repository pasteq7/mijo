import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { motion } from 'framer-motion';
import { ACTIVITY_LABELS, CALORIE_TARGET_LABELS } from '../../utils/goalCalculations';
import type { ActivityLevel, CalorieTarget, Sex } from '../../utils/goalCalculations';
import { useLanguage } from '../../hooks/useLanguage';
import type { NutrientGoals } from '../../types';
import { GoalSummaryGrid } from './GoalSummaryGrid';

interface SmartGoalFormProps {
  formAge: number;
  setFormAge: Dispatch<SetStateAction<number>>;
  formWeight: number;
  setFormWeight: Dispatch<SetStateAction<number>>;
  formHeight: number;
  setFormHeight: Dispatch<SetStateAction<number>>;
  formSex: Sex;
  setFormSex: Dispatch<SetStateAction<Sex>>;
  formActivity: ActivityLevel;
  setFormActivity: Dispatch<SetStateAction<ActivityLevel>>;
  formTarget: CalorieTarget;
  setFormTarget: Dispatch<SetStateAction<CalorieTarget>>;
  preview: { daily: NutrientGoals; meal: NutrientGoals };
  summaryGoals: NutrientGoals;
}

export function SmartGoalForm({
  formAge,
  setFormAge,
  formWeight,
  setFormWeight,
  formHeight,
  setFormHeight,
  formSex,
  setFormSex,
  formActivity,
  setFormActivity,
  formTarget,
  setFormTarget,
  preview,
  summaryGoals,
}: SmartGoalFormProps) {
  const { t } = useLanguage();

  return (
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
            {(['male', 'female'] as Sex[]).map((sex) => (
              <button
                key={sex}
                onClick={() => setFormSex(sex)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  formSex === sex
                    ? 'bg-[var(--bg)] text-[var(--text-h)] shadow-[var(--shadow-sm)]'
                    : 'text-[var(--text)]'
                }`}
              >
                {t(sex === 'male' ? 'goalsModal.sexMale' : 'goalsModal.sexFemale')}
              </button>
            ))}
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
        <div className="mb-4 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-end min-[420px]:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--text)]">
              {t('goalsModal.previewTitle')}
            </p>
            <p className="display-font mt-1 text-3xl font-light leading-none text-[var(--text-h)]">
              {preview.daily.calories}
              <span className="ml-1 text-sm font-normal text-[var(--text)]"> {t('goalsModal.kcalPerDay')}</span>
            </p>
          </div>
          <p className="text-right text-xs text-[var(--text)]">
            {t('goalsModal.kcalPerMeal', { calories: preview.meal.calories })}
          </p>
        </div>
        <GoalSummaryGrid goals={summaryGoals} />
      </div>
    </motion.div>
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
