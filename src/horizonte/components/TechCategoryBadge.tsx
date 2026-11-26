import React from 'react';
import { Sparkles } from 'lucide-react';
import type { FactionTechStyle } from '../types/game';
import { TECH_CATEGORY_META } from '../utils/formatting';

export const TechCategoryBadge: React.FC<{
  category: FactionTechStyle;
  activeCategory?: FactionTechStyle;
  bonusText?: string;
  compact?: boolean;
}> = ({ category, activeCategory, bonusText, compact = false }) => {
  const meta = TECH_CATEGORY_META[category];
  if (!meta) return null;
  const isAffinity = Boolean(activeCategory && activeCategory === category);

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-semibold ${meta.badge} ${
        isAffinity ? 'ring-1 ring-amber-300/60 shadow-[0_0_8px_rgba(251,191,36,0.22)]' : ''
      }`}
      title={
        isAffinity
          ? `Afinidade Tecnológica Ativa (${meta.label}): ${bonusText ?? 'bônus de categoria aplicado'}`
          : `${meta.label}: ${meta.synergyHint}`
      }
    >
      {isAffinity && <Sparkles className="w-2.5 h-2.5 text-amber-300 shrink-0" />}
      <span>{compact ? meta.shortLabel : `Tec. ${meta.shortLabel}`}</span>
      {isAffinity && bonusText && (
        <span className="text-amber-200 font-mono-tabular">{bonusText}</span>
      )}
    </span>
  );
};
