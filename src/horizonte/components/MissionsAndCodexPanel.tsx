import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Dna,
  FileText,
  Globe2,
  Handshake,
  LifeBuoy,
  MessageSquare,
  Package,
  Radar,
  ScrollText,
  ShieldAlert,
  Sparkles,
  Swords,
  X,
  Flag,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import type { FactionTechStyle, Mission, MissionType, PlayerCampaignState, Rarity, StarSystemSummary } from '../types/game';
import {
  CREATURES,
  FACTIONS,
  FACTIONS_BY_ID,
  getFactionDistanceLy,
  isFactionConservative,
  LIFE_FORMS,
  LIFE_FORMS_BY_ID,
  SPECIES,
  SPECIES_BY_ID,
} from '../data/lifeforms';
import { PLANET_TYPES, PLANET_TYPES_BY_CODE } from '../data/planets';
import {
  checkMissionReadyInLocation,
  getMissionColoredSummary,
  getRenownTierName,
} from '../data/narrative';
import {
  BLUEPRINTS,
  BLUEPRINTS_BY_ID,
  CONSUMABLES,
  EXTRACTORS,
  HULLS,
  JUMP_DRIVES,
  RESOURCES,
  RESOURCES_BY_ID,
  SHIELDS,
  SUIT_GEAR,
  UTILITY_MODULES,
  WEAPONS,
} from '../data/items';
import { DAMAGE_TYPE_LABELS, EXTRACTION_CLASS_LABELS, getActiveTechCategory, RARITY_STYLES, TECH_CATEGORY_META } from '../utils/formatting';
import { CreatureCard } from './CreatureCard';
import { CodexDossier, type CodexDetail, type CodexItemCategory } from './CodexDossier';
import { TechCategoryBadge } from './TechCategoryBadge';
import { factionMilitaryPower, getEffectiveSystemSummary } from '../engine/galacticWar';
import { generateSolarSystem, getSystemSummaryById } from '../data/universe';
import { ALL_NARRATIVE_EVENTS, NARRATIVE_EVENTS_BY_ID } from '../engine/narrativeEventsEngine';
import { EquipmentSprite, ResourceSprite } from './SpriteArt';
import { SPECIAL_ABILITIES } from '../data/originPerks';

interface MissionsAndCodexPanelProps {
  mode: 'missions' | 'codex' | 'logbook';
  campaign: PlayerCampaignState;
  currentSystem: StarSystemSummary;
  onClose: () => void;
  onAcceptMission?: (mission: Mission) => void;
  onCompleteMission: (mission: Mission) => void;
  onAbandonMission: (missionId: string) => void;
  onFormAlliance: (factionId: string) => void;
  onOpenTutorial?: () => void;
  muted?: boolean;
  onToggleMute?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  tutorialSync?: {
    seq: number;
    codexTab?: 'faccoes' | 'especies' | 'vidas' | 'criaturas' | 'planetas' | 'itens' | 'habilidades' | 'diario';
  };
}

const MISSION_ICON: Record<MissionType, React.ReactNode> = {
  entrega_comercio: <Package className="w-3.5 h-3.5 text-cyan-400 shrink-0" />,
  coleta_raro: <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
  escanear_planeta: <Radar className="w-3.5 h-3.5 text-sky-400 shrink-0" />,
  escanear_criatura: <Dna className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
  contato_nivel2: <MessageSquare className="w-3.5 h-3.5 text-indigo-400 shrink-0" />,
  resgate_escolta: <LifeBuoy className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
  combate: <Swords className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
  guerra: <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
  cadeia_faccao: <Compass className="w-3.5 h-3.5 text-purple-400 shrink-0" />,
  evento_narrativo: <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />,
};

export function MissionCornerHud({
  campaign,
  minimized,
  onToggleMinimize,
  onOpenMission,
  onOpenMissionsPanel,
  highlightedSystemId,
  className = '',
  listClassName = 'max-h-[calc(var(--fit-h)*0.28)]',
}: {
  campaign: PlayerCampaignState;
  minimized: boolean;
  onToggleMinimize: () => void;
  onOpenMission?: (mission: Mission) => void;
  onOpenMissionsPanel?: () => void;
  highlightedSystemId?: string | null;
  className?: string;
  listClassName?: string;
}) {
  const acceptedRaw = campaign.missions.filter((m) => m.status === 'aceita');
  const accepted = highlightedSystemId
    ? [...acceptedRaw].sort((a, b) => {
        const aMatch = a.targetSystemId === highlightedSystemId ? 0 : 1;
        const bMatch = b.targetSystemId === highlightedSystemId ? 0 : 1;
        return aMatch - bMatch;
      })
    : acceptedRaw;
  const highlightedCount = highlightedSystemId
    ? accepted.filter((m) => m.targetSystemId === highlightedSystemId).length
    : 0;

  if (minimized) {
    return (
      <button
        type="button"
        onClick={onToggleMinimize}
        className={`pointer-events-auto w-full px-2.5 py-2 rounded-lg border bg-[#090e1a]/92 text-xs sm:text-[13px] font-semibold text-slate-200 flex items-center justify-between gap-1.5 cursor-pointer shadow-lg ${
          highlightedCount > 0
            ? 'border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.55)] text-yellow-100'
            : 'border-slate-700/90'
        } ${className}`}
        title="Mostrar missões"
      >
        <span className="flex items-center gap-1.5 min-w-0">
          <FileText className={`w-4 h-4 shrink-0 ${highlightedCount > 0 ? 'text-yellow-300' : 'text-emerald-400'}`} />
          <span className="truncate">Missões ({accepted.length}/5)</span>
        </span>
        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
      </button>
    );
  }

  return (
    <div className={`pointer-events-auto w-full rounded-xl border border-slate-800/90 bg-[#090e1a]/92 shadow-lg flex flex-col min-h-0 ${className}`}>
      <div className="flex items-center justify-between gap-1 px-2.5 py-1.5 border-b border-slate-800/80 shrink-0">
        {onOpenMissionsPanel ? (
          <button
            type="button"
            onClick={onOpenMissionsPanel}
            className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer text-left"
            title="Abrir painel completo de missões"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Missões Aceitas ({accepted.length}/5)</span>
          </button>
        ) : (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            Missões Aceitas ({accepted.length}/5)
          </span>
        )}
        <button
          type="button"
          onClick={onToggleMinimize}
          title="Minimizar missões"
          className="p-0.5 rounded-md text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      <div className={`${listClassName} overflow-y-auto px-2.5 py-2 min-h-0`}>
        {accepted.length === 0 ? (
          onOpenMissionsPanel ? (
            <button
              type="button"
              onClick={onOpenMissionsPanel}
              className="w-full text-left text-xs sm:text-[13px] text-slate-400 hover:text-cyan-300 italic py-0.5 cursor-pointer"
              title="Abrir painel de missões"
            >
              Nenhuma missão ativa. Clique para ver.
            </button>
          ) : (
            <div className="text-xs sm:text-[13px] text-slate-400 italic py-0.5">Nenhuma missão ativa.</div>
          )
        ) : (
          <ul className="space-y-1.5 text-xs sm:text-[13px] leading-snug">
            {accepted.map((m) => {
              const tokens = getMissionColoredSummary(m);
              const ready = checkMissionReadyInLocation(m, campaign).ready;
              const isHighlighted = Boolean(highlightedSystemId && m.targetSystemId === highlightedSystemId);
              return (
                <li
                  key={m.id}
                  className={
                    isHighlighted
                      ? 'rounded-lg border-2 border-yellow-400 bg-yellow-400/12 px-2 py-1.5 shadow-[0_0_14px_rgba(250,204,21,0.7),inset_0_0_8px_rgba(250,204,21,0.22)] transition-shadow'
                      : undefined
                  }
                >
                  <button
                    type="button"
                    onClick={() => onOpenMission?.(m)}
                    className="w-full text-left hover:underline cursor-pointer flex items-start gap-1.5"
                  >
                    <span className={isHighlighted ? 'text-yellow-300 font-bold' : ready ? 'text-emerald-400' : 'text-slate-400'}>•</span>
                    <span>
                      {tokens.map((tk, i) => (
                        <span
                          key={i}
                          className={
                            tk.tone === 'item'
                              ? 'text-sky-300 font-semibold'
                              : tk.tone === 'loc'
                              ? 'text-rose-300 font-semibold'
                              : isHighlighted
                              ? 'text-yellow-50 font-medium'
                              : 'text-slate-200'
                          }
                        >
                          {tk.text}
                        </span>
                      ))}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export const MissionsAndCodexPanel: React.FC<MissionsAndCodexPanelProps> = ({
  mode,
  campaign,
  currentSystem,
  onClose,
  onCompleteMission,
  onAbandonMission,
  onFormAlliance,
  onOpenTutorial,
  muted,
  onToggleMute,
  isFullscreen,
  onToggleFullscreen,
  tutorialSync,
}) => {
  const [missionTab, setMissionTab] = useState<'aceitas' | 'finalizadas'>('aceitas');
  const [codexTab, setCodexTab] = useState<'faccoes' | 'especies' | 'vidas' | 'criaturas' | 'planetas' | 'itens' | 'habilidades' | 'eventos' | 'diario'>('faccoes');
  const [lifeFilter, setLifeFilter] = useState<string>('all');
  const [itemQuery, setItemQuery] = useState('');
  const [itemRarity, setItemRarity] = useState('todas');
  const [itemType, setItemType] = useState<'todos' | CodexItemCategory>('todos');
  const [itemTech, setItemTech] = useState<'todas' | FactionTechStyle>('todas');
  const [detail, setDetail] = useState<CodexDetail | null>(null);
  const activeTechCategory = getActiveTechCategory(campaign);

  useEffect(() => {
    if (tutorialSync?.codexTab) {
      setCodexTab(tutorialSync.codexTab);
    }
  }, [tutorialSync]);

  const acceptedMissions = campaign.missions.filter((m) => m.status === 'aceita');
  const finishedMissions = campaign.missions.filter((m) => m.status === 'finalizada');

  const filteredCreatures = useMemo(
    () => CREATURES.filter((c) => lifeFilter === 'all' || c.lifeFormId === lifeFilter),
    [lifeFilter]
  );

  const passedEvents = useMemo(() => {
    const ids = campaign.completedEventIds ?? [];
    return [...ids]
      .reverse()
      .map((id) => NARRATIVE_EVENTS_BY_ID[id])
      .filter((ev): ev is NonNullable<typeof ev> => Boolean(ev));
  }, [campaign.completedEventIds]);

  const scannedCountByPlanetType = useMemo(() => {
    const counts: Record<string, number> = {};
    const bySystem = new Map<string, string[]>();
    for (const pid of campaign.scannedPlanetIds) {
      const match = pid.match(/^(.+)_p\d+$/);
      if (!match) continue;
      const sysId = match[1];
      const list = bySystem.get(sysId);
      if (list) list.push(pid);
      else bySystem.set(sysId, [pid]);
    }
    for (const [sysId, planetIds] of bySystem.entries()) {
      const rawSys = getSystemSummaryById(sysId);
      if (!rawSys) continue;
      const effSys = getEffectiveSystemSummary(rawSys, campaign);
      const fullSys = generateSolarSystem(effSys);
      for (const pid of planetIds) {
        const pl = fullSys.planets.find((p) => p.id === pid);
        if (!pl) continue;
        const typeCode = campaign.planetOverrides[pid]?.typeCodeOverride ?? pl.typeCode;
        counts[typeCode] = (counts[typeCode] ?? 0) + 1;
      }
    }
    return counts;
  }, [campaign]);

  const activeShip =
    campaign.ships.find((s) => s.uid === campaign.activeShipUid) ?? campaign.ships[0];
  const pilotedFactionId = activeShip?.factionId ?? campaign.chosenFactionId;
  const pilotedFac = FACTIONS_BY_ID[pilotedFactionId];

  const powerByFaction = useMemo(() => {
    const map: Record<string, number> = {};
    for (const f of FACTIONS) {
      map[f.id] = factionMilitaryPower(f.id, campaign);
    }
    return map;
  }, [campaign]);

  const sortedFactions = useMemo(() => {
    return [...FACTIONS].sort((a, b) => {
      if (a.id === pilotedFactionId) return -1;
      if (b.id === pilotedFactionId) return 1;
      const aKnown = campaign.knownFactionIds.includes(a.id) ? 1 : 0;
      const bKnown = campaign.knownFactionIds.includes(b.id) ? 1 : 0;
      if (bKnown !== aKnown) return bKnown - aKnown;
      const pDiff = (powerByFaction[b.id] ?? 0) - (powerByFaction[a.id] ?? 0);
      if (pDiff !== 0) return pDiff;
      return getFactionDistanceLy(pilotedFactionId, a.id) - getFactionDistanceLy(pilotedFactionId, b.id);
    });
  }, [pilotedFactionId, campaign.knownFactionIds, powerByFaction]);

  return (
    <div className="h-full flex flex-col gap-2.5 p-2.5 sm:p-3 bg-[#060a14] border-l border-slate-800 text-slate-100 select-none overflow-hidden">
      {/* CARD 1: Non-minimizable Hero Card (hidden in codex mode) */}
      {mode !== 'codex' && (
        <section className="shrink-0 bg-[#0b1222] border border-slate-800 rounded-2xl p-3.5 space-y-2.5 shadow-lg">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-xs text-cyan-400 font-medium">
                {mode === 'missions' ? 'Contratos & Operações' : 'Registros de Bordo'}
              </div>
              <h2 className="font-display text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                {mode === 'missions' && <FileText className="w-4 h-4 text-cyan-400" />}
                {mode === 'logbook' && <ScrollText className="w-4 h-4 text-emerald-400" />}
                {mode === 'missions' ? `Missões (${acceptedMissions.length}/5)` : 'Diário de Bordo'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {pilotedFac && (
            <div
              className="rounded-xl px-3 py-1.5 border flex items-center justify-between gap-2 text-[11px]"
              style={{
                borderColor: `${pilotedFac.color}66`,
                backgroundColor: `${pilotedFac.color}16`,
              }}
            >
              <span className="flex items-center gap-1.5 font-semibold truncate" style={{ color: pilotedFac.color }}>
                <Flag className="w-3.5 h-3.5 shrink-0" />
                Nave Pilotada: {pilotedFac.name}
              </span>
              <span className="text-slate-300 text-[10px] shrink-0">{pilotedFac.axis}</span>
            </div>
          )}
        </section>
      )}

      {/* CARD 2: Navigation / Filter Tabs Card */}
      <section className="shrink-0 bg-[#0b1222] border border-slate-800 rounded-2xl p-2 space-y-2">
        {mode === 'codex' && (
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5">
              {onToggleMute && (
                <button
                  type="button"
                  onClick={onToggleMute}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer shrink-0"
                  title={muted ? 'Ativar Áudio' : 'Silenciar Áudio'}
                >
                  {muted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-cyan-300" />}
                </button>
              )}
              {onToggleFullscreen && (
                <button
                  type="button"
                  onClick={onToggleFullscreen}
                  className={`p-1.5 rounded-lg border cursor-pointer shrink-0 ${
                    isFullscreen
                      ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                  title={isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia (Paisagem no Mobile)'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              )}
              {onOpenTutorial && (
                <button
                  type="button"
                  data-tutorial-id="codex-btn-tutorial"
                  onClick={onOpenTutorial}
                  className="px-2.5 py-1.5 rounded-lg border border-cyan-400/70 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  title="Abrir Tutorial"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Tutorial</span>
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer shrink-0"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {mode === 'missions' && (
          <div className="grid grid-cols-2 gap-1.5 text-[13px]">
            <button
              type="button"
              onClick={() => setMissionTab('aceitas')}
              className={`py-2 rounded-xl font-medium cursor-pointer transition-colors ${
                missionTab === 'aceitas'
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              Aceitas ({acceptedMissions.length}/5)
            </button>
            <button
              type="button"
              onClick={() => setMissionTab('finalizadas')}
              className={`py-2 rounded-xl font-medium cursor-pointer transition-colors ${
                missionTab === 'finalizadas'
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              Finalizadas ({finishedMissions.length})
            </button>
          </div>
        )}

        {mode === 'codex' && (
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              type="button"
              data-tutorial-id="codex-tab-faccoes"
              onClick={() => setCodexTab('faccoes')}
              className={`py-1.5 rounded-xl font-medium cursor-pointer transition-colors ${
                codexTab === 'faccoes'
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              Facções (42)
            </button>
            <button
              type="button"
              onClick={() => setCodexTab('especies')}
              className={`py-1.5 rounded-xl font-medium cursor-pointer transition-colors ${
                codexTab === 'especies'
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              Raças (21)
            </button>
            <button
              type="button"
              onClick={() => setCodexTab('vidas')}
              className={`py-1.5 rounded-xl font-medium cursor-pointer transition-colors ${
                codexTab === 'vidas'
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              Formas de vida
            </button>
            <button
              type="button"
              data-tutorial-id="codex-tab-criaturas"
              onClick={() => setCodexTab('criaturas')}
              className={`py-1.5 rounded-xl font-medium cursor-pointer transition-colors ${
                codexTab === 'criaturas'
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              Fauna (140)
            </button>
            <button
              type="button"
              onClick={() => setCodexTab('planetas')}
              className={`py-1.5 rounded-xl font-medium cursor-pointer transition-colors ${
                codexTab === 'planetas'
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              Mundos ({PLANET_TYPES.length})
            </button>
            <button
              type="button"
              onClick={() => setCodexTab('itens')}
              className={`py-1.5 rounded-xl font-medium cursor-pointer ${codexTab === 'itens' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'bg-slate-900/90 text-slate-300 border border-slate-800'}`}
            >
              Itens
            </button>
            <button
              type="button"
              onClick={() => setCodexTab('habilidades')}
              className={`py-1.5 rounded-xl font-medium cursor-pointer ${codexTab === 'habilidades' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'bg-slate-900/90 text-slate-300 border border-slate-800'}`}
            >
              Habilidades
            </button>
            <button
              type="button"
              onClick={() => setCodexTab('eventos')}
              className={`py-1.5 rounded-xl font-medium cursor-pointer ${codexTab === 'eventos' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'bg-slate-900/90 text-slate-300 border border-slate-800'}`}
            >
              Eventos ({passedEvents.length})
            </button>
            <button
              type="button"
              onClick={() => setCodexTab('diario')}
              className={`py-1.5 rounded-xl font-medium cursor-pointer flex items-center justify-center gap-1 ${codexTab === 'diario' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'bg-slate-900/90 text-slate-300 border border-slate-800'}`}
            >
              <ScrollText className="w-3 h-3 shrink-0" />
              <span>Diário ({campaign.logbook.length})</span>
            </button>
          </div>
        )}

        {mode === 'logbook' && (
          <div className="px-2 py-1 flex items-center justify-between text-xs text-slate-300">
            <span>Eventos recentes da expedição</span>
            <span className="font-mono-tabular text-cyan-300">{campaign.logbook.length} registros</span>
          </div>
        )}
      </section>

      {/* CARD 3: Scrollable Active Content Card */}
      <section data-tutorial-scroll="codex-body" className="flex-1 min-h-0 bg-[#0b1222] border border-slate-800 rounded-2xl p-3.5 overflow-y-auto space-y-3 text-xs">
        {mode === 'missions' && missionTab === 'aceitas' && (
          <>
            {acceptedMissions.length === 0 ? (
              <div className="text-slate-400 text-[13px] italic py-6 text-center">
                Nenhuma missão aceita no momento. Visite um planeta habitado para aceitar novos contratos.
              </div>
            ) : (
              acceptedMissions.map((m) => {
                const check = checkMissionReadyInLocation(m, campaign);
                const issuer = FACTIONS_BY_ID[m.issuerFactionId];
                const tokens = getMissionColoredSummary(m);
                const reqRes = m.requiredResourceId ? RESOURCES_BY_ID[m.requiredResourceId] : null;
                const reqResStyle = reqRes ? RARITY_STYLES[reqRes.rarity] : null;
                const cargoQty = m.requiredResourceId
                  ? campaign.cargo.find((c) => c.resourceId === m.requiredResourceId)?.qty ?? 0
                  : 0;
                const distLy = Math.hypot(
                  m.targetSystemCoord.x - currentSystem.x,
                  m.targetSystemCoord.y - currentSystem.y,
                  m.targetSystemCoord.z - currentSystem.z
                );
                return (
                  <div
                    key={m.id}
                    className={`bg-slate-950/90 border rounded-xl p-3.5 space-y-2.5 ${
                      check.ready ? 'border-emerald-500/50' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {MISSION_ICON[m.type]}
                          <span className="font-semibold text-sm text-white">{m.title}</span>
                          {m.type === 'guerra' && (
                            <span className="px-1.5 py-0.5 rounded border border-rose-500/50 bg-rose-500/15 text-rose-300 text-[11px] font-semibold">
                              {m.warKind === 'bombardeio'
                                ? 'Guerra · Bombardeio'
                                : m.warKind === 'defensiva'
                                ? 'Guerra · Defensiva'
                                : 'Guerra · Ofensiva'}
                            </span>
                          )}
                          <span
                            className={`px-1.5 py-0.5 rounded border text-[11px] font-semibold ${
                              check.ready
                                ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300'
                                : 'bg-amber-500/15 border-amber-400/40 text-amber-300'
                            }`}
                          >
                            {check.ready ? 'Pronta' : 'Em andamento'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded border border-slate-700 bg-slate-900 text-slate-300 text-[11px] font-mono-tabular">
                            {m.targetSystemId === currentSystem.id ? 'Neste sistema' : `${distLy.toFixed(1)} anos-luz`}
                          </span>
                        </div>
                        <div className="text-[13px] leading-snug pt-1">
                          {tokens.map((tk, i) => (
                            <span
                              key={i}
                              className={
                                tk.tone === 'item'
                                  ? 'text-sky-400 font-semibold'
                                  : tk.tone === 'loc'
                                  ? 'text-rose-400 font-semibold'
                                  : 'text-slate-300'
                              }
                            >
                              {tk.text}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onAbandonMission(m.id)}
                        className="text-xs text-slate-400 hover:text-rose-400 underline shrink-0 cursor-pointer"
                      >
                        Abandonar
                      </button>
                    </div>

                    {reqRes && reqResStyle && (
                      <div className={`rounded-lg border p-2 text-xs flex items-center gap-2 bg-slate-900/70 ${reqResStyle.border}`}>
                        <ResourceSprite resourceId={reqRes.id} size={30} />
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`font-semibold ${reqResStyle.text}`}>
                              Recurso: {reqRes.name} ({reqResStyle.label})
                            </span>
                            <span className="font-mono-tabular text-slate-200">
                              Compartimento: {cargoQty}/{m.requiredQty ?? 1} unidades
                            </span>
                          </div>
                          <div className="text-slate-400">{reqRes.description}</div>
                        </div>
                      </div>
                    )}

                    {m.rewardBlueprintId && (
                      <div className="rounded-lg border border-purple-500/40 bg-purple-950/35 px-2.5 py-1.5 text-xs text-purple-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                        <span>
                          Recompensa extra: <strong>{BLUEPRINTS_BY_ID[m.rewardBlueprintId]?.name ?? m.rewardItemName}</strong>
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-t border-slate-800 pt-2">
                      <span className="font-mono-tabular text-amber-300">
                        {m.type === 'evento_narrativo' ? (
                          'Desfecho e recompensas revelados ao concluir'
                        ) : (
                          <>
                            {m.rewardCredits} cr · +{m.rewardRenown} Reputação ({issuer?.name})
                            {m.isRivalTerritory && ' · 2,25× Risco Rival'}
                          </>
                        )}
                      </span>
                      <button
                        type="button"
                        disabled={!check.ready}
                        onClick={() => onCompleteMission(m)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-semibold cursor-pointer"
                      >
                        {check.ready
                          ? m.type === 'cadeia_faccao' && (m.chainStep ?? 1) < (m.chainTotal ?? 3)
                            ? `Avançar Etapa (${m.chainStep ?? 1}/${m.chainTotal ?? 3})`
                            : m.type === 'guerra' || m.type === 'cadeia_faccao'
                            ? 'Concluir Missão'
                            : 'Concluir Entrega'
                          : 'Ir ao Local'}
                      </button>
                    </div>
                    {!check.ready && <div className="text-xs text-amber-300">{check.reason}</div>}
                  </div>
                );
              })
            )}
          </>
        )}

        {mode === 'missions' && missionTab === 'finalizadas' && (
          <>
            {finishedMissions.length === 0 ? (
              <div className="text-slate-400 text-[13px] italic py-6 text-center">Nenhuma missão concluída ainda.</div>
            ) : (
              finishedMissions.map((m) => (
                <div
                  key={m.id}
                  className="bg-slate-950/70 border border-emerald-500/30 rounded-xl p-3.5 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span className="truncate">{m.title}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{m.description}</div>
                  </div>
                  <span className="font-mono-tabular text-xs text-amber-300 shrink-0">+{m.rewardCredits} créditos</span>
                </div>
              ))
            )}
          </>
        )}

        {mode === 'codex' && codexTab === 'faccoes' && (
          <div className="space-y-2.5">
            <div className="text-[11px] text-slate-300 bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 space-y-1.5">
              <div className="space-y-0.5">
                <div>
                  Melhore a reputação com uma facção para conseguir melhores favores comerciais e alcance reputação{' '}
                  <strong className="text-cyan-300">80</strong> para se tornar um oficial legítimo daquela facção.
                </div>
                <div className="text-slate-400">
                  Ou alcance <strong className="text-amber-300">-20</strong> para ser considerado inimigo ou{' '}
                  <strong className="text-rose-400">-80</strong> para ser caçado e destruído por uma facção.
                </div>
              </div>
              <div className="text-slate-400 pt-1 border-t border-slate-800/80">
                Doutrina: facções <strong className="text-amber-300">Conservadoras</strong> preservam mundos Nível 2 em suas fronteiras; facções{' '}
                <strong className="text-sky-300">Integradoras</strong> evoluem todos os mundos Nível 2 para Nível 3–4.
              </div>
            </div>
            {sortedFactions.map((fac) => {
              const isPilotedFaction = fac.id === pilotedFactionId;
              const known = isPilotedFaction || campaign.knownFactionIds.includes(fac.id);
              const dist = getFactionDistanceLy(pilotedFactionId, fac.id);
              const renown = campaign.factionRenown[fac.id] ?? 0;
              const isAllied = campaign.formalAlliances.includes(fac.id);
              const homeWars = campaign.activeWars[pilotedFactionId] ?? [];
              const staticWars = FACTIONS_BY_ID[pilotedFactionId]?.warsWith ?? [];
              const atWar = homeWars.includes(fac.id) || staticWars.includes(fac.id) || fac.warsWith.includes(pilotedFactionId);
              const tier = getRenownTierName(renown, isAllied);
              const isConservative = isFactionConservative(fac);
              const sp = SPECIES_BY_ID[fac.speciesId];
              const canAlly = fac.id !== pilotedFactionId && !isAllied && !atWar && renown > 80;

              if (!known) {
                return (
                  <div
                    key={fac.id}
                    className="bg-slate-950/50 border border-slate-800/60 rounded-lg p-2.5 flex items-center justify-between text-slate-500"
                  >
                    <span>Setor Desconhecido ({dist.toFixed(1)} a.l.)</span>
                    <span>Visite ou escaneie para revelar</span>
                  </div>
                );
              }

              return (
                <div
                  key={fac.id}
                  className="bg-slate-950/90 border rounded-xl p-3 space-y-2 cursor-pointer"
                  onClick={() => setDetail({ kind: 'faction', id: fac.id })}
                  style={
                    isPilotedFaction
                      ? {
                          borderColor: fac.color,
                          backgroundImage: `linear-gradient(135deg, ${fac.color}22 0%, rgba(2,6,23,0.96) 55%)`,
                        }
                      : { borderColor: 'rgb(30 41 59)' }
                  }
                >
                  {isPilotedFaction && (
                    <div
                      className="flex items-center justify-between text-[10px] font-bold px-2 py-1 rounded-lg border"
                      style={{
                        color: fac.color,
                        borderColor: `${fac.color}66`,
                        backgroundColor: `${fac.color}1a`,
                      }}
                    >
                      <span className="flex items-center gap-1">
                        <Flag className="w-3 h-3" />
                        Nave Pilotada · Sua Facção Ativa
                      </span>
                      <span>Em Destaque</span>
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5 min-w-0">
                      {sp && (
                        <CreatureCard
                          cardId={`species_${sp.id}`}
                          kind="species"
                          name={sp.name}
                          lifeFormId={sp.lifeFormId}
                          description={sp.description}
                          sizeClass="w-11 h-11"
                          allowAiGeneration={false}
                        />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: fac.color }} />
                          <span className="font-semibold text-white">{fac.name}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded border text-[9px] font-semibold ${
                              isConservative
                                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                                : 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                            }`}
                          >
                            {isConservative ? 'Conservadora (Nv 2)' : 'Integradora'}
                          </span>
                        </div>
                        <div className="text-[11px] text-cyan-300 mt-0.5 flex flex-wrap items-center gap-2">
                          <span>{sp?.name} · {fac.axis}</span>
                          <TechCategoryBadge category={fac.techStyle} activeCategory={activeTechCategory} compact />
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-amber-500/40 bg-amber-500/15 text-amber-200 font-mono-tabular text-[10px] font-semibold">
                            <Zap className="w-3 h-3 text-amber-300" />
                            Poder {powerByFaction[fac.id] ?? 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="font-mono-tabular text-[11px] text-slate-400 shrink-0">{dist.toFixed(1)} a.l.</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 gap-2">
                    <span className="text-[11px] flex flex-col gap-0.5 min-w-0">
                      <span className={renown > 80 ? 'text-emerald-300 font-medium' : renown < 0 ? 'text-rose-300 font-medium' : 'text-cyan-200 font-medium'}>
                        Sua reputação com essa facção: {renown} ({tier})
                      </span>
                      {atWar && (
                        <span className="text-rose-400 font-semibold flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5" /> Em guerra com a facção da sua nave
                        </span>
                      )}
                    </span>

                    {fac.id !== pilotedFactionId && !isAllied && (
                      <button
                        type="button"
                        disabled={!canAlly}
                        onClick={(e) => {
                          e.stopPropagation();
                          onFormAlliance(fac.id);
                        }}
                        className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Handshake className="w-3 h-3" />
                        {atWar
                          ? 'Em Guerra'
                          : renown <= 80
                          ? 'Reputação acima de 80'
                          : 'Aliança Formal'}
                      </button>
                    )}
                    {isAllied && (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                        <Award className="w-3.5 h-3.5" /> Aliança Formal
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {mode === 'codex' && codexTab === 'especies' && (
          <div className="space-y-2.5">
            <div className="text-[11px] text-slate-400 bg-slate-950/80 border border-slate-800 rounded-lg p-2">
              Passe o mouse em qualquer retrato para gerar Pixel Art 320×320 em cache no servidor.
            </div>
            {SPECIES.map((sp) => {
              const lf = LIFE_FORMS_BY_ID[sp.lifeFormId];
              return (
                <div
                  key={sp.id}
                  className="flex items-start gap-3 bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 cursor-pointer"
                  onClick={() => setDetail({ kind: 'species', id: sp.id })}
                >
                  <CreatureCard
                    cardId={`species_${sp.id}`}
                    kind="species"
                    name={sp.name}
                    lifeFormId={sp.lifeFormId}
                    description={sp.description}
                    sizeClass="w-16 h-16"
                    allowAiGeneration={true}
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display font-bold text-cyan-100">{sp.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 capitalize">
                        {lf?.name} · {sp.temperament}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{sp.description}</p>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {sp.traits.map((tr) => (
                        <span
                          key={tr}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                        >
                          {tr}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {mode === 'codex' && codexTab === 'criaturas' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-300 font-medium">
                Catalogadas: {campaign.scannedCreatureIds.length}/140
              </span>
              <select
                value={lifeFilter}
                onChange={(e) => setLifeFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px]"
              >
                <option value="all">Todas as 7 Formas de Vida</option>
                {LIFE_FORMS.map((lf) => (
                  <option key={lf.id} value={lf.id}>
                    {lf.name} (20)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {filteredCreatures.map((cr) => {
                const discovered = campaign.scannedCreatureIds.includes(cr.id);
                return (
                  <div
                    key={cr.id}
                    className={`flex items-start gap-2.5 border rounded-xl p-2.5 cursor-pointer ${
                      discovered
                        ? 'bg-slate-950/90 border-cyan-500/40'
                        : 'bg-slate-950/55 border-slate-800/70 opacity-85'
                    }`}
                    onClick={() => setDetail({ kind: 'creature', id: cr.id })}
                  >
                    <CreatureCard
                      cardId={cr.id}
                      kind="creature"
                      name={cr.name}
                      lifeFormId={cr.lifeFormId}
                      description={cr.description}
                      sizeClass="w-14 h-14"
                      allowAiGeneration={true}
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="font-semibold flex items-center justify-between gap-1.5">
                        <span className={`truncate ${cr.rareNiche ? RARITY_STYLES.raro.text : 'text-slate-100'}`}>{cr.name}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          {cr.rareNiche && (
                            <span className={`px-1.5 py-0.5 rounded border text-[9px] font-semibold ${RARITY_STYLES.raro.badge}`}>
                              Nicho Raro
                            </span>
                          )}
                          <span className="text-[10px] font-mono-tabular text-amber-300">{cr.baseValue} cr</span>
                        </div>
                      </div>
                      <div className="text-[10px] capitalize flex items-center gap-1.5 flex-wrap">
                        <span className="text-cyan-300">{cr.ecologicalRole} · {cr.size}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded border text-[9px] font-semibold ${
                            cr.danger === 'mortal'
                              ? 'bg-rose-500/20 border-rose-500/60 text-rose-300'
                              : cr.danger === 'alto'
                              ? 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                              : cr.danger === 'moderado'
                              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                              : cr.danger === 'baixo'
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                              : 'bg-slate-800 border-slate-600 text-slate-300'
                          }`}
                        >
                          Perigo {cr.danger}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-300 leading-snug">{cr.description}</div>
                      <div className="text-[10px] text-slate-400 flex flex-wrap items-center gap-1">
                        <span>Utilidade: {cr.utility}</span>
                        <span>· Mundos: {cr.preferredPlanetCodes.map((code) => PLANET_TYPES_BY_CODE[code]?.name).filter(Boolean).join(', ')}</span>
                        <span>· {discovered ? 'Catalogada' : 'Ainda não escaneada'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {mode === 'codex' && codexTab === 'planetas' && (
          <div className="space-y-2.5">
            <div className="text-[11px] text-cyan-100/90 bg-slate-950/90 border border-cyan-500/30 rounded-xl p-2.5">
              Levantamentos de campo. O nome da classe é o que a tripulação fala — sem código de arquivo na frente do relato.
            </div>
            {PLANET_TYPES.map((pt) => {
              const rStyle = RARITY_STYLES[pt.rarity] ?? RARITY_STYLES.comum;
              const scannedCount = scannedCountByPlanetType[pt.code] ?? 0;
              return (
                <button
                  key={pt.code}
                  type="button"
                  onClick={() => setDetail({ kind: 'planet', id: pt.code })}
                  className={`relative w-full text-left overflow-hidden border rounded-xl cursor-pointer ${rStyle.border}`}
                >
                  <img
                    src={`/planet-covers/${pt.code}.jpg`}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-45"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#050914]/95 via-[#050914]/80 to-[#050914]/35" />
                  <div className="relative p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className={`font-display text-base font-bold ${rStyle.text}`}>{pt.name}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`px-1.5 py-0.5 rounded border text-[10px] font-mono-tabular font-semibold ${
                            scannedCount > 0
                              ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-200'
                              : 'border-slate-700 bg-slate-900/80 text-slate-400'
                          }`}
                        >
                          Escaneados: {scannedCount}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold capitalize ${rStyle.badge}`}>
                          {rStyle.label}
                        </span>
                      </div>
                    </div>
                    <p className="text-[12px] leading-relaxed text-slate-100">{pt.lifeRuleText}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {pt.typicalResourceIds.map((rid) => {
                        const res = RESOURCES_BY_ID[rid];
                        if (!res) return null;
                        return (
                          <span key={rid} className={`text-[10px] font-semibold ${RARITY_STYLES[res.rarity].text}`}>
                            {res.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {mode === 'codex' && codexTab === 'vidas' && (
          <div className="space-y-2">
            {LIFE_FORMS.map((lf) => (
              <button
                key={lf.id}
                type="button"
                onClick={() => setDetail({ kind: 'life', id: lf.id })}
                className="w-full text-left bg-[#070d18] border border-cyan-500/25 rounded-xl p-3 cursor-pointer shadow-[0_0_18px_rgba(34,211,238,0.06)]"
              >
                <div className="font-display text-base font-bold" style={{ color: lf.color }}>{lf.name}</div>
                <p className="text-[12px] text-slate-200 leading-relaxed mt-1">{lf.biology}</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Mundos: {lf.compatiblePlanetCodes.map((code) => PLANET_TYPES_BY_CODE[code]?.name).filter(Boolean).join(', ')}
                </p>
              </button>
            ))}
          </div>
        )}

        {mode === 'codex' && codexTab === 'itens' && (
          <ItemCodex
            query={itemQuery}
            rarity={itemRarity}
            itemType={itemType}
            techFilter={itemTech}
            activeTech={activeTechCategory}
            onQuery={setItemQuery}
            onRarity={setItemRarity}
            onType={setItemType}
            onTechFilter={setItemTech}
            onOpen={setDetail}
          />
        )}

        {mode === 'codex' && codexTab === 'habilidades' && (
          <div className="space-y-2">
            {SPECIAL_ABILITIES.map((ab) => (
              <button
                key={ab.id}
                type="button"
                onClick={() => setDetail({ kind: 'ability', id: ab.id })}
                className="w-full text-left bg-slate-950/90 border border-slate-800 rounded-xl p-3 cursor-pointer"
              >
                <div className="font-semibold text-white">{ab.name}</div>
                <div className="text-[10px] text-cyan-300">{ab.ownerName} · {ab.kind}</div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{ab.summary}</p>
              </button>
            ))}
          </div>
        )}

        {mode === 'codex' && codexTab === 'eventos' && (
          <div className="space-y-2">
            <div className="px-2.5 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="font-medium">Eventos já vivenciados</span>
              <span className="font-mono-tabular text-cyan-300">
                {passedEvents.length} / {ALL_NARRATIVE_EVENTS.length}
              </span>
            </div>
            {passedEvents.length === 0 ? (
              <div className="text-slate-500 italic py-4 text-center">
                Nenhum evento vivenciado ainda.
              </div>
            ) : (
              <ul className="space-y-1.5">
                {passedEvents.map((ev, idx) => (
                  <li
                    key={ev.id}
                    className="bg-slate-950/90 border border-slate-800 rounded-lg px-3 py-2 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex items-center gap-2">
                      <span className="font-mono-tabular text-[10px] text-slate-500 shrink-0">
                        #{passedEvents.length - idx}
                      </span>
                      <span className="font-semibold text-slate-100 truncate">{ev.title}</span>
                    </div>
                    <span className="text-[10px] text-cyan-300/90 shrink-0">
                      {ev.category} · {ev.scope === 'galactico' ? 'Galáctico' : 'Planetário'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {(mode === 'logbook' || (mode === 'codex' && codexTab === 'diario')) && (
          <div className="space-y-2">
            {mode === 'codex' && (
              <div className="px-2.5 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <ScrollText className="w-3.5 h-3.5 text-emerald-400" />
                  Diário de Bordo · Eventos recentes da expedição
                </span>
                <span className="font-mono-tabular text-cyan-300">{campaign.logbook.length} registros</span>
              </div>
            )}
            {campaign.logbook.length === 0 ? (
              <div className="text-slate-500 italic py-4 text-center">Sem registros ainda.</div>
            ) : (
              [...campaign.logbook].reverse().map((entry) => (
                <div
                  key={entry.id}
                  className="bg-slate-950/90 border border-slate-800 rounded-lg p-2.5 space-y-0.5"
                >
                  <div className="text-[10px] text-cyan-400 uppercase font-mono-tabular">
                    {entry.category} · T+{Math.floor(entry.timestamp)}s
                  </div>
                  <div className="text-slate-200">{entry.text}</div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
      {detail && <CodexDossier detail={detail} campaign={campaign} onClose={() => setDetail(null)} />}
    </div>
  );
};

const ITEM_TYPE_OPTIONS: Array<{ value: 'todos' | CodexItemCategory; label: string }> = [
  { value: 'todos', label: 'Todos os tipos' },
  { value: 'hull', label: 'Naves' },
  { value: 'weapon', label: 'Armas' },
  { value: 'shield', label: 'Escudos' },
  { value: 'jumpDrive', label: 'Motores de Salto' },
  { value: 'extractor', label: 'Extratores' },
  { value: 'utility', label: 'Utilidades' },
  { value: 'suit', label: 'Trajes' },
  { value: 'consumable', label: 'Consumíveis' },
  { value: 'resource', label: 'Recursos' },
  { value: 'blueprint', label: 'Projetos' },
];

const RARITY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'todas', label: 'Todas as raridades' },
  { value: 'comum', label: 'Comum' },
  { value: 'incomum', label: 'Incomum' },
  { value: 'raro', label: 'Raro' },
  { value: 'épico', label: 'Épico' },
  { value: 'lendário', label: 'Lendário' },
  { value: 'único', label: 'Único' },
];

const TECH_FILTER_OPTIONS: Array<{ value: 'todas' | FactionTechStyle; label: string }> = [
  { value: 'todas', label: 'Todas as categorias tec.' },
  { value: 'silicoide', label: TECH_CATEGORY_META.silicoide.shortLabel },
  { value: 'criogenica', label: TECH_CATEGORY_META.criogenica.shortLabel },
  { value: 'gasosa', label: TECH_CATEGORY_META.gasosa.shortLabel },
  { value: 'radioativa', label: TECH_CATEGORY_META.radioativa.shortLabel },
  { value: 'militar', label: TECH_CATEGORY_META.militar.shortLabel },
  { value: 'mercantil', label: TECH_CATEGORY_META.mercantil.shortLabel },
  { value: 'pesquisadores', label: TECH_CATEGORY_META.pesquisadores.shortLabel },
];

interface ItemCodexRow {
  id: string;
  name: string;
  rarity: Rarity;
  description: string;
  price: number;
  extra: string;
  itemCategory: CodexItemCategory;
  typeLabel: string;
  techCategory: FactionTechStyle;
}

function ItemCodex({
  query,
  rarity,
  itemType,
  techFilter,
  activeTech,
  onQuery,
  onRarity,
  onType,
  onTechFilter,
  onOpen,
}: {
  query: string;
  rarity: string;
  itemType: 'todos' | CodexItemCategory;
  techFilter: 'todas' | FactionTechStyle;
  activeTech: FactionTechStyle;
  onQuery: (v: string) => void;
  onRarity: (v: string) => void;
  onType: (v: 'todos' | CodexItemCategory) => void;
  onTechFilter: (v: 'todas' | FactionTechStyle) => void;
  onOpen: (d: CodexDetail) => void;
}) {
  const allRows = useMemo<ItemCodexRow[]>(() => [
    ...HULLS.map((i) => ({
      id: i.id,
      name: i.name,
      rarity: i.rarity,
      description: i.description,
      price: i.price,
      extra: `Casco ${i.maxHull} · Blind. ${i.armor} · Carga ${i.cargoCapacity} · Trip. ${i.activeCrewPosts}/${i.reserveQuarters}`,
      itemCategory: 'hull' as const,
      typeLabel: 'Nave',
      techCategory: i.factionStyle,
    })),
    ...WEAPONS.map((i) => ({
      id: i.id,
      name: i.name,
      rarity: i.rarity,
      description: i.description,
      price: i.price,
      extra: `${DAMAGE_TYPE_LABELS[i.damageType]} · ${i.dps} DPS · Alcance ${i.range}${i.canBombard ? ' · Bombardeio' : ''}`,
      itemCategory: 'weapon' as const,
      typeLabel: 'Arma',
      techCategory: i.factionStyle,
    })),
    ...SHIELDS.map((i) => ({
      id: i.id,
      name: i.name,
      rarity: i.rarity,
      description: i.description,
      price: i.price,
      extra: `Escudo +${i.capacity} · Recarga ${i.rechargePerSec}/s${i.reflectDamageRatio ? ` · Reflete ${Math.round(i.reflectDamageRatio * 100)}%` : ''}`,
      itemCategory: 'shield' as const,
      typeLabel: 'Escudo',
      techCategory: i.factionStyle,
    })),
    ...JUMP_DRIVES.map((i) => ({
      id: i.id,
      name: i.name,
      rarity: i.rarity,
      description: i.description,
      price: i.price,
      extra: `Salto ${i.jumpRangeLy} a.l. · Consumo ${Math.round(i.fuelEfficiency * 100)}%`,
      itemCategory: 'jumpDrive' as const,
      typeLabel: 'Motor de Salto',
      techCategory: i.factionStyle,
    })),
    ...EXTRACTORS.map((i) => ({
      id: i.id,
      name: i.name,
      rarity: i.rarity,
      description: i.description,
      price: i.price,
      extra: `${i.extractorScope === 'nave' ? 'Extração de Nave (máx. 2)' : 'Extração Manual (Tripulação)'} · ${EXTRACTION_CLASS_LABELS[i.extractionClass]} · ${i.ratePerSec.toFixed(1)} un./s`,
      itemCategory: 'extractor' as const,
      typeLabel: i.extractorScope === 'nave' ? 'Extrator de Nave' : 'Extrator Manual',
      techCategory: i.factionStyle,
    })),
    ...UTILITY_MODULES.map((i) => ({
      id: i.id,
      name: i.name,
      rarity: i.rarity,
      description: i.description,
      price: i.price,
      extra: 'Módulo de Utilidade',
      itemCategory: 'utility' as const,
      typeLabel: 'Utilidade',
      techCategory: i.factionStyle,
    })),
    ...SUIT_GEAR.map((i) => ({
      id: i.id,
      name: i.name,
      rarity: i.rarity,
      description: i.description,
      price: i.price,
      extra: `Tripulação · Exploração +${i.explorationBonus} · Combate solo +${i.combatPower}`,
      itemCategory: 'suit' as const,
      typeLabel: 'Equip. Tripulação',
      techCategory: i.factionStyle,
    })),
    ...CONSUMABLES.map((i) => ({
      id: i.id,
      name: i.name,
      rarity: (i.rarity ?? 'comum') as Rarity,
      description: i.description,
      price: i.price,
      extra: i.speciesExclusiveId
        ? `Exclusivo ${SPECIES_BY_ID[i.speciesExclusiveId]?.name ?? i.speciesExclusiveId}`
        : i.factionExclusiveId
          ? `Fórmula ${FACTIONS_BY_ID[i.factionExclusiveId]?.name ?? i.factionExclusiveId}`
          : 'Consumível de bordo',
      itemCategory: 'consumable' as const,
      typeLabel: 'Consumível',
      techCategory: i.factionStyle,
    })),
    ...RESOURCES.map((i) => ({
      id: i.id,
      name: i.name,
      rarity: i.rarity,
      description: i.description,
      price: i.basePrice,
      extra: `${EXTRACTION_CLASS_LABELS[i.extractionClass]} · Recurso de carga`,
      itemCategory: 'resource' as const,
      typeLabel: 'Recurso',
      techCategory: i.factionStyle,
    })),
    ...BLUEPRINTS.map((i) => ({
      id: i.id,
      name: i.name,
      rarity: (i.minPlanetLevel >= 4 ? 'lendário' : 'raro') as Rarity,
      description: i.description,
      price: i.price,
      extra: `Requer Estaleiro Nível ${i.minPlanetLevel}+ · Forja ${i.craftCredits.toLocaleString('pt-BR')} CR`,
      itemCategory: 'blueprint' as const,
      typeLabel: 'Projeto',
      techCategory: i.factionStyle,
    })),
  ], []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allRows.filter((row) => {
      if (itemType !== 'todos' && row.itemCategory !== itemType) return false;
      if (rarity !== 'todas' && row.rarity !== rarity) return false;
      if (techFilter !== 'todas' && row.techCategory !== techFilter) return false;
      if (!q) return true;
      const techLabel = TECH_CATEGORY_META[row.techCategory]?.shortLabel ?? '';
      return `${row.name} ${row.typeLabel} ${techLabel} ${row.extra} ${row.description}`.toLowerCase().includes(q);
    });
  }, [allRows, itemType, rarity, techFilter, query]);

  const hasFilters = itemType !== 'todos' || rarity !== 'todas' || techFilter !== 'todas' || query.trim().length > 0;

  return (
    <div className="space-y-2.5">
      <div className="space-y-2">
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Buscar nave, arma, recurso, consumível..."
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <select
            aria-label="Filtrar por tipo"
            value={itemType}
            onChange={(e) => onType(e.target.value as 'todos' | CodexItemCategory)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/60"
          >
            {ITEM_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            aria-label="Filtrar por raridade"
            value={rarity}
            onChange={(e) => onRarity(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/60"
          >
            {RARITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            aria-label="Filtrar por categoria tecnológica"
            value={techFilter}
            onChange={(e) => onTechFilter(e.target.value as 'todas' | FactionTechStyle)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/60"
          >
            {TECH_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
          <span>
            Exibindo <strong className="text-cyan-300 font-mono-tabular">{rows.length}</strong> de{' '}
            <span className="font-mono-tabular">{allRows.length}</span> itens
          </span>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                onQuery('');
                onType('todos');
                onRarity('todas');
                onTechFilter('todas');
              }}
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 cursor-pointer"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-center text-xs text-slate-400">
          Nenhum item encontrado com os filtros atuais.
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((row) => {
            const tone = RARITY_STYLES[row.rarity] ?? RARITY_STYLES.comum;
            return (
              <button
                key={`${row.itemCategory}-${row.id}`}
                type="button"
                onClick={() =>
                  onOpen({
                    kind: 'item',
                    id: row.id,
                    name: row.name,
                    rarity: row.rarity,
                    description: row.description,
                    price: row.price,
                    extra: row.extra,
                    itemCategory: row.itemCategory,
                    typeLabel: row.typeLabel,
                    techCategory: row.techCategory,
                  })
                }
                className={`w-full text-left bg-slate-950/90 hover:bg-slate-900/95 border ${tone.border} rounded-xl p-2.5 cursor-pointer flex items-start gap-2.5 transition-colors`}
              >
                {row.itemCategory === 'resource' ? (
                  <ResourceSprite resourceId={row.id} size={44} />
                ) : (
                  <EquipmentSprite category={row.itemCategory} itemId={row.id} size={44} />
                )}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <span className={`font-semibold text-[13px] leading-snug ${tone.text}`}>
                      {row.name}
                    </span>
                    <div className="flex items-center gap-1 flex-wrap shrink-0">
                      <TechCategoryBadge category={row.techCategory} activeCategory={activeTech} compact />
                      <span className="px-1.5 py-0.5 rounded border border-slate-700 bg-slate-900 text-[10px] text-slate-300">
                        {row.typeLabel}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded border text-[10px] font-medium ${tone.badge}`}>
                        {tone.label}
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] text-cyan-300/90 font-mono-tabular truncate">
                    {row.extra} · {row.price.toLocaleString('pt-BR')} CR
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {row.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
