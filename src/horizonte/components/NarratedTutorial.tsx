import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Volume2, VolumeX, Play, Pause, SkipForward, Sparkles } from 'lucide-react';
import { isMobileDevice, mobileLandscapeScale } from '../utils/mobileLandscape';

export const TUTORIAL_AUDIO_SRC =
  '/assets/aistudio/ElevenLabs_2026-11-25T23_47_30_Rafael_Irala_pvc_sp120_s100_sb100_se100_b_m2_b4e16a38.mp3';

export type TutorialPlanetTab =
  | 'depositos'
  | 'descida'
  | 'atmosfera'
  | 'solo'
  | 'comercio_estaleiro'
  | 'conversar';

export type TutorialShipTab =
  | 'nave'
  | 'personagem'
  | 'tripulacao'
  | 'compartimento'
  | 'frota'
  | 'cofre';

export type TutorialWarTab = 'all' | 'mine' | 'cronicas';

export type TutorialCodexTab =
  | 'faccoes'
  | 'especies'
  | 'vidas'
  | 'criaturas'
  | 'planetas'
  | 'itens'
  | 'habilidades'
  | 'diario';

export interface TutorialUiSyncState {
  seq: number;
  drawerKind?: 'none' | 'planet' | 'ship' | 'war' | 'codex';
  planetId?: string;
  planetTab?: TutorialPlanetTab;
  planetMarketMode?: 'comercio' | 'estaleiro';
  planetInfoCollapsed?: boolean;
  shipTab?: TutorialShipTab;
  warTab?: TutorialWarTab;
  codexTab?: TutorialCodexTab;
  galacticMapOpen?: boolean;
  mapFiltersOpen?: boolean;
}

interface ScrollMotion {
  scrollId: string;
  startTime: number;
  endTime: number;
  fromRatio: number;
  toRatio: number;
}

interface TimelineStep {
  time: number;
  targetId: string | null;
  sectionLabel: string;
  subtitle: string;
  ui?: Omit<TutorialUiSyncState, 'seq'> & { useDemoPlanet?: boolean; useCapitalPlanet?: boolean };
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    time: 0,
    targetId: null,
    sectionLabel: 'Introdução',
    subtitle: 'Guia de exploração. Bem-vindo a Horizonte Estelar!',
    ui: {
      drawerKind: 'none',
      galacticMapOpen: false,
      mapFiltersOpen: false,
    },
  },
  {
    time: 10.8,
    targetId: null,
    sectionLabel: 'Introdução',
    subtitle:
      'Este guia vai apresentar apenas os conceitos básicos para você começar sua jornada. Explore os menus e investigue os sistemas!',
  },
  {
    time: 23.8,
    targetId: 'left-planets-list',
    sectionLabel: '1. Explorando planetas',
    subtitle: '1. Explorando planetas — Clique sobre um planeta no painel localizado à esquerda da tela.',
    ui: {
      drawerKind: 'none',
      galacticMapOpen: false,
    },
  },
  {
    time: 27.2,
    targetId: 'left-planet-demo',
    sectionLabel: '1. Explorando planetas',
    subtitle: 'Selecionando um planeta na lista lateral...',
  },
  {
    time: 30.8,
    targetId: 'planet-info-card',
    sectionLabel: '1. Explorando planetas',
    subtitle: 'Isso exibirá informações básicas sobre ele no painel planetário, à direita.',
    ui: {
      drawerKind: 'planet',
      useDemoPlanet: true,
      planetTab: 'depositos',
      planetInfoCollapsed: false,
    },
  },
  {
    time: 36.2,
    targetId: 'planet-travel-btn',
    sectionLabel: '1. Explorando planetas',
    subtitle: 'Se ainda não estiver em órbita do planeta selecionado, clique em Viajar para órbita.',
  },
  {
    time: 41.8,
    targetId: 'planet-scan-btn',
    sectionLabel: '1. Explorando planetas',
    subtitle: 'Quando chegar ao destino, você poderá escanear o planeta para obter informações detalhadas.',
  },
  {
    time: 45.2,
    targetId: 'planet-body-area',
    sectionLabel: '1. Explorando planetas',
    subtitle: 'Veja suas características, recursos, condições ambientais e atividades disponíveis.',
    ui: {
      drawerKind: 'planet',
      useCapitalPlanet: true,
      planetTab: 'depositos',
      planetInfoCollapsed: false,
    },
  },
  {
    time: 51.0,
    targetId: 'planet-level-badge',
    sectionLabel: '2. Comércio e estaleiros',
    subtitle: '2. Comércio e estaleiros — Planetas de nível 3, 4 ou 5 possuem civilizações avançadas.',
    ui: {
      drawerKind: 'planet',
      useCapitalPlanet: true,
      planetTab: 'depositos',
      planetInfoCollapsed: false,
    },
  },
  {
    time: 60.0,
    targetId: 'planet-tab-comercio_estaleiro',
    sectionLabel: '2. Comércio e estaleiros',
    subtitle: 'Acesse as opções Comercializar e Estaleiro para explorar as oportunidades disponíveis.',
  },
  {
    time: 64.2,
    targetId: 'planet-market-tab',
    sectionLabel: '2. Comércio e estaleiros',
    subtitle: 'No comércio, percorra a lista de itens e equipamentos disponíveis para compra e venda.',
    ui: {
      drawerKind: 'planet',
      useCapitalPlanet: true,
      planetTab: 'comercio_estaleiro',
      planetMarketMode: 'comercio',
      planetInfoCollapsed: true,
    },
  },
  {
    time: 69.8,
    targetId: 'planet-shipyard-tab',
    sectionLabel: '2. Comércio e estaleiros',
    subtitle: 'Já no estaleiro, poderá conhecer e adquirir novas naves para sua jornada.',
    ui: {
      drawerKind: 'planet',
      useCapitalPlanet: true,
      planetTab: 'comercio_estaleiro',
      planetMarketMode: 'estaleiro',
      planetInfoCollapsed: true,
    },
  },
  {
    time: 74.2,
    targetId: 'planet-tab-conversar',
    sectionLabel: '2. Comércio e estaleiros',
    subtitle: 'Você também poderá conversar com os habitantes, aceitar missões e contratar tripulantes.',
  },
  {
    time: 76.2,
    targetId: 'planet-body-area',
    sectionLabel: '2. Comércio e estaleiros',
    subtitle: 'Missões disponíveis e candidatos à tripulação no planeta.',
    ui: {
      drawerKind: 'planet',
      useCapitalPlanet: true,
      planetTab: 'conversar',
      planetInfoCollapsed: true,
    },
  },
  {
    time: 81.4,
    targetId: 'planet-tab-descida',
    sectionLabel: '3. Expedições planetárias',
    subtitle: '3. Expedições e exploração planetária — Nem toda exploração acontece a bordo da sua nave.',
    ui: {
      drawerKind: 'planet',
      useCapitalPlanet: true,
      planetTab: 'descida',
      planetInfoCollapsed: false,
    },
  },
  {
    time: 86.5,
    targetId: 'planet-body-area',
    sectionLabel: '3. Expedições planetárias',
    subtitle: 'Organize expedições até a superfície e explore o ambiente do planeta.',
  },
  {
    time: 90.6,
    targetId: 'planet-tab-atmosfera',
    sectionLabel: '3. Expedições planetárias',
    subtitle: 'Extraia recursos da atmosfera do planeta.',
    ui: {
      drawerKind: 'planet',
      useCapitalPlanet: true,
      planetTab: 'atmosfera',
      planetInfoCollapsed: false,
    },
  },
  {
    time: 93.4,
    targetId: 'planet-tab-solo',
    sectionLabel: '3. Expedições planetárias',
    subtitle: 'Ou colete materiais diretamente do solo. Cada atividade exige os equipamentos adequados!',
    ui: {
      drawerKind: 'planet',
      useCapitalPlanet: true,
      planetTab: 'solo',
      planetInfoCollapsed: false,
    },
  },
  {
    time: 102.0,
    targetId: 'hud-btn-ship',
    sectionLabel: '4. Nave e tripulação',
    subtitle: '4. Nave e tripulação — Ferramentas necessárias para administrar sua jornada.',
  },
  {
    time: 109.5,
    targetId: 'ship-tab-nave',
    sectionLabel: '4. Nave e tripulação',
    subtitle: 'Consulte a situação e as condições da sua nave.',
    ui: {
      drawerKind: 'ship',
      shipTab: 'nave',
    },
  },
  {
    time: 114.2,
    targetId: 'ship-tab-tripulacao',
    sectionLabel: '4. Nave e tripulação',
    subtitle: 'Visualize e gerencie seus tripulantes.',
    ui: {
      drawerKind: 'ship',
      shipTab: 'tripulacao',
    },
  },
  {
    time: 117.2,
    targetId: 'ship-tab-personagem',
    sectionLabel: '4. Nave e tripulação',
    subtitle: 'Desenvolva suas habilidades como comandante.',
    ui: {
      drawerKind: 'ship',
      shipTab: 'personagem',
    },
  },
  {
    time: 120.2,
    targetId: 'ship-tab-compartimento',
    sectionLabel: '4. Nave e tripulação',
    subtitle: 'Utilize itens e equipamentos para resistir às condições extremas do espaço.',
    ui: {
      drawerKind: 'ship',
      shipTab: 'compartimento',
    },
  },
  {
    time: 129.8,
    targetId: 'hud-btn-war',
    sectionLabel: '5. Guerra Galáctica',
    subtitle: '5. Guerra Galáctica — Nem todas as disputas são resolvidas pacificamente.',
  },
  {
    time: 136.8,
    targetId: 'war-tab-all',
    sectionLabel: '5. Guerra Galáctica',
    subtitle: 'Acompanhe a situação militar das diferentes facções e o equilíbrio de poder.',
    ui: {
      drawerKind: 'war',
      warTab: 'all',
    },
  },
  {
    time: 145.0,
    targetId: 'war-tab-cronicas',
    sectionLabel: '5. Guerra Galáctica',
    subtitle: 'Fique atento: as ações das facções influenciam o desenvolvimento da galáxia.',
    ui: {
      drawerKind: 'war',
      warTab: 'cronicas',
    },
  },
  {
    time: 150.0,
    targetId: 'hud-btn-codex',
    sectionLabel: '6. Codex',
    subtitle: '6. Codex — Consulte informações sobre o universo do jogo e descubra detalhes.',
  },
  {
    time: 154.0,
    targetId: 'codex-tab-faccoes',
    sectionLabel: '6. Codex',
    subtitle: 'Explore facções, espécies, planetas, equipamentos e habilidades no Codex.',
    ui: {
      drawerKind: 'codex',
      codexTab: 'faccoes',
    },
  },
  {
    time: 158.2,
    targetId: 'codex-btn-tutorial',
    sectionLabel: '6. Codex',
    subtitle: 'Encontre dicas e tutoriais que podem ajudar durante sua jornada.',
  },
  {
    time: 161.2,
    targetId: 'codex-tab-criaturas',
    sectionLabel: '6. Codex',
    subtitle: 'Consulte informações no Codex sempre que encontrar algo desconhecido.',
    ui: {
      drawerKind: 'codex',
      codexTab: 'criaturas',
    },
  },
  {
    time: 166.0,
    targetId: 'hud-btn-map',
    sectionLabel: '7. Mapa Galáctico',
    subtitle: '7. Mapa Galáctico — Visualize os sistemas solares conhecidos e explore regiões do universo.',
    ui: {
      drawerKind: 'none',
      galacticMapOpen: false,
    },
  },
  {
    time: 170.6,
    targetId: 'map-system-card',
    sectionLabel: '7. Mapa Galáctico',
    subtitle: 'Explore sistemas solares conhecidos e diferentes regiões da galáxia.',
    ui: {
      drawerKind: 'none',
      galacticMapOpen: true,
      mapFiltersOpen: false,
    },
  },
  {
    time: 175.0,
    targetId: 'map-btn-filters',
    sectionLabel: '7. Mapa Galáctico',
    subtitle: 'Utilize filtros para localizar informações importantes.',
  },
  {
    time: 177.2,
    targetId: 'map-filters-panel',
    sectionLabel: '7. Mapa Galáctico',
    subtitle: 'Filtre sistemas por missões, facções e outros elementos.',
    ui: {
      drawerKind: 'none',
      galacticMapOpen: true,
      mapFiltersOpen: true,
    },
  },
  {
    time: 181.2,
    targetId: 'map-filter-only-mission',
    sectionLabel: '7. Mapa Galáctico',
    subtitle: 'Encontre oportunidades de exploração e acompanhe o que acontece pela galáxia.',
  },
  {
    time: 186.8,
    targetId: null,
    sectionLabel: 'Sua jornada está começando!',
    subtitle: 'Este foi apenas o básico do básico. Explore os menus e teste novas possibilidades!',
    ui: {
      drawerKind: 'none',
      galacticMapOpen: false,
      mapFiltersOpen: false,
    },
  },
  {
    time: 205.0,
    targetId: null,
    sectionLabel: 'Boa jornada!',
    subtitle: 'O universo é vasto, comandante. Boa jornada em Horizonte Estelar!',
  },
];

const SCROLL_MOTIONS: ScrollMotion[] = [
  // Seção 1: Características e depósitos do planeta
  { scrollId: 'planet-body', startTime: 45.6, endTime: 49.0, fromRatio: 0, toRatio: 0.45 },
  { scrollId: 'planet-body', startTime: 49.2, endTime: 50.8, fromRatio: 0.45, toRatio: 0 },
  // Seção 2: Mercado & Comércio scroll
  { scrollId: 'planet-body', startTime: 65.5, endTime: 69.3, fromRatio: 0, toRatio: 0.55 },
  // Seção 2: Estaleiro scroll
  { scrollId: 'planet-body', startTime: 70.6, endTime: 74.0, fromRatio: 0, toRatio: 0.5 },
  // Seção 2: Conversar (Missões & Tripulação) scroll
  { scrollId: 'planet-body', startTime: 77.0, endTime: 81.0, fromRatio: 0, toRatio: 0.72 },
  // Seção 3: Exploração em solo & Solo scroll
  { scrollId: 'planet-body', startTime: 86.2, endTime: 90.0, fromRatio: 0, toRatio: 0.5 },
  { scrollId: 'planet-body', startTime: 95.0, endTime: 101.2, fromRatio: 0, toRatio: 0.55 },
  // Seção 4: Nave & Tripulação scrolls
  { scrollId: 'ship-body', startTime: 110.8, endTime: 114.0, fromRatio: 0, toRatio: 0.5 },
  { scrollId: 'ship-body', startTime: 115.0, endTime: 117.0, fromRatio: 0, toRatio: 0.35 },
  { scrollId: 'ship-body', startTime: 117.8, endTime: 120.0, fromRatio: 0, toRatio: 0.5 },
  { scrollId: 'ship-body', startTime: 121.0, endTime: 128.5, fromRatio: 0, toRatio: 0.55 },
  // Seção 5: Guerra Galáctica scroll
  { scrollId: 'war-body', startTime: 137.5, endTime: 144.2, fromRatio: 0, toRatio: 0.7 },
  { scrollId: 'war-body', startTime: 145.6, endTime: 149.2, fromRatio: 0, toRatio: 0.4 },
  // Seção 6: Codex scroll
  { scrollId: 'codex-body', startTime: 154.6, endTime: 158.0, fromRatio: 0, toRatio: 0.45 },
  { scrollId: 'codex-body', startTime: 162.0, endTime: 165.6, fromRatio: 0, toRatio: 0.35 },
  // Seção 7: Mapa Galáctico Filtros scroll
  { scrollId: 'map-filters-body', startTime: 178.0, endTime: 183.0, fromRatio: 0, toRatio: 0.9 },
  { scrollId: 'map-filters-body', startTime: 183.2, endTime: 186.2, fromRatio: 0.9, toRatio: 0 },
];

function easeInOutQuad(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
}

function formatTimeMMSS(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(m).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
}

interface TutorialViewportEnv {
  isMobile: boolean;
  isPortrait: boolean;
  isLandscapeMobile: boolean;
  vw: number;
  vh: number;
}

function detectTutorialEnv(): TutorialViewportEnv {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isPortrait: false,
      isLandscapeMobile: false,
      vw: 1280,
      vh: 800,
    };
  }
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isMobile = isMobileDevice();
  const isPortrait = isMobile && vw <= vh;
  const isLandscapeMobile = isMobile && vw > vh && mobileLandscapeScale(vw, vh) < 0.999;
  return { isMobile, isPortrait, isLandscapeMobile, vw, vh };
}

function ensureTargetVisibleInScrollParents(
  targetEl: HTMLElement,
  activeMotionScrollIds: Set<string>
) {
  let parent = targetEl.parentElement;
  while (parent && parent !== document.body && parent !== document.documentElement) {
    const style = window.getComputedStyle(parent);
    const tutorialScrollId = parent.getAttribute('data-tutorial-scroll');
    const pRect = parent.getBoundingClientRect();
    const scaleX = parent.offsetWidth > 0 ? pRect.width / parent.offsetWidth : 1;
    const scaleY = parent.offsetHeight > 0 ? pRect.height / parent.offsetHeight : 1;

    // Scroll horizontally if target sits outside a horizontally scrollable ancestor (e.g. mobile portrait header)
    if (
      (style.overflowX === 'auto' || style.overflowX === 'scroll') &&
      parent.scrollWidth > parent.clientWidth + 2
    ) {
      const tRect = targetEl.getBoundingClientRect();
      const pad = 16 * scaleX;
      if (tRect.left < pRect.left + pad || tRect.right > pRect.right - pad) {
        const deltaCss = (tRect.left + tRect.width / 2 - (pRect.left + pRect.width / 2)) / Math.max(0.1, scaleX);
        parent.scrollLeft = Math.max(
          0,
          Math.min(parent.scrollWidth - parent.clientWidth, parent.scrollLeft + deltaCss)
        );
      }
    }

    // Scroll vertically if target sits outside a vertically scrollable ancestor not currently animated by SCROLL_MOTIONS
    const motionControlled = Boolean(tutorialScrollId && activeMotionScrollIds.has(tutorialScrollId));
    if (
      !motionControlled &&
      (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
      parent.scrollHeight > parent.clientHeight + 2
    ) {
      const tRect = targetEl.getBoundingClientRect();
      const pad = 12 * scaleY;
      if (tRect.top < pRect.top + pad || tRect.bottom > pRect.bottom - pad) {
        const deltaCss = (tRect.top + tRect.height / 2 - (pRect.top + pRect.height / 2)) / Math.max(0.1, scaleY);
        parent.scrollTop = Math.max(
          0,
          Math.min(parent.scrollHeight - parent.clientHeight, parent.scrollTop + deltaCss)
        );
      }
    }

    parent = parent.parentElement;
  }
}

function computeArrowPlacement(
  rect: DOMRect,
  env: TutorialViewportEnv,
  arrowSize: number
): { tipX: number; tipY: number; angle: number } {
  const { vw, vh, isMobile, isPortrait, isLandscapeMobile } = env;
  const margin = arrowSize + 8;
  const bottomSafe = isMobile ? (isLandscapeMobile ? 76 : 112) : 112;
  const availBottom = Math.max(margin + 20, vh - bottomSafe);
  const topThreshold = isLandscapeMobile ? 48 : 76;

  // 1. Target near top edge -> point UP from below its bottom edge
  if (rect.top < topThreshold) {
    const tipX = Math.max(24, Math.min(vw - 24, rect.left + rect.width * 0.5));
    const tipY = Math.max(12, Math.min(availBottom - margin, rect.bottom + 2));
    return { tipX, tipY, angle: 45 };
  }

  // 2. Target near bottom / subtitle bar -> point DOWN from above its top edge
  if (rect.bottom > availBottom - 16 && rect.top > margin) {
    const tipX = Math.max(24, Math.min(vw - 24, rect.left + rect.width * 0.5));
    const tipY = Math.max(margin, Math.min(availBottom, rect.top - 2));
    return { tipX, tipY, angle: -135 };
  }

  // 3. Mobile portrait wide containers / full-width drawer elements
  if (isMobile && isPortrait && rect.width > vw * 0.65) {
    const tipX = Math.max(24, Math.min(vw - 24, rect.left + rect.width * 0.5));
    if (rect.height > vh * 0.35) {
      const tipY = Math.max(20, Math.min(availBottom - margin, rect.top + Math.min(rect.height * 0.25, 34)));
      return { tipX, tipY, angle: 45 };
    }
    if (rect.bottom + margin < availBottom) {
      return { tipX, tipY: rect.bottom + 2, angle: 45 };
    }
    return { tipX, tipY: Math.max(margin, rect.top - 2), angle: -135 };
  }

  // 4. Right-half target -> point RIGHT from its left edge if there is horizontal room
  if (rect.left > vw * 0.52) {
    if (rect.left > margin) {
      const tipX = Math.max(margin, rect.left + 4);
      const tipY = Math.max(24, Math.min(availBottom - 16, rect.top + Math.min(rect.height * 0.45, 22)));
      return { tipX, tipY, angle: 135 };
    }
    const tipX = Math.max(24, Math.min(vw - 24, rect.left + rect.width * 0.5));
    if (rect.bottom + margin < availBottom) {
      return { tipX, tipY: rect.bottom + 2, angle: 45 };
    }
    return { tipX, tipY: Math.max(margin, rect.top - 2), angle: -135 };
  }

  // 5. Left/center target -> point UP-LEFT onto its right edge
  const tipX = Math.max(20, Math.min(vw - margin, rect.right - Math.min(10, rect.width * 0.18)));
  const tipY = Math.max(20, Math.min(availBottom - margin, rect.top + Math.min(rect.height * 0.45, 22)));
  return { tipX, tipY, angle: 0 };
}

export const NarratedTutorialPromptModal: React.FC<{
  onAccept: () => void;
  onDecline: () => void;
}> = ({ onAccept, onDecline }) => {
  const modal = (
    <div className="fixed inset-0 z-[95] bg-black/92 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-2xl border border-yellow-400/50 bg-[#070b14] p-5 sm:p-6 shadow-[0_0_50px_rgba(0,0,0,0.95)] text-center space-y-4 sm:space-y-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-yellow-400/40 bg-yellow-400/10 text-yellow-300 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          GUIA DE EXPLORAÇÃO
        </div>

        <h2 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
          Você deseja ver o tutorial narrado?
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Um tour automático com narração em áudio mostrará os principais botões, painéis e menus de Horizonte Estelar.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={onDecline}
            className="py-2.5 sm:py-3 px-4 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm cursor-pointer transition-colors"
          >
            Não
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="py-2.5 sm:py-3 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-display font-bold text-sm cursor-pointer transition-colors shadow-[0_0_20px_rgba(250,204,21,0.45)]"
          >
            Sim
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modal, document.body);
  }
  return modal;
};

interface NarratedTutorialControllerProps {
  demoPlanetId: string;
  capitalPlanetId: string;
  onSyncUi: (sync: TutorialUiSyncState) => void;
  onFinish: (completed: boolean) => void;
}

export const NarratedTutorialController: React.FC<NarratedTutorialControllerProps> = ({
  demoPlanetId,
  capitalPlanetId,
  onSyncUi,
  onFinish,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const arrowWrapRef = useRef<HTMLDivElement | null>(null);
  const arrowRotateRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const lastStepIdxRef = useRef<number>(-1);
  const scrolledTargetKeyRef = useRef<string>('');
  const seqRef = useRef<number>(1);
  const arrowPosRef = useRef<{ x: number; y: number; visible: boolean }>({
    x: typeof window !== 'undefined' ? window.innerWidth * 0.5 : 400,
    y: typeof window !== 'undefined' ? window.innerHeight * 0.5 : 300,
    visible: false,
  });

  const [paused, setPaused] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(215);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [env, setEnv] = useState<TutorialViewportEnv>(() => detectTutorialEnv());
  const envRef = useRef<TutorialViewportEnv>(env);
  envRef.current = env;

  useEffect(() => {
    const updateEnv = () => setEnv(detectTutorialEnv());
    updateEnv();
    window.addEventListener('resize', updateEnv);
    window.addEventListener('orientationchange', updateEnv);
    const vv = window.visualViewport;
    vv?.addEventListener('resize', updateEnv);
    return () => {
      window.removeEventListener('resize', updateEnv);
      window.removeEventListener('orientationchange', updateEnv);
      vv?.removeEventListener('resize', updateEnv);
    };
  }, []);

  const step = useMemo(() => TIMELINE_STEPS[activeStepIdx] ?? TIMELINE_STEPS[0], [activeStepIdx]);
  const arrowSize = env.isLandscapeMobile ? 30 : env.isMobile ? 38 : 46;
  const tipOffsetX = (5 / 46) * arrowSize;
  const tipOffsetY = (4 / 46) * arrowSize;

  // Start playback right when controller mounts (mounted inside user click handler of "Sim")
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        setPaused(true);
      });
    }
    return () => {
      audio.pause();
    };
  }, []);

  // Main 60fps animation frame loop syncing steps, smooth scrollbars & neon yellow arrow
  useEffect(() => {
    let rafId = 0;

    const tick = () => {
      const audio = audioRef.current;
      const t = audio ? audio.currentTime : 0;
      const curEnv = envRef.current;
      const curArrowSize = curEnv.isLandscapeMobile ? 30 : curEnv.isMobile ? 38 : 46;

      // 1. Find current timeline step
      let idx = 0;
      for (let i = TIMELINE_STEPS.length - 1; i >= 0; i--) {
        if (t >= TIMELINE_STEPS[i].time) {
          idx = i;
          break;
        }
      }

      if (idx !== lastStepIdxRef.current) {
        lastStepIdxRef.current = idx;
        scrolledTargetKeyRef.current = '';
        setActiveStepIdx(idx);

        const st = TIMELINE_STEPS[idx];
        if (st.ui) {
          const { useDemoPlanet, useCapitalPlanet, ...restUi } = st.ui;
          const resolvedPlanetId = useDemoPlanet
            ? demoPlanetId
            : useCapitalPlanet
              ? capitalPlanetId
              : restUi.planetId;
          seqRef.current += 1;
          onSyncUi({
            seq: seqRef.current,
            ...restUi,
            ...(resolvedPlanetId ? { planetId: resolvedPlanetId } : {}),
          });
        }
      }

      // 2. Smoothly animate any active scroll motion for current audio timestamp
      const activeScrollIds = new Set<string>();
      for (const sm of SCROLL_MOTIONS) {
        if (t >= sm.startTime && t <= sm.endTime + 0.08) {
          activeScrollIds.add(sm.scrollId);
          const el = document.querySelector<HTMLElement>(`[data-tutorial-scroll="${sm.scrollId}"]`);
          if (el) {
            const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
            if (maxScroll > 0) {
              const p = easeInOutQuad((t - sm.startTime) / Math.max(0.05, sm.endTime - sm.startTime));
              const ratio = sm.fromRatio + (sm.toRatio - sm.fromRatio) * p;
              el.scrollTop = maxScroll * ratio;
            }
          }
        }
      }

      // 3. Position neon yellow target ring & blinking arrow smoothly over target element
      // Note: ringEl & arrowEl live in document.body via createPortal, matching getBoundingClientRect() 1:1 on both desktop & mobile.
      const currentTargetId = TIMELINE_STEPS[idx]?.targetId ?? null;
      const targetEl = currentTargetId
        ? document.querySelector<HTMLElement>(`[data-tutorial-id="${currentTargetId}"]`)
        : null;

      const arrowEl = arrowWrapRef.current;
      const arrowRotateEl = arrowRotateRef.current;
      const ringEl = ringRef.current;

      if (targetEl && arrowEl && ringEl) {
        let rect = targetEl.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const stepKey = `${idx}:${currentTargetId}`;
          if (scrolledTargetKeyRef.current !== stepKey) {
            scrolledTargetKeyRef.current = stepKey;
            ensureTargetVisibleInScrollParents(targetEl, activeScrollIds);
            rect = targetEl.getBoundingClientRect();
          }

          const pad = curEnv.isLandscapeMobile ? 2 : 3;
          const ringLeft = Math.max(2, Math.round(rect.left - pad));
          const ringTop = Math.max(2, Math.round(rect.top - pad));
          const ringRight = Math.min(curEnv.vw - 2, Math.round(rect.right + pad));
          const ringBottom = Math.min(curEnv.vh - 2, Math.round(rect.bottom + pad));
          const ringW = Math.max(0, ringRight - ringLeft);
          const ringH = Math.max(0, ringBottom - ringTop);

          if (ringW > 4 && ringH > 4) {
            ringEl.style.opacity = '1';
            ringEl.style.transform = `translate3d(${ringLeft}px, ${ringTop}px, 0)`;
            ringEl.style.width = `${ringW}px`;
            ringEl.style.height = `${ringH}px`;

            const { tipX, tipY, angle } = computeArrowPlacement(rect, curEnv, curArrowSize);

            if (!arrowPosRef.current.visible) {
              arrowPosRef.current = { x: tipX, y: tipY, visible: true };
            } else {
              arrowPosRef.current.x += (tipX - arrowPosRef.current.x) * 0.18;
              arrowPosRef.current.y += (tipY - arrowPosRef.current.y) * 0.18;
            }

            arrowEl.style.opacity = '1';
            arrowEl.style.transform = `translate3d(${arrowPosRef.current.x.toFixed(1)}px, ${arrowPosRef.current.y.toFixed(1)}px, 0)`;

            if (arrowRotateEl) {
              arrowRotateEl.style.transform = `rotate(${angle}deg)`;
            }
          } else {
            ringEl.style.opacity = '0';
            arrowEl.style.opacity = '0';
            arrowPosRef.current.visible = false;
          }
        } else {
          ringEl.style.opacity = '0';
          arrowEl.style.opacity = '0';
          arrowPosRef.current.visible = false;
        }
      } else if (arrowEl && ringEl) {
        ringEl.style.opacity = '0';
        arrowEl.style.opacity = '0';
        arrowPosRef.current.visible = false;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [demoPlanetId, capitalPlanetId, onSyncUi]);

  const togglePause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => undefined);
      setPaused(false);
    } else {
      audio.pause();
      setPaused(true);
    }
  };

  const toggleAudioMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setAudioMuted(audio.muted);
  };

  const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const overlay = (
    <>
      {/* Transparent click-blocker during automated tour so accidental clicks don't derail panels */}
      <div className="fixed inset-0 z-[85] pointer-events-auto bg-transparent" aria-hidden="true" />

      {/* Neon Yellow Pulsing Target Highlight Ring ("card amarelo") */}
      <div
        ref={ringRef}
        className="tutorial-neon-ring fixed top-0 left-0 z-[88] pointer-events-none rounded-xl border-2 border-yellow-300 transition-opacity duration-200"
        style={{ opacity: 0 }}
      />

      {/* Blinking Neon Yellow Pointer Arrow (tip anchored at (0,0) regardless of rotation) */}
      <div
        ref={arrowWrapRef}
        className="fixed top-0 left-0 z-[90] pointer-events-none transition-opacity duration-200"
        style={{ opacity: 0 }}
      >
        <div
          style={{
            transform: `translate3d(${-tipOffsetX}px, ${-tipOffsetY}px, 0)`,
          }}
        >
          <div
            ref={arrowRotateRef}
            className="transition-transform duration-300"
            style={{
              width: arrowSize,
              height: arrowSize,
              transformOrigin: `${tipOffsetX}px ${tipOffsetY}px`,
            }}
          >
            <div className="tutorial-neon-arrow w-full h-full">
              <svg
                width={arrowSize}
                height={arrowSize}
                viewBox="0 0 46 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 4L21 40L26.5 25.5L41 20L5 4Z"
                  fill="#fde047"
                  stroke="#422006"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 8.5L20.5 34.5L24.5 23.8L35 19.8L9 8.5Z"
                  fill="#fef08a"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-Center Tutorial Subtitle & Playback Bar */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-[92] pointer-events-auto ${
          env.isMobile
            ? env.isLandscapeMobile
              ? 'bottom-1.5 w-[min(520px,calc(100vw-1rem))]'
              : 'bottom-2 w-[calc(100vw-1rem)] max-w-md'
            : 'bottom-3 w-[min(640px,calc(100%-1.5rem))]'
        }`}
      >
        <div
          className={`rounded-2xl border border-yellow-400/50 bg-[#050811]/94 shadow-[0_10px_40px_rgba(0,0,0,0.85)] backdrop-blur-md ${
            env.isLandscapeMobile ? 'px-3 py-1.5 space-y-1' : env.isMobile ? 'px-3 py-2 space-y-1.5' : 'px-4 py-3 space-y-2'
          }`}
        >
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse shrink-0" />
              <span className="font-display font-bold text-yellow-300 truncate text-[11px] sm:text-xs">
                Tutorial Narrado · {step.sectionLabel}
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <span className="font-mono-tabular text-[10px] sm:text-[11px] text-slate-400 mr-0.5 sm:mr-1">
                {formatTimeMMSS(currentTime)} / {formatTimeMMSS(duration)}
              </span>
              <button
                type="button"
                onClick={togglePause}
                className="p-1 sm:p-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-yellow-300 cursor-pointer"
                title={paused ? 'Retomar narração' : 'Pausar narração'}
              >
                {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={toggleAudioMute}
                className="p-1 sm:p-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 cursor-pointer"
                title={audioMuted ? 'Ativar áudio da narração' : 'Silenciar narração'}
              >
                {audioMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-yellow-300" />}
              </button>
              <button
                type="button"
                onClick={() => onFinish(false)}
                className="px-2 sm:px-2.5 py-1 rounded-lg border border-yellow-400/50 bg-yellow-400/15 hover:bg-yellow-400/25 text-yellow-200 text-[11px] sm:text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>Pular</span>
              </button>
            </div>
          </div>

          <p
            className={`text-slate-100 leading-snug font-medium ${
              env.isLandscapeMobile ? 'text-[11px]' : env.isMobile ? 'text-xs' : 'text-[13px]'
            }`}
          >
            {step.subtitle}
          </p>

          <div className="h-1 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-[width] duration-150"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <audio
        ref={audioRef}
        src={TUTORIAL_AUDIO_SRC}
        preload="auto"
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          if (Number.isFinite(e.currentTarget.duration) && e.currentTarget.duration > 0) {
            setDuration(e.currentTarget.duration);
          }
        }}
        onEnded={() => onFinish(true)}
      />
      {typeof document !== 'undefined' ? createPortal(overlay, document.body) : overlay}
    </>
  );
};
