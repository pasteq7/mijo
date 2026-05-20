import { Settings, Leaf, Sun, Snowflake, Flower2, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Season } from '../../types';
import type { Theme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';

const EnFlag = () => (
  <svg viewBox="0 0 30 30" className="w-5 h-5 rounded-full overflow-hidden shadow-sm border border-stone-200/50">
    <clipPath id="circle-clip-en">
      <circle cx="15" cy="15" r="15" />
    </clipPath>
    <g clipPath="url(#circle-clip-en)">
      <rect width="30" height="30" fill="#012169"/>
      <path d="M-5 -5 L35 35 M35 -5 L-5 35" stroke="#fff" strokeWidth="3.5"/>
      <path d="M-5 -5 L35 35 M35 -5 L-5 35" stroke="#C8102E" strokeWidth="2.2"/>
      <path d="M15 -5 V35 M-5 15 H35" stroke="#fff" strokeWidth="6"/>
      <path d="M15 -5 V35 M-5 15 H35" stroke="#C8102E" strokeWidth="3.6"/>
    </g>
  </svg>
);

const FrFlag = () => (
  <svg viewBox="0 0 30 30" className="w-5 h-5 rounded-full overflow-hidden shadow-sm border border-stone-200/50">
    <clipPath id="circle-clip-fr">
      <circle cx="15" cy="15" r="15" />
    </clipPath>
    <g clipPath="url(#circle-clip-fr)">
      <rect width="10" height="30" fill="#002395" />
      <rect x="10" width="10" height="30" fill="#FFF" />
      <rect x="20" width="10" height="30" fill="#ED2939" />
    </g>
  </svg>
);

interface UtilityRailProps {
  onOpenGoals: () => void;
  onResetFoods: () => void;
  hasFoods: boolean;
  currentSeason: Season;
  theme: Theme;
  onToggleTheme: () => void;
  dayValidated?: boolean;
}

export function UtilityRail({ onOpenGoals, currentSeason, theme, onToggleTheme }: UtilityRailProps) {
  const { language, setLanguage, t } = useLanguage();

  const seasonConfig: Record<Season, { icon: typeof Leaf; label: string; color: string; softColor: string }> = {
    printemps: { icon: Flower2, label: t('seasons.printemps'), color: 'var(--accent)', softColor: 'var(--accent-soft)' },
    ete: { icon: Sun, label: t('seasons.ete'), color: 'var(--highlight)', softColor: 'var(--highlight-soft)' },
    automne: { icon: Leaf, label: t('seasons.automne'), color: 'var(--action)', softColor: 'var(--action-soft)' },
    hiver: { icon: Snowflake, label: t('seasons.hiver'), color: 'var(--info)', softColor: 'var(--info-soft)' },
  };

  const themeLabels: Record<Theme, string> = {
    washi: t('themes.washi'),
    suna: t('themes.suna'),
    matcha: t('themes.matcha'),
    sora: t('themes.sora'),
    sumi: t('themes.sumi'),
  };

  return (
    <aside className="w-16 lg:w-20 h-full flex flex-col items-center py-8 bg-transparent z-50">
      <div className="mb-10 text-[var(--accent)]">
        <Leaf size={24} strokeWidth={1.5} />
      </div>

      <div className="flex-1 flex flex-col gap-5 items-center">
        <button
          onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
          className="p-2.5 rounded-full hover:bg-[var(--warm-200)] hover:scale-105 active:scale-95 transition-all relative flex items-center justify-center shadow-none hover:shadow-sm"
          title={t('utilityRail.toggleLanguage')}
        >
          <motion.span
            key={language}
            initial={{ rotate: -120, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="block select-none"
          >
            {language === 'fr' ? <FrFlag /> : <EnFlag />}
          </motion.span>
        </button>

        <button
          onClick={onToggleTheme}
          className="p-3 rounded-full text-[var(--text)] hover:text-[var(--highlight)] hover:bg-[var(--warm-200)] transition-all"
          title={themeLabels[theme]}
        >
          <motion.span
            key={theme}
            initial={{ rotate: -90, scale: 0.6 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="block"
          >
            <Palette size={18} strokeWidth={1.5} />
          </motion.span>
        </button>

        <button
          onClick={onOpenGoals}
          className="p-3 rounded-full text-[var(--text)] hover:text-[var(--text-h)] hover:bg-[var(--warm-200)] transition-all"
          title={t('goalsModal.title')}
        >
          <Settings size={18} strokeWidth={1.5} />
        </button>
      </div>

      {(() => {
        const cfg = seasonConfig[currentSeason];
        const Icon = cfg.icon;
        return (
          <div className="relative flex flex-col items-center mt-auto pb-2" title={cfg.label}>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.15]">
              <Icon size={56} strokeWidth={1} style={{ color: cfg.color }} />
            </div>
            <div className="relative flex flex-col items-center gap-2 py-5" style={{ color: cfg.color }}>
              {cfg.label.toUpperCase().split('').map((char, i) => (
                <span key={i} className="text-[13px] leading-none tracking-widest" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}>
                  {char}
                </span>
              ))}
            </div>
          </div>
        );
      })()}
    </aside>
  );
}

