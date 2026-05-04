import type { Insight } from '../types';

const pct = (val: number | undefined, goal: number) => ((val ?? 0) / goal) * 100;

export const INSIGHTS: Insight[] =[
  {
    condition: (t, g) => pct(t.fer, g.fer) < 40 && pct(t.calories, g.calories) > 30,
    icon: '🔴',
    type: 'warning',
    message: 'Fer insuffisant pour ce repas. Pense aux lentilles ou aux épinards avec un filet de citron (Vit C).',
  },
  {
    condition: (t, g) => pct(t.omega3, g.omega3) < 30 && pct(t.calories, g.calories) > 30,
    icon: '⚖️',
    type: 'warning',
    message: 'Manque d\'Oméga-3. Une cuillère de graines de lin ou de chia suffit à couvrir le repas.',
  },
  {
    condition: (t, g) => pct(t.proteines, g.proteines) < 50 && pct(t.calories, g.calories) > 40,
    icon: '💪',
    type: 'warning',
    message: 'Les protéines sont un peu basses. Ajouter du tofu, tempeh ou des légumineuses équilibrera le tout.',
  },
  {
    condition: (t, g) => pct(t.calcium, g.calcium) < 40 && pct(t.calories, g.calories) > 40,
    icon: '🦴',
    type: 'warning',
    message: 'Calcium faible. Un verre de lait végétal enrichi ou du chou kale fera l\'affaire.',
  },
  {
    condition: (t, g) => pct(t.fibres, g.fibres) >= 100,
    icon: '✅',
    type: 'success',
    message: 'Super apport en fibres ! Ton microbiote est ravi.',
  },
];