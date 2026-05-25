import { NUTRIENT_META } from '../../data/nutrients';
import { useLanguage } from '../../hooks/useLanguage';
import type { NutrientGoals, NutrientKey } from '../../types';

const SUMMARY_KEYS: NutrientKey[] = ['calories', 'proteines', 'glucides', 'lipides', 'fibres'];

export function GoalSummaryGrid({ goals }: { goals: NutrientGoals }) {
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
