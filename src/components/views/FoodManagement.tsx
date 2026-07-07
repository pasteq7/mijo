import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useIsDesktop } from '../../hooks/useMediaQuery';
import { STORAGE_KEYS } from '../../utils/storageKeys';
import { NutritionOverview } from '../NutritionOverview';
import { FoodList } from '../FoodList';
import { FoodSearch } from '../FoodSearch';
import { useLanguage } from '../../hooks/useLanguage';
import type { SelectedFood, Food, NutrientGoals, NutrientKey, TooltipMode } from '../../types';

interface FoodManagementProps {
  selectedFoods: SelectedFood[];
  selectedIds: Set<string>;
  onToggle: (food: Food) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onSaveMeal: () => void;
  onClear: () => void;
  totals: Partial<NutrientGoals>;
  goals: NutrientGoals;
  hasMeals?: boolean;
}

const MACRO_ROWS: { key: NutrientKey; color: string }[] = [
  { key: 'proteines', color: '#8B7BA8' },
  { key: 'glucides', color: '#5A7FA0' },
  { key: 'lipides', color: '#C47A5A' },
  { key: 'fibres', color: '#7B9B6E' },
];

export function FoodManagement({
  selectedFoods,
  selectedIds,
  onToggle,
  onUpdateQty,
  onRemove,
  onSaveMeal,
  onClear,
  totals,
  goals,
  hasMeals,
}: FoodManagementProps) {
  const { t } = useLanguage();
  const isDesktop = useIsDesktop();
  const [isMobileOverviewExpanded, setIsMobileOverviewExpanded] = useState(false);
  const [tooltipMode, setTooltipMode] = useLocalStorage<TooltipMode>(
    STORAGE_KEYS.tooltipMode,
    'off',
  );

  const showHint = !hasMeals && selectedFoods.length === 0;
  const calories = Math.round(totals.calories ?? 0);
  const caloriePct = goals.calories > 0 ? Math.min((calories / goals.calories) * 100, 100) : 0;

  if (!isDesktop) {
    return (
      <div>
        <section className={`card flex min-h-[calc(100dvh-6.5rem)] flex-col overflow-visible p-4 transition-all duration-500 ${showHint ? 'card-breathing' : ''}`}>
          <div className="shrink-0 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-raised)]/95 px-3.5 py-3 shadow-[var(--shadow-sm)]">
            <button
              type="button"
              aria-expanded={isMobileOverviewExpanded}
              onClick={() => setIsMobileOverviewExpanded((expanded) => !expanded)}
              className="flex w-full items-end justify-between gap-3 text-left"
            >
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
                  {t('analysis.overviewTitle')}
                </p>
                <p className="display-font mt-0.5 text-2xl font-semibold leading-none text-[var(--text-h)] tabular-nums">
                  {calories}
                  <span className="ml-1 text-xs font-medium text-[var(--text-muted)]">{t('common.kcal')}</span>
                </p>
              </div>
              <div className="flex shrink-0 items-center text-right">
                <ChevronDown
                  size={16}
                  className={`text-[var(--text-muted)] transition-transform duration-200 ${isMobileOverviewExpanded ? 'rotate-180' : ''}`}
                />
              </div>
            </button>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--warm-200)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
                style={{ width: `${caloriePct}%` }}
              />
            </div>
            {isMobileOverviewExpanded && (
              <div className="mt-3 grid gap-2">
                {MACRO_ROWS.map(({ key, color }) => {
                  const value = Math.round(((totals[key] ?? 0) as number) * 10) / 10;
                  const goal = goals[key] as number;
                  const pct = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
                  return (
                    <div key={key} className="grid gap-1">
                      <div className="flex items-center justify-between gap-2 text-[10px] leading-none">
                        <span className="font-medium text-[var(--text)]">{t(`nutrients.${key}.label`)}</span>
                        <span className="tabular-nums text-[var(--text-muted)]">
                          {value}g / {goal}g
                        </span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-[var(--warm-200)]">
                        <div
                          className="h-full rounded-full transition-[width] duration-500"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-3 shrink-0 overflow-visible">
            <FoodList
              items={selectedFoods}
              onUpdateQty={onUpdateQty}
              onRemove={onRemove}
              onSaveMeal={onSaveMeal}
              onClear={onClear}
            />
          </div>

          <div className="mt-3 min-h-0 flex-1 border-t border-[var(--border-soft)] pt-3">
            <FoodSearch
              selectedIds={selectedIds}
              onToggle={onToggle}
              tooltipMode={tooltipMode}
              onTooltipModeChange={setTooltipMode}
              fillAvailableHeight
            />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-2 gap-5" style={{ gridTemplateRows: 'auto minmax(0, 1fr)' }}>
      <div className="card p-5 flex flex-col min-h-0">
        <NutritionOverview totals={totals} goals={goals} foods={selectedFoods} />
      </div>
      <div className="card p-5 flex flex-col min-h-0">
        <FoodList
          items={selectedFoods}
          onUpdateQty={onUpdateQty}
          onRemove={onRemove}
          onSaveMeal={onSaveMeal}
          onClear={onClear}
        />
      </div>

      <div className={`col-span-2 card p-5 min-h-0 flex flex-col transition-all duration-500 ${showHint ? 'card-breathing' : ''}`}>
        <FoodSearch
          selectedIds={selectedIds}
          onToggle={onToggle}
          tooltipMode={tooltipMode}
          onTooltipModeChange={setTooltipMode}
        />
      </div>
    </div>
  );
}
