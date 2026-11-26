import React from 'react';
import type { NarrativeEventDef } from '../types/game';
import { PRE_GENERATED_EVENT_IMAGES } from '../data/eventImages';

interface EventIllustrationProps {
  eventId: number;
  title: string;
  visualMotif: NarrativeEventDef['visualMotif'];
  accentColor: string;
  starColor: string;
  customImageSrc?: string;
  outcomeTone?: 'sucesso' | 'parcial' | 'fracasso';
}

const MOTIF_FALLBACK_IMAGES: Record<NarrativeEventDef['visualMotif'], string> = {
  buraco_minhoca: '/src/assets/images/event_05_wormhole_1795553904903.jpg',
  anomalia: '/src/assets/images/event_01_past_1795553901812.jpg',
  criatura: '/src/assets/images/event_13_space_whale_1795554676341.jpg',
  piratas: '/src/assets/images/event_41_pirate_ambush_1795553966599.jpg',
  diplomacia: '/src/assets/images/event_34_mediation_1795554964066.jpg',
  ruinas: '/src/assets/images/event_61_buried_ruins_1795553965876.jpg',
  mina: '/src/assets/images/event_73_living_vein_1795553966774.jpg',
  mercado: '/src/assets/images/event_102_market_barter_1795553969594.jpg',
  acampamento: '/src/assets/images/event_68_nomads_1795558718491.jpg',
  tripulacao: '/src/assets/images/event_21_bridge_mutiny_1795554680549.jpg',
  tecnologia: '/src/assets/images/event_51_awakened_ai_1795558490659.jpg',
  orbita: '/src/assets/images/event_37_orbital_battle_1795554980346.jpg',
};

const OUTCOME_BADGES: Record<
  NonNullable<EventIllustrationProps['outcomeTone']>,
  { label: string; className: string }
> = {
  sucesso: {
    label: 'Sucesso da Exploração',
    className: 'bg-emerald-950/85 border-emerald-400/60 text-emerald-200',
  },
  parcial: {
    label: 'Sobrevivência com Riscos',
    className: 'bg-amber-950/85 border-amber-400/60 text-amber-200',
  },
  fracasso: {
    label: 'Fracasso na Expedição',
    className: 'bg-rose-950/85 border-rose-400/60 text-rose-200',
  },
};

export const EventIllustration: React.FC<EventIllustrationProps> = ({
  eventId,
  title,
  visualMotif,
  accentColor,
  customImageSrc,
  outcomeTone,
}) => {
  const imagePath = customImageSrc ?? PRE_GENERATED_EVENT_IMAGES[eventId] ?? MOTIF_FALLBACK_IMAGES[visualMotif];
  const badge = outcomeTone ? OUTCOME_BADGES[outcomeTone] : null;

  return (
    <div
      className="relative w-full aspect-[16/9] max-h-[240px] rounded-xl overflow-hidden border border-slate-700/80 bg-[#050914] shadow-inner"
      style={{
        backgroundImage: `radial-gradient(circle at 65% 35%, ${accentColor}33, #050914 78%)`,
      }}
    >
      <img
        src={imagePath}
        alt={title}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover"
      />
      {badge && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex justify-end">
          <span className={`px-2.5 py-0.5 rounded-md border text-[11px] font-semibold backdrop-blur-sm ${badge.className}`}>
            {badge.label}
          </span>
        </div>
      )}
    </div>
  );
};
