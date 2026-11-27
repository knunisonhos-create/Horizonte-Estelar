import type {
  FactionCommandState,
  LogEntry,
  PlanetData,
  PlayerCampaignState,
  Rank3ResourceCollectionState,
  Rank3WarAbilityChoice,
  ResourceCargoRecord,
  ResourceDef,
  StarSystemFull,
  StarSystemSummary,
} from '../types/game';
import { FACTIONS, FACTIONS_BY_ID } from '../data/lifeforms';
import { HULLS_BY_ID, RESOURCES, RESOURCES_BY_ID } from '../data/items';
import { generateSolarSystem, getSystemSummaryById, KNOWN_GALAXY_SYSTEMS } from '../data/universe';
import {
  advanceGalacticCycle,
  applyWarMissionProgressToWars,
  buildGalacticWarsFromActiveMap,
  getEffectiveSystemSummary,
  getFactionOwnedSystems,
  makeWarLogEntry,
  SUPREME_CAPTAIN_MIN_RENOWN,
  syncActiveWarsMap,
} from './galacticWar';
import {
  computeCrewBonuses,
  computeCrewEquipmentMaintenance,
  computeShipDerivedStats,
  computeShipTechLevel,
  compartmentUsed,
} from './combat';
import { normalizeFactionVault } from './factionVault';

export interface FactionRankDef {
  rank: number; // 0..7
  title: string;
  minRenown: number;
  defenseBonusPct: number;
  defenseShipCount: number;
  cycleSalary: number;
  tributePerSystem: number;
  missionCommissionPct: number;
  scanBountyCredits: number;
  killBountyPct: number;
  tacticalSummary: string;
  economySummary: string;
}

export const FACTION_RANKS: FactionRankDef[] = [
  {
    rank: 0,
    title: 'Civil / Sem Patente',
    minRenown: -9999,
    defenseBonusPct: 0,
    defenseShipCount: 0,
    cycleSalary: 0,
    tributePerSystem: 0,
    missionCommissionPct: 0,
    scanBountyCredits: 0,
    killBountyPct: 0,
    tacticalSummary: 'Sem autoridade militar na facção.',
    economySummary: 'Sem soldo ou tributo territorial.',
  },
  {
    rank: 1,
    title: 'Recruta',
    minRenown: 20,
    defenseBonusPct: 0,
    defenseShipCount: 0,
    cycleSalary: 60,
    tributePerSystem: 0,
    missionCommissionPct: 5,
    scanBountyCredits: 0,
    killBountyPct: 0,
    tacticalSummary: 'Licença automática de extração + acesso ao Esforço de Guerra.',
    economySummary: 'Soldo de 60 cr/ciclo + 5% comissão em missões da facção.',
  },
  {
    rank: 2,
    title: 'Oficial de Campo',
    minRenown: 50,
    defenseBonusPct: 10,
    defenseShipCount: 1,
    cycleSalary: 140,
    tributePerSystem: 0,
    missionCommissionPct: 10,
    scanBountyCredits: 40,
    killBountyPct: 15,
    tacticalSummary: 'Botão em combate: Chamar Defesa Planetária (+10% em Ataque, Escudo e Defesa; 1 nave aliada).',
    economySummary: 'Soldo de 140 cr/ciclo + +15% prêmio de abate no território.',
  },
  {
    rank: 3,
    title: 'Capitão de Esquadrão',
    minRenown: 100,
    defenseBonusPct: 20,
    defenseShipCount: 2,
    cycleSalary: 280,
    tributePerSystem: 0,
    missionCommissionPct: 15,
    scanBountyCredits: 65,
    killBountyPct: 25,
    tacticalSummary: 'Defesa Planetária +20% (2 naves) + Escolha Patente 3: Esquadrão (+1%×nível, até 3 naves) ou Coleta Estratégica.',
    economySummary: 'Soldo de 280 cr/ciclo + bônus de Esquadrão ou coleta de recursos raros/épicos/lendários nos sistemas da facção.',
  },
  {
    rank: 4,
    title: 'Comandante de Setor',
    minRenown: 180,
    defenseBonusPct: 30,
    defenseShipCount: 2,
    cycleSalary: 480,
    tributePerSystem: 15,
    missionCommissionPct: 22,
    scanBountyCredits: 110,
    killBountyPct: 35,
    tacticalSummary: 'Defesa Planetária +30% + Scanner do Sistema Solar no Mapa Galáctico (varredura remota e recursos dos planetas da sua facção).',
    economySummary: 'Soldo 480 cr + 15 cr/sistema + 110 cr por planeta escaneado.',
  },
  {
    rank: 5,
    title: 'Almirante de Frota',
    minRenown: 300,
    defenseBonusPct: 40,
    defenseShipCount: 3,
    cycleSalary: 780,
    tributePerSystem: 30,
    missionCommissionPct: 30,
    scanBountyCredits: 150,
    killBountyPct: 50,
    tacticalSummary: 'Defesa Planetária +40% (3 naves) + Ordenar Ofensiva na Guerra Galáctica (1x por ciclo).',
    economySummary: 'Soldo 780 cr + 30 cr/sistema + +50% recompensa de abate em território.',
  },
  {
    rank: 6,
    title: 'Alto Comissário',
    minRenown: 450,
    defenseBonusPct: 50,
    defenseShipCount: 3,
    cycleSalary: 1150,
    tributePerSystem: 50,
    missionCommissionPct: 40,
    scanBountyCredits: 200,
    killBountyPct: 65,
    tacticalSummary: 'Defesa Planetária +50% + Diplomacia Executiva (Cessar-Fogo ou Declarar Guerra, 1x/ciclo).',
    economySummary: 'Soldo 1.150 cr + 50 cr de tributo por cada sistema da facção.',
  },
  {
    rank: 7,
    title: 'Capitão Supremo',
    minRenown: SUPREME_CAPTAIN_MIN_RENOWN,
    defenseBonusPct: 60,
    defenseShipCount: 4,
    cycleSalary: 1650,
    tributePerSystem: 85,
    missionCommissionPct: 55,
    scanBountyCredits: 260,
    killBountyPct: 85,
    tacticalSummary: 'Defesa Planetária +60% (4 naves) + Comando Supremo (escolher colonização, frente prioritária e bloqueio defensivo).',
    economySummary: 'Soldo 1.650 cr + Tributo Pleno (85 cr/sistema + recursos estratégicos por ciclo).',
  },
];

export function emptyFactionCommand(): FactionCommandState {
  return {
    supremeCaptainFactionIds: [],
    activePatrol: null,
    rank3Choice: null,
    squadronShipUids: [],
    resourceCollection: null,
    supremeColonizeSystemId: null,
    supremePriorityEnemyFactionId: null,
    totalTributeEarned: 0,
  };
}

export function normalizeFactionCommand(raw: unknown): FactionCommandState {
  if (!raw || typeof raw !== 'object') return emptyFactionCommand();
  const obj = raw as Partial<FactionCommandState>;
  const supremeCaptainFactionIds = Array.isArray(obj.supremeCaptainFactionIds)
    ? obj.supremeCaptainFactionIds.filter((id): id is string => typeof id === 'string' && id.length > 0)
    : [];
  const rawPatrol = obj.activePatrol;
  const activePatrol =
    rawPatrol &&
    typeof rawPatrol === 'object' &&
    typeof rawPatrol.shipUid === 'string' &&
    typeof rawPatrol.targetSystemId === 'string' &&
    typeof rawPatrol.factionId === 'string'
      ? {
          shipUid: rawPatrol.shipUid,
          shipName: typeof rawPatrol.shipName === 'string' ? rawPatrol.shipName : 'Nave de Escolta',
          targetSystemId: rawPatrol.targetSystemId,
          targetSystemName:
            typeof rawPatrol.targetSystemName === 'string' ? rawPatrol.targetSystemName : 'Setor',
          startedCycle: Number.isFinite(rawPatrol.startedCycle) ? Number(rawPatrol.startedCycle) : 1,
          factionId: rawPatrol.factionId,
        }
      : null;

  const rank3Choice: Rank3WarAbilityChoice | null =
    obj.rank3Choice === 'esquadrao' || obj.rank3Choice === 'coleta' ? obj.rank3Choice : null;
  const squadronShipUids = Array.isArray(obj.squadronShipUids)
    ? Array.from(new Set(obj.squadronShipUids.filter((id): id is string => typeof id === 'string' && id.length > 0))).slice(0, 3)
    : [];
  const rawCol = obj.resourceCollection;
  const resourceCollection: Rank3ResourceCollectionState | null =
    rawCol &&
    typeof rawCol === 'object' &&
    typeof rawCol.resourceId === 'string' &&
    rawCol.resourceId.length > 0 &&
    Array.isArray(rawCol.shipUids)
      ? {
          resourceId: rawCol.resourceId,
          shipUids: Array.from(
            new Set(rawCol.shipUids.filter((id): id is string => typeof id === 'string' && id.length > 0))
          ).slice(0, 3),
          factionId: typeof rawCol.factionId === 'string' ? rawCol.factionId : '',
        }
      : null;

  return {
    supremeCaptainFactionIds,
    lastOffensiveCycle: Number.isFinite(obj.lastOffensiveCycle) ? Number(obj.lastOffensiveCycle) : undefined,
    lastDiplomacyCycle: Number.isFinite(obj.lastDiplomacyCycle) ? Number(obj.lastDiplomacyCycle) : undefined,
    activePatrol,
    rank3Choice,
    squadronShipUids,
    resourceCollection,
    supremeColonizeSystemId:
      typeof obj.supremeColonizeSystemId === 'string' && obj.supremeColonizeSystemId
        ? obj.supremeColonizeSystemId
        : null,
    supremePriorityEnemyFactionId:
      typeof obj.supremePriorityEnemyFactionId === 'string' && obj.supremePriorityEnemyFactionId
        ? obj.supremePriorityEnemyFactionId
        : null,
    supremeShieldCycle: Number.isFinite(obj.supremeShieldCycle) ? Number(obj.supremeShieldCycle) : undefined,
    totalTributeEarned: Number.isFinite(obj.totalTributeEarned) ? Number(obj.totalTributeEarned) : 0,
  };
}

export interface PlayerFactionRankInfo {
  factionId: string;
  renown: number;
  current: FactionRankDef;
  next: FactionRankDef | null;
  progressPct: number;
  ownedSystemsCount: number;
  expectedCycleIncome: number;
  milestoneMet: boolean;
  coloniesFounded: number;
  missionsCompleted: number;
  isSupremeCaptain: boolean;
  canClaimSupreme: boolean;
}

export function getAscensionMilestoneStatus(
  campaign: PlayerCampaignState,
  factionId: string
): { met: boolean; coloniesFounded: number; missionsCompleted: number } {
  const coloniesFounded = Object.values(campaign.planetOverrides ?? {}).filter(
    (ov) => ov?.colonizedByPlayer && (!ov.factionId || ov.factionId === factionId)
  ).length;
  const missionsCompleted = (campaign.missions ?? []).filter(
    (m) => m.status === 'finalizada' && m.issuerFactionId === factionId
  ).length;
  return {
    met: coloniesFounded >= 1 || missionsCompleted >= 3,
    coloniesFounded,
    missionsCompleted,
  };
}

export function getPlayerFactionRank(
  campaign: PlayerCampaignState,
  factionId: string = campaign.chosenFactionId
): PlayerFactionRankInfo {
  const renown = campaign.factionRenown[factionId] ?? 0;
  const cmd = normalizeFactionCommand(campaign.factionCommand);
  const claimedSupreme = cmd.supremeCaptainFactionIds.includes(factionId) && renown >= FACTION_RANKS[7].minRenown;
  const milestone = getAscensionMilestoneStatus(campaign, factionId);

  let current = FACTION_RANKS[0];
  for (const r of FACTION_RANKS) {
    if (r.rank === 7) {
      if (claimedSupreme) current = r;
    } else if (renown >= r.minRenown) {
      current = r;
    }
  }

  const next = FACTION_RANKS.find((r) => r.rank === current.rank + 1) ?? null;
  let progressPct = 100;
  if (next) {
    const floor = current.rank === 0 ? 0 : current.minRenown;
    const span = Math.max(1, next.minRenown - floor);
    progressPct = Math.max(0, Math.min(100, Math.round(((renown - floor) / span) * 100)));
  }

  const ownedSystemsCount = getFactionOwnedSystems(factionId, campaign).length;
  const expectedCycleIncome = current.cycleSalary + current.tributePerSystem * ownedSystemsCount;
  const canClaimSupreme = !claimedSupreme && renown >= FACTION_RANKS[7].minRenown && milestone.met;

  return {
    factionId,
    renown,
    current,
    next,
    progressPct,
    ownedSystemsCount,
    expectedCycleIncome,
    milestoneMet: milestone.met,
    coloniesFounded: milestone.coloniesFounded,
    missionsCompleted: milestone.missionsCompleted,
    isSupremeCaptain: current.rank === 7,
    canClaimSupreme,
  };
}

function makeRankLog(
  category: LogEntry['category'],
  text: string,
  timestamp: number
): LogEntry {
  return {
    id: `log_rank_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp,
    category,
    text,
  };
}

export function claimSupremeCaptaincy(campaign: PlayerCampaignState): {
  ok: boolean;
  state: PlayerCampaignState;
  message: string;
} {
  const info = getPlayerFactionRank(campaign);
  if (info.isSupremeCaptain) {
    return { ok: false, state: campaign, message: 'Você já ocupa o posto de Capitão Supremo.' };
  }
  if (info.renown < FACTION_RANKS[7].minRenown) {
    return {
      ok: false,
      state: campaign,
      message: `São necessários ${FACTION_RANKS[7].minRenown} pontos de Renome na facção.`,
    };
  }
  if (!info.milestoneMet) {
    return {
      ok: false,
      state: campaign,
      message: 'Cumpra o marco de ascensão: funde 1 colônia ou conclua 3 missões pela facção.',
    };
  }

  const cmd = normalizeFactionCommand(campaign.factionCommand);
  const facName = FACTIONS_BY_ID[info.factionId]?.name ?? info.factionId;
  const nextCmd: FactionCommandState = {
    ...cmd,
    supremeCaptainFactionIds: Array.from(new Set([...cmd.supremeCaptainFactionIds, info.factionId])),
  };
  const msg = `Ascensão Histórica! Você foi nomeado Capitão Supremo de ${facName}!`;

  return {
    ok: true,
    message: msg,
    state: {
      ...campaign,
      factionCommand: nextCmd,
      warHistory: [
        makeWarLogEntry(campaign.galacticCycle, 'batalha', msg),
        ...campaign.warHistory,
      ].slice(0, 60),
      logbook: [...campaign.logbook, makeRankLog('diplomacia', msg, campaign.gameTimeSeconds)],
    },
  };
}

export function donateResourceToWarEffort(
  campaign: PlayerCampaignState,
  resourceId: string,
  qty: number
): { ok: boolean; state: PlayerCampaignState; message: string } {
  const rankInfo = getPlayerFactionRank(campaign);
  if (rankInfo.current.rank < 1) {
    return {
      ok: false,
      state: campaign,
      message: 'Alcance Patente 1 (Recruta · 20 Renome) para contribuir ao Esforço de Guerra.',
    };
  }
  const row = campaign.cargo.find((c) => c.resourceId === resourceId);
  const resDef = RESOURCES_BY_ID[resourceId];
  const amount = Math.min(row?.qty ?? 0, Math.max(1, Math.floor(qty)));
  if (!row || !resDef || amount <= 0) {
    return { ok: false, state: campaign, message: 'Recurso indisponível no compartimento.' };
  }

  const rarityValue =
    resDef.rarity === 'lendário'
      ? 14
      : resDef.rarity === 'épico'
        ? 10
        : resDef.rarity === 'raro'
          ? 7
          : resDef.rarity === 'incomum'
            ? 4
            : 2;
  const renownGain = Math.max(2, Math.round(amount * rarityValue * 0.65));
  const nextCargo = campaign.cargo
    .map((c) => (c.resourceId === resourceId ? { ...c, qty: c.qty - amount } : c))
    .filter((c) => c.qty > 0);

  const facId = campaign.chosenFactionId;
  const facName = FACTIONS_BY_ID[facId]?.name ?? facId;
  let nextState: PlayerCampaignState = {
    ...campaign,
    cargo: nextCargo,
    factionRenown: {
      ...campaign.factionRenown,
      [facId]: (campaign.factionRenown[facId] ?? 0) + renownGain,
    },
    logbook: [
      ...campaign.logbook,
      makeRankLog(
        'diplomacia',
        `Esforço de Guerra (${facName}): doados ${amount}× ${resDef.name} (+${renownGain} Renome).`,
        campaign.gameTimeSeconds
      ),
    ],
  };

  // Small boost to one active war of chosen faction if donating strategic cargo
  const myWar = nextState.galacticWars.find(
    (w) => w.factionAId === facId || w.factionBId === facId
  );
  if (myWar) {
    const enemyId = myWar.factionAId === facId ? myWar.factionBId : myWar.factionAId;
    const pts = Math.max(1, Math.min(6, Math.round((amount * rarityValue) / 14)));
    nextState = applyWarMissionProgressToWars(
      nextState,
      facId,
      enemyId,
      pts,
      `Suprimentos entregues ao Esforço de Guerra de ${facName} (+${pts} na frente).`
    ).nextCampaign;
  }

  return {
    ok: true,
    state: nextState,
    message: `Doados ${amount}× ${resDef.name} para ${facName}: +${renownGain} Renome!`,
  };
}

export function dispatchReserveShipPatrol(
  campaign: PlayerCampaignState,
  shipUid: string,
  targetSystemId: string
): { ok: boolean; state: PlayerCampaignState; message: string } {
  const rankInfo = getPlayerFactionRank(campaign);
  if (rankInfo.current.rank < 3) {
    return {
      ok: false,
      state: campaign,
      message: 'Requer Patente 3 (Capitão de Esquadrão · 100 Renome) para despachar frota secundária.',
    };
  }
  const cmd = normalizeFactionCommand(campaign.factionCommand);
  if (cmd.activePatrol) {
    return {
      ok: false,
      state: campaign,
      message: `A nave ${cmd.activePatrol.shipName} já está em patrulha até o fim deste ciclo.`,
    };
  }
  if (shipUid === campaign.activeShipUid) {
    return { ok: false, state: campaign, message: 'Escolha uma nave reserva, não a nave que você pilota.' };
  }
  const ship = campaign.ships.find((s) => s.uid === shipUid);
  if (!ship) {
    return { ok: false, state: campaign, message: 'Nave reserva não encontrada na frota.' };
  }
  const rawSys = getSystemSummaryById(targetSystemId);
  if (!rawSys) {
    return { ok: false, state: campaign, message: 'Sistema de patrulha inválido.' };
  }
  const sys = getEffectiveSystemSummary(rawSys, campaign);
  const facId = campaign.chosenFactionId;

  const nextCmd: FactionCommandState = {
    ...cmd,
    activePatrol: {
      shipUid: ship.uid,
      shipName: ship.customName,
      targetSystemId: sys.id,
      targetSystemName: sys.name,
      startedCycle: campaign.galacticCycle,
      factionId: facId,
    },
  };

  return {
    ok: true,
    message: `${ship.customName} despachada em patrulha para ${sys.name}. Retornará no próximo ciclo!`,
    state: {
      ...campaign,
      factionCommand: nextCmd,
      logbook: [
        ...campaign.logbook,
        makeRankLog(
          'viagem',
          `Frota Secundária: ${ship.customName} enviada em patrulha tática para ${sys.name}.`,
          campaign.gameTimeSeconds
        ),
      ],
    },
  };
}

const STRATEGIC_RARITIES = new Set<ResourceDef['rarity']>(['raro', 'épico', 'lendário']);
const RARITY_SORT_ORDER: Record<ResourceDef['rarity'], number> = {
  lendário: 0,
  épico: 1,
  raro: 2,
  incomum: 3,
  comum: 4,
};

export function getRank3CollectibleResources(
  campaign: PlayerCampaignState,
  factionId: string = campaign.chosenFactionId
): Array<{ resource: ResourceDef; planetCount: number }> {
  const ownedSystems = getFactionOwnedSystems(factionId, campaign);
  const planetSets = new Map<string, Set<string>>();

  for (const sysSummary of ownedSystems) {
    const full = generateSolarSystem(sysSummary);
    for (const planet of full.planets) {
      const lv = campaign.planetOverrides?.[planet.id]?.level ?? planet.level;
      if (lv < 0) continue;
      for (const dep of planet.deposits) {
        const res = RESOURCES_BY_ID[dep.resourceId];
        if (!res || !STRATEGIC_RARITIES.has(res.rarity)) continue;
        let set = planetSets.get(res.id);
        if (!set) {
          set = new Set<string>();
          planetSets.set(res.id, set);
        }
        set.add(planet.id);
      }
    }
  }

  return RESOURCES.filter((r) => STRATEGIC_RARITIES.has(r.rarity))
    .map((resource) => ({
      resource,
      planetCount: planetSets.get(resource.id)?.size ?? 0,
    }))
    .sort((a, b) => {
      if ((b.planetCount > 0 ? 1 : 0) !== (a.planetCount > 0 ? 1 : 0)) {
        return (b.planetCount > 0 ? 1 : 0) - (a.planetCount > 0 ? 1 : 0);
      }
      if (b.planetCount !== a.planetCount) return b.planetCount - a.planetCount;
      const ra = RARITY_SORT_ORDER[a.resource.rarity] ?? 9;
      const rb = RARITY_SORT_ORDER[b.resource.rarity] ?? 9;
      if (ra !== rb) return ra - rb;
      return a.resource.name.localeCompare(b.resource.name, 'pt-BR');
    });
}

export function chooseRank3WarMode(
  campaign: PlayerCampaignState,
  mode: Rank3WarAbilityChoice
): { ok: boolean; state: PlayerCampaignState; message: string } {
  const rankInfo = getPlayerFactionRank(campaign);
  if (rankInfo.current.rank < 3) {
    return {
      ok: false,
      state: campaign,
      message: 'Requer Patente 3 (Capitão de Esquadrão · 100 Renome).',
    };
  }
  const cmd = normalizeFactionCommand(campaign.factionCommand);
  const nextCmd: FactionCommandState = {
    ...cmd,
    rank3Choice: mode,
  };
  const label =
    mode === 'esquadrao'
      ? 'Modo de Patente 3 definido para Esquadrão de Escolta (até 3 naves seguindo você).'
      : 'Modo de Patente 3 definido para Coleta Estratégica de Recursos nos sistemas da facção.';
  return {
    ok: true,
    message: label,
    state: {
      ...campaign,
      factionCommand: nextCmd,
    },
  };
}

export function toggleSquadronShip(
  campaign: PlayerCampaignState,
  shipUid: string
): { ok: boolean; state: PlayerCampaignState; message: string } {
  const rankInfo = getPlayerFactionRank(campaign);
  if (rankInfo.current.rank < 3) {
    return {
      ok: false,
      state: campaign,
      message: 'Requer Patente 3 (Capitão de Esquadrão · 100 Renome).',
    };
  }
  if (shipUid === campaign.activeShipUid) {
    return { ok: false, state: campaign, message: 'A nave que você pilota já lidera o esquadrão.' };
  }
  const ship = campaign.ships.find((s) => s.uid === shipUid);
  if (!ship) {
    return { ok: false, state: campaign, message: 'Nave reserva não encontrada.' };
  }
  const cmd = normalizeFactionCommand(campaign.factionCommand);
  if (cmd.activePatrol?.shipUid === shipUid) {
    return { ok: false, state: campaign, message: 'Esta nave está finalizando uma patrulha neste ciclo.' };
  }

  const currentList = (cmd.squadronShipUids ?? []).filter(
    (id) => id !== campaign.activeShipUid && campaign.ships.some((s) => s.uid === id)
  );
  const exists = currentList.includes(shipUid);
  let nextList: string[];
  if (exists) {
    nextList = currentList.filter((id) => id !== shipUid);
  } else {
    if (currentList.length >= 3) {
      return {
        ok: false,
        state: campaign,
        message: 'O Esquadrão comporta no máximo 3 naves vinculadas.',
      };
    }
    nextList = [...currentList, shipUid];
  }

  const nextCollection = cmd.resourceCollection
    ? {
        ...cmd.resourceCollection,
        shipUids: cmd.resourceCollection.shipUids.filter((id) => !nextList.includes(id)),
      }
    : null;

  const shipLv = computeShipTechLevel(ship);
  return {
    ok: true,
    message: exists
      ? `${ship.customName} removida do Esquadrão.`
      : `${ship.customName} (Nível ${shipLv}) vinculada ao Esquadrão: +${shipLv}% em Ataque e Escudo!`,
    state: {
      ...campaign,
      factionCommand: {
        ...cmd,
        rank3Choice: 'esquadrao',
        squadronShipUids: nextList,
        resourceCollection: nextCollection && nextCollection.shipUids.length > 0 ? nextCollection : null,
      },
    },
  };
}

export function configureResourceCollection(
  campaign: PlayerCampaignState,
  shipUids: string[],
  resourceId: string
): { ok: boolean; state: PlayerCampaignState; message: string } {
  const rankInfo = getPlayerFactionRank(campaign);
  if (rankInfo.current.rank < 3) {
    return {
      ok: false,
      state: campaign,
      message: 'Requer Patente 3 (Capitão de Esquadrão · 100 Renome).',
    };
  }
  const resDef = RESOURCES_BY_ID[resourceId];
  if (!resDef || !STRATEGIC_RARITIES.has(resDef.rarity)) {
    return {
      ok: false,
      state: campaign,
      message: 'Escolha 1 recurso raro, épico ou lendário para a coleta da facção.',
    };
  }
  const cmd = normalizeFactionCommand(campaign.factionCommand);
  const validUids = Array.from(
    new Set(
      shipUids.filter(
        (id) =>
          id !== campaign.activeShipUid &&
          id !== cmd.activePatrol?.shipUid &&
          campaign.ships.some((s) => s.uid === id)
      )
    )
  ).slice(0, 3);

  const nextSquadron = (cmd.squadronShipUids ?? []).filter((id) => !validUids.includes(id));
  const nextCollection: Rank3ResourceCollectionState | null =
    validUids.length > 0
      ? {
          resourceId,
          shipUids: validUids,
          factionId: campaign.chosenFactionId,
        }
      : {
          resourceId,
          shipUids: [],
          factionId: campaign.chosenFactionId,
        };

  const divisor = validUids.length >= 3 ? 1 : validUids.length === 2 ? 2 : 3;
  const planetCount =
    getRank3CollectibleResources(campaign, campaign.chosenFactionId).find((r) => r.resource.id === resourceId)
      ?.planetCount ?? 0;
  const estYield = validUids.length > 0 ? Math.floor(planetCount / divisor) : 0;

  return {
    ok: true,
    message:
      validUids.length > 0
        ? `Coleta Estratégica configurada: ${validUids.length} nave(s) buscando ${resDef.name} (${estYield} un./ciclo).`
        : `Alvo de coleta alterado para ${resDef.name}. Vincule 1 a 3 naves reservas para iniciar a coleta.`,
    state: {
      ...campaign,
      factionCommand: {
        ...cmd,
        rank3Choice: 'coleta',
        squadronShipUids: nextSquadron,
        resourceCollection: nextCollection,
      },
    },
  };
}

export function orderCoordinatedOffensive(
  campaign: PlayerCampaignState,
  warId: string
): { ok: boolean; state: PlayerCampaignState; message: string } {
  const rankInfo = getPlayerFactionRank(campaign);
  if (rankInfo.current.rank < 5) {
    return {
      ok: false,
      state: campaign,
      message: 'Requer Patente 5 (Almirante de Frota · 300 Renome).',
    };
  }
  const cmd = normalizeFactionCommand(campaign.factionCommand);
  if (cmd.lastOffensiveCycle === campaign.galacticCycle) {
    return {
      ok: false,
      state: campaign,
      message: 'Você já ordenou uma Ofensiva Coordenada neste ciclo galáctico.',
    };
  }
  const facId = campaign.chosenFactionId;
  const war = campaign.galacticWars.find(
    (w) => w.id === warId && (w.factionAId === facId || w.factionBId === facId)
  );
  if (!war) {
    return { ok: false, state: campaign, message: 'Frente de guerra não encontrada.' };
  }
  const cost = 600;
  if (campaign.credits < cost) {
    return { ok: false, state: campaign, message: `São necessários ${cost} créditos para mobilizar a ofensiva.` };
  }

  const enemyId = war.factionAId === facId ? war.factionBId : war.factionAId;
  const facName = FACTIONS_BY_ID[facId]?.name ?? facId;
  const enemyName = FACTIONS_BY_ID[enemyId]?.name ?? enemyId;
  const pushPts = rankInfo.current.rank >= 7 ? 20 : 15;

  const afterWar = applyWarMissionProgressToWars(
    {
      ...campaign,
      credits: campaign.credits - cost,
      factionCommand: { ...cmd, lastOffensiveCycle: campaign.galacticCycle },
    },
    facId,
    enemyId,
    pushPts,
    `Almirantado: ${facName} lançou ofensiva coordenada contra ${enemyName} (+${pushPts} pts)!`
  );

  return {
    ok: true,
    state: afterWar.nextCampaign,
    message: `Ofensiva Coordenada executada contra ${enemyName}: +${pushPts} pontos na frente!`,
  };
}

export function executeExecutiveDiplomacy(
  campaign: PlayerCampaignState,
  action: 'ceasefire' | 'declare_war',
  targetFactionId: string
): { ok: boolean; state: PlayerCampaignState; message: string } {
  const rankInfo = getPlayerFactionRank(campaign);
  if (rankInfo.current.rank < 6) {
    return {
      ok: false,
      state: campaign,
      message: 'Requer Patente 6 (Alto Comissário · 450 Renome).',
    };
  }
  const cmd = normalizeFactionCommand(campaign.factionCommand);
  if (cmd.lastDiplomacyCycle === campaign.galacticCycle) {
    return {
      ok: false,
      state: campaign,
      message: 'A Diplomacia Executiva já foi usada neste ciclo galáctico.',
    };
  }
  const facId = campaign.chosenFactionId;
  if (!targetFactionId || targetFactionId === facId) {
    return { ok: false, state: campaign, message: 'Selecione outra facção válida.' };
  }
  const myName = FACTIONS_BY_ID[facId]?.name ?? facId;
  const targetName = FACTIONS_BY_ID[targetFactionId]?.name ?? targetFactionId;

  if (action === 'ceasefire') {
    const war = campaign.galacticWars.find(
      (w) =>
        (w.factionAId === facId && w.factionBId === targetFactionId) ||
        (w.factionBId === facId && w.factionAId === targetFactionId)
    );
    if (!war) {
      return { ok: false, state: campaign, message: 'Não há guerra ativa contra essa facção.' };
    }
    const cost = 900;
    if (campaign.credits < cost) {
      return { ok: false, state: campaign, message: `Tratado de cessar-fogo custa ${cost} créditos.` };
    }
    const nextWars = campaign.galacticWars.filter((w) => w.id !== war.id);
    const msg = `Diplomacia Executiva: ${myName} e ${targetName} assinaram Cessar-Fogo imediato!`;
    return {
      ok: true,
      message: msg,
      state: {
        ...campaign,
        credits: campaign.credits - cost,
        galacticWars: nextWars,
        activeWars: syncActiveWarsMap(nextWars),
        factionCommand: {
          ...cmd,
          lastDiplomacyCycle: campaign.galacticCycle,
          supremePriorityEnemyFactionId:
            cmd.supremePriorityEnemyFactionId === targetFactionId ? null : cmd.supremePriorityEnemyFactionId,
        },
        warHistory: [makeWarLogEntry(campaign.galacticCycle, 'batalha', msg), ...campaign.warHistory].slice(0, 60),
        logbook: [...campaign.logbook, makeRankLog('diplomacia', msg, campaign.gameTimeSeconds)],
      },
    };
  }

  // declare_war
  const alreadyAtWar = campaign.galacticWars.some(
    (w) =>
      (w.factionAId === facId && w.factionBId === targetFactionId) ||
      (w.factionBId === facId && w.factionAId === targetFactionId)
  );
  if (alreadyAtWar) {
    return { ok: false, state: campaign, message: 'Já existe guerra ativa com essa facção.' };
  }
  const cost = 750;
  if (campaign.credits < cost) {
    return { ok: false, state: campaign, message: `Declaração oficial de guerra custa ${cost} créditos.` };
  }
  const newActiveMap = { ...campaign.activeWars };
  newActiveMap[facId] = Array.from(new Set([...(newActiveMap[facId] ?? []), targetFactionId]));
  newActiveMap[targetFactionId] = Array.from(new Set([...(newActiveMap[targetFactionId] ?? []), facId]));
  const rebuilt = buildGalacticWarsFromActiveMap(newActiveMap);
  const existingMap = new Map(campaign.galacticWars.map((w) => [w.id, w]));
  const mergedWars = rebuilt.map((w) => existingMap.get(w.id) ?? w);
  const msg = `Diplomacia Executiva: ${myName} declarou Guerra Aberta contra ${targetName}!`;

  return {
    ok: true,
    message: msg,
    state: {
      ...campaign,
      credits: campaign.credits - cost,
      galacticWars: mergedWars,
      activeWars: syncActiveWarsMap(mergedWars),
      factionRenown: {
        ...campaign.factionRenown,
        [targetFactionId]: Math.min(campaign.factionRenown[targetFactionId] ?? 0, -30),
      },
      factionCommand: {
        ...cmd,
        lastDiplomacyCycle: campaign.galacticCycle,
      },
      warHistory: [makeWarLogEntry(campaign.galacticCycle, 'batalha', msg), ...campaign.warHistory].slice(0, 60),
      logbook: [...campaign.logbook, makeRankLog('diplomacia', msg, campaign.gameTimeSeconds)],
    },
  };
}

export function getWildSystemsNearFaction(
  campaign: PlayerCampaignState,
  factionId: string = campaign.chosenFactionId
): StarSystemSummary[] {
  const effective = KNOWN_GALAXY_SYSTEMS.map((s) => getEffectiveSystemSummary(s, campaign));
  const owned = effective.filter((s) => !s.isBlackHole && s.controllingFactionId === factionId);
  if (owned.length === 0) return [];
  const wild = effective.filter((s) => !s.isBlackHole && s.controllingFactionId === null);
  const candidates: Array<{ sys: StarSystemSummary; dist: number }> = [];
  for (const w of wild) {
    let minD = 999;
    for (const o of owned) {
      const d = Math.hypot(w.x - o.x, w.y - o.y, w.z - o.z);
      if (d < minD) minD = d;
    }
    if (minD <= 36) {
      candidates.push({ sys: w, dist: minD });
    }
  }
  candidates.sort((a, b) => a.dist - b.dist);
  return candidates.slice(0, 12).map((c) => c.sys);
}

function addCargoStack(
  cargo: ResourceCargoRecord[],
  resourceId: string,
  qty: number,
  freeSpace: number
): { nextCargo: ResourceCargoRecord[]; added: number } {
  const toAdd = Math.min(qty, Math.max(0, freeSpace));
  if (toAdd <= 0) return { nextCargo: cargo, added: 0 };
  const idx = cargo.findIndex((c) => c.resourceId === resourceId);
  if (idx >= 0) {
    return {
      added: toAdd,
      nextCargo: cargo.map((c, i) => (i === idx ? { ...c, qty: c.qty + toAdd } : c)),
    };
  }
  return {
    added: toAdd,
    nextCargo: [...cargo, { resourceId, qty: toAdd, avgCostPaid: 0 }],
  };
}

export function resolveCycleRankEconomyAndPatrol(
  campaign: PlayerCampaignState,
  nextCycle: number,
  randomFn: () => number = Math.random
): { state: PlayerCampaignState; announcements: string[] } {
  const rankInfo = getPlayerFactionRank(campaign);
  const cmd = normalizeFactionCommand(campaign.factionCommand);
  const announcements: string[] = [];
  let nextCredits = campaign.credits;
  let nextCargo = [...campaign.cargo];
  const nextLogs = [...campaign.logbook];
  let totalTribute = cmd.totalTributeEarned ?? 0;

  // 1. Salary & Territorial Tribute (zero discounts, pure income)
  const salary = rankInfo.current.cycleSalary;
  const tribute = rankInfo.current.tributePerSystem * rankInfo.ownedSystemsCount;
  const totalPayout = salary + tribute;
  if (totalPayout > 0) {
    nextCredits += totalPayout;
    totalTribute += totalPayout;
    const facName = FACTIONS_BY_ID[rankInfo.factionId]?.name ?? rankInfo.factionId;
    const text =
      tribute > 0
        ? `Ciclo ${nextCycle}: ${rankInfo.current.title} de ${facName} recebeu +${salary} cr (soldo) e +${tribute} cr (tributo de ${rankInfo.ownedSystemsCount} sistemas).`
        : `Ciclo ${nextCycle}: ${rankInfo.current.title} de ${facName} recebeu +${salary} cr de soldo militar.`;
    nextLogs.push(makeRankLog('comercio', text, campaign.gameTimeSeconds));
    announcements.push(text);
  }

  // Supreme Captain strategic resource tribute from faction capital
  const activeShip = campaign.ships.find((s) => s.uid === campaign.activeShipUid) ?? campaign.ships[0];
  const bonuses = computeCrewBonuses(campaign);
  const shipStats = activeShip ? computeShipDerivedStats(activeShip, bonuses) : null;
  let freeSpace =
    activeShip && shipStats ? Math.max(0, shipStats.cargoCapacity - compartmentUsed(campaign, activeShip)) : 0;

  if (rankInfo.isSupremeCaptain && rankInfo.ownedSystemsCount > 0) {
    const capLoot = ['ligas_avancadas', 'platina', 'titanio'][Math.floor(randomFn() * 3)];
    const added = addCargoStack(nextCargo, capLoot, 2, freeSpace);
    nextCargo = added.nextCargo;
    freeSpace -= added.added;
    if (added.added > 0) {
      const resName = RESOURCES_BY_ID[capLoot]?.name ?? capLoot;
      const msg = `Ciclo ${nextCycle}: Tributo da Capitania Suprema entregou +${added.added}× ${resName} ao compartimento.`;
      nextLogs.push(makeRankLog('comercio', msg, campaign.gameTimeSeconds));
    }
  }

  // 2. Resolve Secondary Fleet Patrol (Rank 3+)
  let nextPatrol = cmd.activePatrol;
  let nextRenown = { ...campaign.factionRenown };
  let updatedState: PlayerCampaignState = {
    ...campaign,
    credits: nextCredits,
    cargo: nextCargo,
    factionRenown: nextRenown,
    logbook: nextLogs,
    factionCommand: {
      ...cmd,
      totalTributeEarned: totalTribute,
      activePatrol: null,
    },
  };

  if (nextPatrol) {
    const ship = campaign.ships.find((s) => s.uid === nextPatrol!.shipUid);
    const hull = ship ? HULLS_BY_ID[ship.hullId] : undefined;
    const shipPowerBonus = hull ? Math.round(hull.maxHull * 0.4 + hull.cargoCapacity * 3) : 120;
    const patrolCredits = 240 + Math.round(shipPowerBonus * 0.55) + rankInfo.current.rank * 45;
    const patrolRenown = 6 + Math.floor(rankInfo.current.rank / 2);
    const patrolResPool = ['titanio', 'ouro', 'platina', 'ligas_avancadas', 'cristais_energeticos'];
    const pickedRes = patrolResPool[Math.floor(randomFn() * patrolResPool.length)];
    const curFree =
      activeShip && shipStats
        ? Math.max(0, shipStats.cargoCapacity - compartmentUsed(updatedState, activeShip))
        : 0;
    const resAdd = addCargoStack(updatedState.cargo, pickedRes, 2, curFree);
    const resName = RESOURCES_BY_ID[pickedRes]?.name ?? pickedRes;

    updatedState = {
      ...updatedState,
      credits: updatedState.credits + patrolCredits,
      cargo: resAdd.nextCargo,
      factionRenown: {
        ...updatedState.factionRenown,
        [nextPatrol.factionId]: (updatedState.factionRenown[nextPatrol.factionId] ?? 0) + patrolRenown,
      },
    };

    const patrolMsg = `Patrulha de ${nextPatrol.shipName} em ${nextPatrol.targetSystemName} concluída: +${patrolCredits} cr, +${patrolRenown} Renome${
      resAdd.added > 0 ? `, +${resAdd.added}× ${resName}` : ''
    }.`;
    updatedState = {
      ...updatedState,
      logbook: [...updatedState.logbook, makeRankLog('viagem', patrolMsg, campaign.gameTimeSeconds)],
    };
    announcements.push(patrolMsg);

    // If patrol target is at war with player's faction, also push war score slightly
    const targetRaw = getSystemSummaryById(nextPatrol.targetSystemId);
    const targetEff = targetRaw ? getEffectiveSystemSummary(targetRaw, updatedState) : null;
    if (
      targetEff?.controllingFactionId &&
      targetEff.controllingFactionId !== nextPatrol.factionId &&
      (updatedState.activeWars[nextPatrol.factionId] ?? []).includes(targetEff.controllingFactionId)
    ) {
      updatedState = applyWarMissionProgressToWars(
        updatedState,
        nextPatrol.factionId,
        targetEff.controllingFactionId,
        4,
        `Patrulha de ${nextPatrol.shipName} pressionou a frente em ${nextPatrol.targetSystemName} (+4 pts).`
      ).nextCampaign;
    }
    nextPatrol = null;
  }

  // 3. Resolve Rank 3 Strategic Resource Collection
  if (
    rankInfo.current.rank >= 3 &&
    cmd.rank3Choice === 'coleta' &&
    cmd.resourceCollection &&
    cmd.resourceCollection.shipUids.length > 0
  ) {
    const col = cmd.resourceCollection;
    const activeUids = col.shipUids.filter(
      (uid) => uid !== updatedState.activeShipUid && updatedState.ships.some((s) => s.uid === uid)
    ).slice(0, 3);
    const resDef = RESOURCES_BY_ID[col.resourceId];
    if (activeUids.length > 0 && resDef) {
      const targetFactionId = rankInfo.factionId;
      const planetCount =
        getRank3CollectibleResources(updatedState, targetFactionId).find((r) => r.resource.id === resDef.id)
          ?.planetCount ?? 0;
      const divisor = activeUids.length >= 3 ? 1 : activeUids.length === 2 ? 2 : 3;
      const yieldQty = Math.floor(planetCount / divisor);

      if (yieldQty > 0) {
        const curFree =
          activeShip && shipStats
            ? Math.max(0, shipStats.cargoCapacity - compartmentUsed(updatedState, activeShip))
            : 0;
        const cargoRes = addCargoStack(updatedState.cargo, resDef.id, yieldQty, curFree);
        const overflowQty = yieldQty - cargoRes.added;
        let nextVault = normalizeFactionVault(updatedState.factionVault);
        if (overflowQty > 0) {
          const vIdx = nextVault.resources.findIndex((r) => r.resourceId === resDef.id);
          nextVault = {
            ...nextVault,
            resources:
              vIdx >= 0
                ? nextVault.resources.map((r, i) => (i === vIdx ? { ...r, qty: r.qty + overflowQty } : r))
                : [...nextVault.resources, { resourceId: resDef.id, qty: overflowQty, avgCostPaid: 0 }],
          };
        }
        const colMsg =
          overflowQty > 0
            ? `Ciclo ${nextCycle}: Frota de Coleta (${activeUids.length} nave${activeUids.length > 1 ? 's' : ''}) extraiu ${yieldQty}× ${resDef.name} (${cargoRes.added} na carga, ${overflowQty} no Cofre da Facção).`
            : `Ciclo ${nextCycle}: Frota de Coleta (${activeUids.length} nave${activeUids.length > 1 ? 's' : ''}) entregou +${cargoRes.added}× ${resDef.name} ao compartimento.`;
        updatedState = {
          ...updatedState,
          cargo: cargoRes.nextCargo,
          factionVault: nextVault,
          logbook: [...updatedState.logbook, makeRankLog('comercio', colMsg, campaign.gameTimeSeconds)],
        };
        announcements.push(colMsg);
      } else {
        const zeroMsg = `Ciclo ${nextCycle}: Frota de Coleta (${activeUids.length} nave${activeUids.length > 1 ? 's' : ''}) não atingiu cota mínima de ${resDef.name} (${planetCount} planeta(s) ÷ ${divisor} = 0).`;
        updatedState = {
          ...updatedState,
          logbook: [...updatedState.logbook, makeRankLog('comercio', zeroMsg, campaign.gameTimeSeconds)],
        };
      }
    }
  }

  // 4. Per-cycle Crew Equipment Maintenance Cost
  const crewMaint = computeCrewEquipmentMaintenance(updatedState);
  if (crewMaint.totalCost > 0) {
    const balance = Number.isFinite(updatedState.credits) ? updatedState.credits : 0;
    const paid = Math.min(Math.max(0, balance), crewMaint.totalCost);
    const noun = crewMaint.itemCount === 1 ? 'equipamento' : 'equipamentos';
    const maintMsg =
      paid >= crewMaint.totalCost
        ? `Ciclo ${nextCycle}: manutenção de ${crewMaint.itemCount} ${noun} da tripulação custou -${paid} cr.`
        : paid > 0
          ? `Ciclo ${nextCycle}: manutenção da tripulação cobrou ${paid} de ${crewMaint.totalCost} cr (${crewMaint.itemCount} ${noun}).`
          : `Ciclo ${nextCycle}: sem créditos para a manutenção de ${crewMaint.totalCost} cr da tripulação (${crewMaint.itemCount} ${noun}).`;
    updatedState = {
      ...updatedState,
      credits: balance - paid,
      logbook: [...updatedState.logbook, makeRankLog('comercio', maintMsg, campaign.gameTimeSeconds)],
    };
    announcements.push(maintMsg);
  }

  return {
    state: updatedState,
    announcements,
  };
}

export function getAvailableFactionRivals(campaign: PlayerCampaignState): Array<{
  id: string;
  name: string;
  color: string;
  atWar: boolean;
}> {
  const myId = campaign.chosenFactionId;
  const activeWithMy = new Set(campaign.activeWars[myId] ?? []);
  return FACTIONS.filter((f) => f.id !== myId).map((f) => ({
    id: f.id,
    name: f.name,
    color: f.color,
    atWar: activeWithMy.has(f.id),
  }));
}

export function getHighestLivingPlanetInSystem(
  system: StarSystemFull,
  campaign: PlayerCampaignState
): { planet: PlanetData; effectiveLevel: number } | null {
  let best: { planet: PlanetData; effectiveLevel: number } | null = null;
  for (const p of system.planets) {
    const lv = campaign.planetOverrides?.[p.id]?.level ?? p.level;
    if (lv < 0) continue;
    if (
      !best ||
      lv > best.effectiveLevel ||
      (lv === best.effectiveLevel && p.radius > best.planet.radius)
    ) {
      best = { planet: p, effectiveLevel: lv };
    }
  }
  return best;
}

export function advanceGalacticCycleWithCommand(
  campaign: PlayerCampaignState,
  randomFn: () => number = Math.random
): { nextCampaign: PlayerCampaignState; announcements: string[] } {
  const warRes = advanceGalacticCycle(campaign, randomFn);
  const rankRes = resolveCycleRankEconomyAndPatrol(
    warRes.nextCampaign,
    warRes.nextCampaign.galacticCycle,
    randomFn
  );
  return {
    nextCampaign: rankRes.state,
    announcements: [...rankRes.announcements, ...warRes.announcements],
  };
}

