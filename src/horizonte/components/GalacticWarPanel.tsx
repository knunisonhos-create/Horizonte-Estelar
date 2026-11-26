import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  Coins,
  Crown,
  Flag,
  Globe2,
  Handshake,
  Lock,
  Package,
  Rocket,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Swords,
  Target,
  Trophy,
  X,
} from 'lucide-react';
import type { PlayerCampaignState } from '../types/game';
import { FACTIONS_BY_ID } from '../data/lifeforms';
import { HULLS_BY_ID, RESOURCES_BY_ID } from '../data/items';
import { KNOWN_GALAXY_SYSTEMS } from '../data/universe';
import {
  factionMilitaryPower,
  GALACTIC_CYCLE_DURATION_SEC,
  getEffectiveSystemSummary,
  getFactionOwnedSystems,
  warAdvanceChance,
} from '../engine/galacticWar';
import {
  FACTION_RANKS,
  getAvailableFactionRivals,
  getPlayerFactionRank,
  getWildSystemsNearFaction,
  normalizeFactionCommand,
} from '../engine/factionRanks';
import { FactionCrest } from './SpriteArt';

interface GalacticWarPanelProps {
  campaign: PlayerCampaignState;
  onClose: () => void;
  onAdvanceCycle: () => void;
  onClaimSupremeCaptain?: () => void;
  onDonateWarEffort?: (resourceId: string, qty: number) => void;
  onDispatchPatrol?: (shipUid: string, targetSystemId: string) => void;
  onOrderOffensive?: (warId: string) => void;
  onExecutiveDiplomacy?: (action: 'ceasefire' | 'declare_war', targetFactionId: string) => void;
  onSetSupremeColonize?: (systemId: string | null) => void;
  onSetSupremePriorityEnemy?: (factionId: string | null) => void;
  onActivateSupremeShield?: () => void;
  tutorialSync?: {
    seq: number;
    filterMode?: 'all' | 'mine' | 'cronicas';
  };
}

export const GalacticWarPanel: React.FC<GalacticWarPanelProps> = ({
  campaign,
  onClose,
  onAdvanceCycle,
  onClaimSupremeCaptain,
  onDonateWarEffort,
  onDispatchPatrol,
  onOrderOffensive,
  onExecutiveDiplomacy,
  onSetSupremeColonize,
  onSetSupremePriorityEnemy,
  onActivateSupremeShield,
  tutorialSync,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'mine' | 'cronicas' | 'comando'>('all');

  useEffect(() => {
    if (tutorialSync?.filterMode) {
      setFilterMode(tutorialSync.filterMode);
    }
  }, [tutorialSync]);

  const chosenFaction = FACTIONS_BY_ID[campaign.chosenFactionId];
  const rankInfo = useMemo(() => getPlayerFactionRank(campaign), [campaign]);
  const factionCmd = useMemo(() => normalizeFactionCommand(campaign.factionCommand), [campaign.factionCommand]);
  const wildCandidates = useMemo(() => getWildSystemsNearFaction(campaign), [campaign]);
  const rivalFactions = useMemo(() => getAvailableFactionRivals(campaign), [campaign]);

  const reserveShips = useMemo(
    () => campaign.ships.filter((s) => s.uid !== campaign.activeShipUid),
    [campaign.ships, campaign.activeShipUid]
  );

  const patrolTargetOptions = useMemo(() => {
    return KNOWN_GALAXY_SYSTEMS.slice(0, 48).map((s) => getEffectiveSystemSummary(s, campaign));
  }, [campaign]);

  const [donateResourceId, setDonateResourceId] = useState<string>('');
  const [patrolShipUid, setPatrolShipUid] = useState<string>('');
  const [patrolSystemId, setPatrolSystemId] = useState<string>('');
  const [offensiveWarId, setOffensiveWarId] = useState<string>('');
  const [diploTargetFactionId, setDiploTargetFactionId] = useState<string>('');

  useEffect(() => {
    if (!donateResourceId || !campaign.cargo.some((c) => c.resourceId === donateResourceId)) {
      setDonateResourceId(campaign.cargo[0]?.resourceId ?? '');
    }
  }, [campaign.cargo, donateResourceId]);

  useEffect(() => {
    if (!patrolShipUid || !reserveShips.some((s) => s.uid === patrolShipUid)) {
      setPatrolShipUid(reserveShips[0]?.uid ?? '');
    }
  }, [reserveShips, patrolShipUid]);

  useEffect(() => {
    if (!patrolSystemId && patrolTargetOptions.length > 0) {
      setPatrolSystemId(patrolTargetOptions[0].id);
    }
  }, [patrolTargetOptions, patrolSystemId]);

  const chosenFactionWars = useMemo(
    () =>
      campaign.galacticWars.filter(
        (w) => w.factionAId === campaign.chosenFactionId || w.factionBId === campaign.chosenFactionId
      ),
    [campaign.galacticWars, campaign.chosenFactionId]
  );

  useEffect(() => {
    if (!offensiveWarId || !chosenFactionWars.some((w) => w.id === offensiveWarId)) {
      setOffensiveWarId(chosenFactionWars[0]?.id ?? '');
    }
  }, [chosenFactionWars, offensiveWarId]);

  useEffect(() => {
    if (!diploTargetFactionId || !rivalFactions.some((r) => r.id === diploTargetFactionId)) {
      setDiploTargetFactionId(rivalFactions[0]?.id ?? '');
    }
  }, [rivalFactions, diploTargetFactionId]);

  const activeShip =
    campaign.ships.find((s) => s.uid === campaign.activeShipUid) ?? campaign.ships[0];
  const pilotedFactionId = activeShip?.factionId ?? campaign.chosenFactionId;
  const pilotedFac = FACTIONS_BY_ID[pilotedFactionId];

  const military = useMemo(() => {
    const ids = new Set<string>();
    for (const war of campaign.galacticWars) {
      ids.add(war.factionAId);
      ids.add(war.factionBId);
    }
    const map: Record<string, number> = {};
    for (const id of ids) {
      map[id] = factionMilitaryPower(id, campaign);
    }
    return map;
  }, [campaign]);

  const ownedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (pilotedFactionId) {
      counts[pilotedFactionId] = getFactionOwnedSystems(pilotedFactionId, campaign).length;
    }
    for (const w of campaign.galacticWars) {
      if (counts[w.factionAId] === undefined) {
        counts[w.factionAId] = getFactionOwnedSystems(w.factionAId, campaign).length;
      }
      if (counts[w.factionBId] === undefined) {
        counts[w.factionBId] = getFactionOwnedSystems(w.factionBId, campaign).length;
      }
    }
    return counts;
  }, [campaign, pilotedFactionId]);

  const sortedWars = useMemo(() => {
    const list = [...campaign.galacticWars];
    list.sort((a, b) => {
      const aMine = a.factionAId === pilotedFactionId || a.factionBId === pilotedFactionId ? 1 : 0;
      const bMine = b.factionAId === pilotedFactionId || b.factionBId === pilotedFactionId ? 1 : 0;
      if (bMine !== aMine) return bMine - aMine;
      return Math.abs(b.score - 50) - Math.abs(a.score - 50);
    });
    return list;
  }, [campaign.galacticWars, pilotedFactionId]);

  const myWarsCount = useMemo(
    () =>
      sortedWars.filter(
        (w) => w.factionAId === pilotedFactionId || w.factionBId === pilotedFactionId
      ).length,
    [sortedWars, pilotedFactionId]
  );

  const visibleWars = useMemo(() => {
    if (filterMode === 'mine') {
      return sortedWars.filter(
        (w) => w.factionAId === pilotedFactionId || w.factionBId === pilotedFactionId
      );
    }
    return sortedWars;
  }, [sortedWars, pilotedFactionId, filterMode]);

  const cyclePct = Math.min(
    100,
    Math.round((campaign.cycleElapsedSec / GALACTIC_CYCLE_DURATION_SEC) * 100)
  );
  const remainingSec = Math.max(
    0,
    Math.ceil(GALACTIC_CYCLE_DURATION_SEC - campaign.cycleElapsedSec)
  );
  const remainingMin = Math.floor(remainingSec / 60);
  const remainingRemSec = remainingSec % 60;
  const remainingLabel = `${String(remainingMin).padStart(2, '0')}:${String(remainingRemSec).padStart(2, '0')}`;

  return (
    <div className="h-full flex flex-col gap-2.5 p-2.5 sm:p-3 bg-[#060a14] border-l border-slate-800 text-slate-100 select-none overflow-hidden">
      {/* CARD 1: Fixed Non-Minimizable Hero & Cycle Telemetry Card */}
      <section className="shrink-0 bg-[#0b1222] border border-slate-800 rounded-2xl p-3.5 space-y-2.5 shadow-lg">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-rose-400" />
              <h2 className="font-display text-lg font-bold text-white">Guerra Galáctica</h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Cada guerra vencida, a facção vitoriosa conquista um sistema solar do adversário.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer shrink-0"
            title="Fechar painel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cycle Countdown Bar */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-white">
                Ciclo Galáctico <span className="font-mono-tabular text-cyan-300">#{campaign.galacticCycle}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-mono-tabular">{remainingLabel}</span>
              <button
                type="button"
                onClick={onAdvanceCycle}
                className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-[11px] cursor-pointer"
              >
                Avançar Ciclo
              </button>
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all"
              style={{ width: `${cyclePct}%` }}
            />
          </div>
        </div>
      </section>

      {/* CARD 2: Filter / Tab Bar Card */}
      <section className="shrink-0 bg-[#0b1222] border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center gap-1.5 text-xs">
        <button
          type="button"
          data-tutorial-id="war-tab-all"
          onClick={() => setFilterMode('all')}
          className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors ${
            filterMode === 'all'
              ? 'bg-rose-500 text-white font-semibold'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          Todas as Frentes ({campaign.galacticWars.length})
        </button>
        <button
          type="button"
          data-tutorial-id="war-tab-mine"
          onClick={() => setFilterMode('mine')}
          className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors ${
            filterMode === 'mine'
              ? 'bg-amber-400 text-slate-950 font-semibold'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          Minha Facção ({myWarsCount})
        </button>
        <button
          type="button"
          data-tutorial-id="war-tab-cronicas"
          onClick={() => setFilterMode('cronicas')}
          className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors flex items-center gap-1 ${
            filterMode === 'cronicas'
              ? 'bg-cyan-500 text-slate-950 font-semibold'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          <Flag className="w-3.5 h-3.5" />
          Crônicas ({campaign.warHistory.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterMode('comando')}
          className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors flex items-center gap-1 ${
            filterMode === 'comando'
              ? 'bg-emerald-400 text-slate-950 font-semibold'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          Comando (Pat. {rankInfo.current.rank})
        </button>
      </section>

      {/* CARD 3: Scrollable Active Content Card */}
      <section data-tutorial-scroll="war-body" className="flex-1 min-h-0 bg-[#0b1222] border border-slate-800 rounded-2xl p-3.5 overflow-y-auto space-y-3">
        {filterMode === 'comando' ? (
          <div className="space-y-3 text-xs">
            {/* Hero Rank Card */}
            <div
              className="rounded-xl border bg-slate-950/90 p-3.5 space-y-2.5"
              style={{ borderColor: `${chosenFaction?.color ?? '#38bdf8'}66` }}
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  {chosenFaction && (
                    <FactionCrest color={chosenFaction.color} axis={chosenFaction.axis} size={36} />
                  )}
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      {chosenFaction?.name ?? campaign.chosenFactionId}
                    </div>
                    <div className="font-display text-base font-bold text-white flex items-center gap-1.5 flex-wrap">
                      {rankInfo.isSupremeCaptain ? (
                        <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                      )}
                      <span>
                        Patente {rankInfo.current.rank}: {rankInfo.current.title}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-400">Renome na Facção</div>
                  <div className="font-mono-tabular text-base font-bold text-cyan-300">
                    {rankInfo.renown}
                    {rankInfo.next ? ` / ${rankInfo.next.minRenown}` : ' (MÁX)'}
                  </div>
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all"
                  style={{ width: `${rankInfo.progressPct}%` }}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5">
                  <div className="text-slate-400 text-[10px]">Renda por Ciclo</div>
                  <div className="font-mono-tabular font-bold text-amber-300 flex items-center gap-1">
                    <Coins className="w-3 h-3" />
                    +{rankInfo.expectedCycleIncome} cr
                  </div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5">
                  <div className="text-slate-400 text-[10px]">Defesa Planetária</div>
                  <div className="font-mono-tabular font-bold text-cyan-300">
                    +{rankInfo.current.defenseBonusPct}% ({rankInfo.current.defenseShipCount} nave
                    {rankInfo.current.defenseShipCount === 1 ? '' : 's'})
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5">
                  <div className="text-slate-400 text-[10px]">Total em Tributos</div>
                  <div className="font-mono-tabular font-bold text-emerald-300">
                    {(factionCmd.totalTributeEarned ?? 0).toLocaleString('pt-BR')} cr
                  </div>
                </div>
              </div>

              {/* Supreme Captain Ascension Milestone */}
              {!rankInfo.isSupremeCaptain && (
                <div className="bg-slate-900/80 border border-amber-500/35 rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5 text-[11px]">
                    <div className="font-semibold text-amber-300 flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5" />
                      Ascensão a Capitão Supremo (Patente 7)
                    </div>
                    <div className="text-slate-300">
                      Requer <strong>650+ Renome</strong> ({rankInfo.renown}/650) e{' '}
                      <strong>1 colônia fundada</strong> ({rankInfo.coloniesFounded}/1) ou{' '}
                      <strong>3 missões da facção concluídas</strong> ({rankInfo.missionsCompleted}/3).
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={!rankInfo.canClaimSupreme || !onClaimSupremeCaptain}
                    onClick={onClaimSupremeCaptain}
                    className={`px-3 py-2 rounded-lg font-bold text-[11px] shrink-0 transition-colors ${
                      rankInfo.canClaimSupreme && onClaimSupremeCaptain
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer'
                        : 'bg-slate-950 border border-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {rankInfo.canClaimSupreme ? 'Assumir Capitania Suprema' : 'Requisitos Pendentes'}
                  </button>
                </div>
              )}
            </div>

            {/* Patente 1: Esforço de Guerra */}
            <div className="bg-slate-950/85 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Esforço de Guerra (Patente 1+)</span>
                </div>
                <span className="text-[10px] font-mono-tabular text-slate-400">
                  {rankInfo.current.rank >= 1 ? 'Desbloqueado' : 'Requer 20 Renome'}
                </span>
              </div>
              {rankInfo.current.rank < 1 ? (
                <div className="text-[11px] text-slate-400">
                  Alcance 20 de Renome para doar recursos do compartimento em troca de Renome e avanço de frente.
                </div>
              ) : campaign.cargo.length === 0 ? (
                <div className="text-[11px] text-slate-400 italic">
                  Seu compartimento de carga está vazio. Extraia ou compre minérios para contribuir.
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={donateResourceId}
                    onChange={(e) => setDonateResourceId(e.target.value)}
                    className="flex-1 min-w-[150px] bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-[11px]"
                  >
                    {campaign.cargo.map((c) => {
                      const def = RESOURCES_BY_ID[c.resourceId];
                      return (
                        <option key={c.resourceId} value={c.resourceId}>
                          {def?.name ?? c.resourceId} ({c.qty} un.)
                        </option>
                      );
                    })}
                  </select>
                  <button
                    type="button"
                    disabled={!onDonateWarEffort || !donateResourceId}
                    onClick={() => onDonateWarEffort?.(donateResourceId, 1)}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-[11px] cursor-pointer"
                  >
                    Doar 1 un.
                  </button>
                  <button
                    type="button"
                    disabled={!onDonateWarEffort || !donateResourceId}
                    onClick={() => onDonateWarEffort?.(donateResourceId, 5)}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-[11px] cursor-pointer"
                  >
                    Doar 5 un.
                  </button>
                </div>
              )}
            </div>

            {/* Patente 3: Despacho de Frota Secundária */}
            <div className="bg-slate-950/85 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Rocket className="w-3.5 h-3.5 text-sky-400" />
                  <span>Despacho de Frota Secundária (Patente 3+)</span>
                </div>
                <span className="text-[10px] font-mono-tabular text-slate-400">
                  {rankInfo.current.rank >= 3 ? 'Desbloqueado' : 'Requer 100 Renome'}
                </span>
              </div>
              {rankInfo.current.rank < 3 ? (
                <div className="text-[11px] text-slate-400">
                  Na Patente 3 (Capitão de Esquadrão), envie naves reservas em patrulha automática por 1 ciclo.
                </div>
              ) : factionCmd.activePatrol ? (
                <div className="bg-sky-950/50 border border-sky-500/45 rounded-lg px-3 py-2 text-[11px] text-sky-200">
                  <strong>{factionCmd.activePatrol.shipName}</strong> está em patrulha em{' '}
                  <strong>{factionCmd.activePatrol.targetSystemName}</strong>. Retornará com saques no próximo Ciclo Galáctico.
                </div>
              ) : reserveShips.length === 0 ? (
                <div className="text-[11px] text-slate-400 italic">
                  Você precisa ter pelo menos uma nave reserva no hangar para despachar patrulhas.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-center">
                  <select
                    value={patrolShipUid}
                    onChange={(e) => setPatrolShipUid(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-100 text-[11px]"
                  >
                    {reserveShips.map((s) => (
                      <option key={s.uid} value={s.uid}>
                        {s.customName} ({HULLS_BY_ID[s.hullId]?.name ?? s.hullId})
                      </option>
                    ))}
                  </select>
                  <select
                    value={patrolSystemId}
                    onChange={(e) => setPatrolSystemId(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-100 text-[11px]"
                  >
                    {patrolTargetOptions.map((sys) => {
                      const own = sys.controllingFactionId
                        ? FACTIONS_BY_ID[sys.controllingFactionId]?.name ?? 'Facção'
                        : 'Selvagem';
                      return (
                        <option key={sys.id} value={sys.id}>
                          {sys.name} ({own})
                        </option>
                      );
                    })}
                  </select>
                  <button
                    type="button"
                    disabled={!onDispatchPatrol || !patrolShipUid || !patrolSystemId}
                    onClick={() => onDispatchPatrol?.(patrolShipUid, patrolSystemId)}
                    className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-[11px] cursor-pointer"
                  >
                    Despachar
                  </button>
                </div>
              )}
            </div>

            {/* Patente 5: Ofensiva Coordenada */}
            <div className="bg-slate-950/85 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-rose-400" />
                  <span>Ordenar Ofensiva Coordenada (Patente 5+)</span>
                </div>
                <span className="text-[10px] font-mono-tabular text-slate-400">
                  {rankInfo.current.rank >= 5
                    ? factionCmd.lastOffensiveCycle === campaign.galacticCycle
                      ? 'Usada neste ciclo'
                      : 'Disponível (600 cr)'
                    : 'Requer 300 Renome'}
                </span>
              </div>
              {rankInfo.current.rank < 5 ? (
                <div className="text-[11px] text-slate-400">
                  Na Patente 5 (Almirante de Frota), mobilize frotas para avançar +15 pontos (+20 em Pat. 7) em uma frente ativa.
                </div>
              ) : chosenFactionWars.length === 0 ? (
                <div className="text-[11px] text-slate-400 italic">
                  Sua facção não possui guerras ativas no momento.
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={offensiveWarId}
                    onChange={(e) => setOffensiveWarId(e.target.value)}
                    className="flex-1 min-w-[160px] bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-[11px]"
                  >
                    {chosenFactionWars.map((w) => {
                      const enemyId = w.factionAId === campaign.chosenFactionId ? w.factionBId : w.factionAId;
                      return (
                        <option key={w.id} value={w.id}>
                          Contra {FACTIONS_BY_ID[enemyId]?.name ?? enemyId}
                        </option>
                      );
                    })}
                  </select>
                  <button
                    type="button"
                    disabled={
                      !onOrderOffensive ||
                      !offensiveWarId ||
                      factionCmd.lastOffensiveCycle === campaign.galacticCycle ||
                      campaign.credits < 600
                    }
                    onClick={() => onOrderOffensive?.(offensiveWarId)}
                    className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] ${
                      factionCmd.lastOffensiveCycle !== campaign.galacticCycle && campaign.credits >= 600
                        ? 'bg-rose-500 hover:bg-rose-400 text-white cursor-pointer'
                        : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Ofensiva (-600 cr)
                  </button>
                </div>
              )}
            </div>

            {/* Patente 6: Diplomacia Executiva */}
            <div className="bg-slate-950/85 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Handshake className="w-3.5 h-3.5 text-amber-400" />
                  <span>Diplomacia Executiva (Patente 6+)</span>
                </div>
                <span className="text-[10px] font-mono-tabular text-slate-400">
                  {rankInfo.current.rank >= 6
                    ? factionCmd.lastDiplomacyCycle === campaign.galacticCycle
                      ? 'Usada neste ciclo'
                      : 'Disponível (1x/ciclo)'
                    : 'Requer 450 Renome'}
                </span>
              </div>
              {rankInfo.current.rank < 6 ? (
                <div className="text-[11px] text-slate-400">
                  Na Patente 6 (Alto Comissário), negocie Cessar-Fogo imediato ou declare Guerra Aberta contra rivais.
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={diploTargetFactionId}
                    onChange={(e) => setDiploTargetFactionId(e.target.value)}
                    className="flex-1 min-w-[160px] bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-[11px]"
                  >
                    {rivalFactions.map((rf) => (
                      <option key={rf.id} value={rf.id}>
                        {rf.name} {rf.atWar ? '(Em Guerra)' : '(Em Paz)'}
                      </option>
                    ))}
                  </select>
                  {(() => {
                    const selRival = rivalFactions.find((r) => r.id === diploTargetFactionId);
                    const used = factionCmd.lastDiplomacyCycle === campaign.galacticCycle;
                    if (!selRival) return null;
                    return selRival.atWar ? (
                      <button
                        type="button"
                        disabled={!onExecutiveDiplomacy || used || campaign.credits < 900}
                        onClick={() => onExecutiveDiplomacy?.('ceasefire', selRival.id)}
                        className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] ${
                          !used && campaign.credits >= 900
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer'
                            : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Cessar-Fogo (-900 cr)
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!onExecutiveDiplomacy || used || campaign.credits < 750}
                        onClick={() => onExecutiveDiplomacy?.('declare_war', selRival.id)}
                        className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] ${
                          !used && campaign.credits >= 750
                            ? 'bg-rose-500 hover:bg-rose-400 text-white cursor-pointer'
                            : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Declarar Guerra (-750 cr)
                      </button>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Patente 7: Comando Supremo */}
            <div className="bg-slate-950/85 border border-amber-500/40 rounded-xl p-3 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Diretivas do Capitão Supremo (Patente 7)</span>
                </div>
                <span className="text-[10px] font-mono-tabular text-amber-200">
                  {rankInfo.isSupremeCaptain ? 'Líder Ativo' : 'Bloqueado'}
                </span>
              </div>
              {!rankInfo.isSupremeCaptain ? (
                <div className="text-[11px] text-slate-400">
                  Ao assumir a Capitania Suprema, defina qual sistema selvagem será colonizado no próximo ciclo, marque um inimigo prioritário (+10 pts/ciclo) e ative a Frota Capitânia defensiva.
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Globe2 className="w-3 h-3 text-emerald-400" />
                      Alvo de Colonização da Facção (Próximo Ciclo)
                    </label>
                    <select
                      value={factionCmd.supremeColonizeSystemId ?? ''}
                      onChange={(e) => onSetSupremeColonize?.(e.target.value || null)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-[11px]"
                    >
                      <option value="">Automático (fronteira mais próxima)</option>
                      {wildCandidates.map((ws) => (
                        <option key={ws.id} value={ws.id}>
                          {ws.name} (Nv Tec {ws.techLevel})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Target className="w-3 h-3 text-rose-400" />
                      Frente de Guerra Prioritária (+10 pts/ciclo)
                    </label>
                    <select
                      value={factionCmd.supremePriorityEnemyFactionId ?? ''}
                      onChange={(e) => onSetSupremePriorityEnemy?.(e.target.value || null)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-[11px]"
                    >
                      <option value="">Sem foco prioritário</option>
                      {rivalFactions
                        .filter((r) => r.atWar)
                        .map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="text-[11px] text-slate-300">
                      Frota Capitânia Defensiva: impede recuo das frentes neste ciclo.
                    </div>
                    <button
                      type="button"
                      disabled={
                        !onActivateSupremeShield ||
                        factionCmd.supremeShieldCycle === campaign.galacticCycle
                      }
                      onClick={onActivateSupremeShield}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] shrink-0 flex items-center gap-1 ${
                        factionCmd.supremeShieldCycle === campaign.galacticCycle
                          ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 cursor-default'
                          : 'bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {factionCmd.supremeShieldCycle === campaign.galacticCycle
                        ? 'Bloqueio Ativo'
                        : 'Ativar Frota Capitânia'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Hierarquia Completa 1..7 */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Hierarquia de Patentes da Facção
              </div>
              {FACTION_RANKS.filter((r) => r.rank > 0).map((r) => {
                const unlocked = rankInfo.current.rank >= r.rank;
                const isCur = rankInfo.current.rank === r.rank;
                return (
                  <div
                    key={r.rank}
                    className={`rounded-xl border px-3 py-2 space-y-1 ${
                      isCur
                        ? 'bg-cyan-950/40 border-cyan-400/70'
                        : unlocked
                          ? 'bg-slate-950/80 border-emerald-500/35'
                          : 'bg-slate-950/60 border-slate-800/80 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        {unlocked ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        )}
                        <span>
                          Patente {r.rank} · {r.title}
                        </span>
                      </div>
                      <span className="font-mono-tabular text-[10px] text-cyan-300">
                        {r.minRenown}+ Renome
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300">{r.tacticalSummary}</div>
                    <div className="text-[10px] text-amber-300/90">{r.economySummary}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : filterMode === 'cronicas' ? (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
              <Flag className="w-3.5 h-3.5" />
              <span>Crônicas de Fronteira & Conquistas</span>
            </div>
            {campaign.warHistory.length === 0 ? (
              <div className="text-xs text-slate-400 italic bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-center">
                Nenhuma conquista ou colonização registrada ainda.
              </div>
            ) : (
              <div className="space-y-1.5">
                {campaign.warHistory.slice(0, 30).map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-slate-950/85 border border-slate-800 rounded-xl px-3 py-2 text-[11px] flex items-start gap-2"
                  >
                    {entry.kind === 'colonizacao' ? (
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-mono-tabular text-[10px] text-cyan-400 mr-1.5">
                        [Ciclo {entry.cycle}]
                      </span>
                      <span className="text-slate-200">{entry.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : visibleWars.length === 0 ? (
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-6 text-center space-y-2">
            <ShieldAlert className="w-8 h-8 text-slate-500 mx-auto" />
            <div className="text-sm font-semibold text-slate-200">
              {filterMode === 'mine'
                ? 'A facção da nave pilotada está em paz no momento.'
                : 'Nenhuma frente de guerra ativa no momento.'}
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {visibleWars.map((war) => {
              const facA = FACTIONS_BY_ID[war.factionAId];
              const facB = FACTIONS_BY_ID[war.factionBId];
              if (!facA || !facB) return null;

              const sysCountA = ownedCounts[war.factionAId] ?? 0;
              const sysCountB = ownedCounts[war.factionBId] ?? 0;
              const involvesPlayer =
                war.factionAId === pilotedFactionId || war.factionBId === pilotedFactionId;

              const chanceA = warAdvanceChance(military[war.factionAId] ?? 0, military[war.factionBId] ?? 0);
              const chanceB = 1 - chanceA;
              const score = Math.max(0, Math.min(100, war.score));

              const advancerFac =
                typeof war.lastDelta === 'number' && war.lastDelta !== 0
                  ? war.lastDelta > 0
                    ? facA
                    : facB
                  : null;

              const leftPct = Math.max(0, Math.min(100, 100 - score));
              const rightPct = 100 - leftPct;

              return (
                <div
                  key={war.id}
                  className="bg-slate-950/85 border rounded-xl p-3 space-y-2.5"
                  style={{
                    borderColor: involvesPlayer
                      ? `${pilotedFac?.color ?? '#fbbf24'}99`
                      : 'rgb(30 41 59)',
                  }}
                >
                  {involvesPlayer && (
                    <div className="flex items-center justify-between text-[10px] font-semibold">
                      <span
                        className="px-2 py-0.5 rounded border"
                        style={{
                          color: pilotedFac?.color ?? '#fbbf24',
                          borderColor: `${pilotedFac?.color ?? '#fbbf24'}66`,
                          backgroundColor: `${pilotedFac?.color ?? '#fbbf24'}1a`,
                        }}
                      >
                        Facção da Nave Pilotada
                      </span>
                      <span className="text-slate-400">Frente Prioritária</span>
                    </div>
                  )}

                  {/* Faction VS Header */}
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FactionCrest color={facB.color} axis={facB.axis} size={30} />
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate" style={{ color: facB.color }}>
                          {facB.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono-tabular flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-0.5">
                            <Globe2 className="w-3 h-3 text-slate-500" />
                            {sysCountB}
                          </span>
                          <span className="text-amber-200">Poder {military[war.factionBId] ?? 0}</span>
                          <span className="inline-flex items-center gap-0.5 text-amber-300">
                            <Trophy className="w-3 h-3 text-amber-400" />
                            {war.capturesB}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono-tabular font-bold text-rose-400">
                      ×
                    </div>

                    <div className="flex items-center justify-end gap-2 min-w-0 text-right">
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate" style={{ color: facA.color }}>
                          {facA.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono-tabular flex flex-wrap items-center justify-end gap-1.5">
                          <span className="inline-flex items-center gap-0.5 text-amber-300">
                            {war.capturesA}
                            <Trophy className="w-3 h-3 text-amber-400" />
                          </span>
                          <span className="text-amber-200">Poder {military[war.factionAId] ?? 0}</span>
                          <span className="inline-flex items-center gap-0.5">
                            {sysCountA}
                            <Globe2 className="w-3 h-3 text-slate-500" />
                          </span>
                        </div>
                      </div>
                      <FactionCrest color={facA.color} axis={facA.axis} size={30} />
                    </div>
                  </div>

                  {/* Frontline Tug-of-War Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tabular font-semibold">
                      <span style={{ color: facB.color }}>{leftPct}%</span>
                      <span style={{ color: facA.color }}>{rightPct}%</span>
                    </div>

                    <div className="relative w-full h-4 rounded-full bg-slate-900 border border-slate-700/90 overflow-hidden flex">
                      <div
                        className="h-full transition-all duration-300"
                        style={{ width: `${leftPct}%`, backgroundColor: facB.color }}
                      />
                      <div
                        className="h-full transition-all duration-300"
                        style={{ width: `${rightPct}%`, backgroundColor: facA.color }}
                      />
                      <div
                        className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.95)] -translate-x-1/2 transition-all duration-300"
                        style={{ left: `${leftPct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2 text-[10px]">
                      <span className="font-mono-tabular font-semibold" style={{ color: facB.color }}>
                        {Math.round(chanceB * 100)}%
                      </span>
                      <span className="text-slate-200 font-medium truncate">Chance de avanço</span>
                      <span className="font-mono-tabular font-semibold" style={{ color: facA.color }}>
                        {Math.round(chanceA * 100)}%
                      </span>
                    </div>
                  </div>

                  {advancerFac && typeof war.lastDelta === 'number' && (
                    <div className="text-[10px] text-slate-400 flex items-center justify-between bg-slate-900/75 border border-slate-800 rounded-lg px-2.5 py-1">
                      <span className="truncate">{war.lastSummary ?? 'Frente equilibrada'}</span>
                      <span
                        className="font-mono-tabular font-semibold shrink-0 ml-2"
                        style={{ color: advancerFac.color }}
                      >
                        +{Math.abs(war.lastDelta)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
