import type { Insight } from '../types';

const pct = (val: number | undefined, goal: number) =>
  ((val ?? 0) / goal) * 100;

export const INSIGHTS: Insight[] = [
  {
    condition: (t, g) => pct(t.vitB12, g.vitB12) === 0,
    icon: '⚠️',
    message: 'Aucune source de B12 dans ton assiette — ajoute de la levure maltée enrichie ou un lait végétal enrichi.',
  },
  {
    condition: (t, g) => pct(t.vitB12, g.vitB12) > 0 && pct(t.vitB12, g.vitB12) < 50,
    icon: '💊',
    message: 'Ta B12 est encore basse. Pense à une supplémentation directe en complément des aliments enrichis.',
  },
  {
    condition: (t, g) => pct(t.fer, g.fer) < 50,
    icon: '🔴',
    message: 'Fer insuffisant — associe tes sources de fer à de la vitamine C (citron, poivron) pour tripler l\'absorption.',
  },
  {
    condition: (t) =>
      (t.omega6 ?? 0) > 0 && (t.omega3 ?? 0) > 0 &&
      (t.omega6 ?? 0) / (t.omega3 ?? 1) > 5,
    icon: '⚖️',
    message: 'Ratio oméga-6/oméga-3 trop élevé — ajoute des graines de lin, de chia ou de l\'huile de colza.',
  },
  {
    condition: (t, g) => pct(t.proteines, g.proteines) < 60,
    icon: '💪',
    message: 'Protéines insuffisantes — combine légumineuses + céréales pour des protéines complètes.',
  },
  {
    condition: (t, g) => pct(t.calcium, g.calcium) < 50,
    icon: '🦴',
    message: 'Calcium faible — chou kale, brocoli, lait végétal enrichi ou tofu coagulé au calcium sont tes meilleurs alliés.',
  },
  {
    condition: (t, g) => pct(t.iode, g.iode) < 30,
    icon: '🌿',
    message: 'Iode très bas — pense au sel iodé ou à un lait végétal enrichi en iode.',
  },
  {
    condition: (t, g) => pct(t.vitD, g.vitD) < 20,
    icon: '☀️',
    message: 'Vitamine D quasi absente — une supplémentation est souvent indispensable, surtout en hiver.',
  },
  {
    condition: (t, g) => pct(t.fibres, g.fibres) >= 100,
    icon: '✅',
    message: 'Excellent apport en fibres ! Ton microbiote te remercie.',
  },
  {
    condition: (t, g) => pct(t.selenium, g.selenium) < 30,
    icon: '🌰',
    message: 'Sélénium bas — 1 à 2 noix du Brésil par jour couvrent largement le besoin quotidien.',
  },
];