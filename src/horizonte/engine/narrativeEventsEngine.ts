import type {
  ActiveNarrativeEventSession,
  CrewMember,
  CrewRole,
  Mission,
  NarrativeEventChoice,
  NarrativeEventDef,
  NarrativeEventEffect,
  NarrativeEventScene,
  OwnedShip,
  PlanetData,
  PlayerCampaignState,
  RandomEventTriggerKey,
  StarSystemFull,
} from '../types/game';
import { NARRATIVE_EVENTS_PART1 } from '../data/narrativeEventsPart1';
import { NARRATIVE_EVENTS_PART2 } from '../data/narrativeEventsPart2';
import { FACTIONS, FACTIONS_BY_ID, SPECIES_BY_ID } from '../data/lifeforms';
import {
  CONSUMABLES_BY_ID,
  EXTRACTORS,
  HULLS_BY_ID,
  RESOURCES,
  RESOURCES_BY_ID,
  SHIELDS,
  SUIT_GEAR,
  UTILITY_MODULES,
  WEAPONS,
} from '../data/items';
import { generateSolarSystem, getSystemsInRadius, KNOWN_GALAXY_SYSTEMS } from '../data/universe';
import { getPlanetControllingFaction, getPlanetCurrentLevel, getRenownTierName } from '../data/narrative';
import { compartmentUsed, computeCrewBonuses, computeShipDerivedStats } from './combat';
import { getEffectiveSystemSummary } from './galacticWar';
import { getEquipmentMeta, RARITY_STYLES } from '../utils/formatting';

export const ALL_NARRATIVE_EVENTS: NarrativeEventDef[] = [
  ...NARRATIVE_EVENTS_PART1,
  ...NARRATIVE_EVENTS_PART2,
];

export const NARRATIVE_EVENTS_BY_ID: Record<number, NarrativeEventDef> = Object.fromEntries(
  ALL_NARRATIVE_EVENTS.map((ev) => [ev.id, ev])
);

const CREW_NAMES_EXTRA = ['Aerin', 'Dorian', 'Lyra', 'Kaelen', 'Sora', 'Tarek', 'Vesper', 'Nora', 'Jaxon', 'Elowen'];

function getPlayerRivalFactionId(campaign: PlayerCampaignState, systemOwnerId: string | null): string {
  const playerWars = campaign.activeWars[campaign.chosenFactionId] ?? FACTIONS_BY_ID[campaign.chosenFactionId]?.warsWith ?? [];
  if (playerWars.length > 0) return playerWars[0];
  if (systemOwnerId && systemOwnerId !== campaign.chosenFactionId) return systemOwnerId;
  return FACTIONS.find((f) => f.id !== campaign.chosenFactionId)?.id ?? campaign.chosenFactionId;
}

function addCargoWithRoom(
  campaign: PlayerCampaignState,
  ship: OwnedShip,
  resourceId: string,
  qty: number
): { nextCargo: PlayerCampaignState['cargo']; added: number } {
  const st = computeShipDerivedStats(ship, computeCrewBonuses(campaign));
  const usedTotal = compartmentUsed(campaign, ship);
  const space = Math.max(0, st.cargoCapacity - usedTotal);
  const actual = Math.min(qty, space);
  if (actual <= 0) return { nextCargo: campaign.cargo, added: 0 };

  const existing = campaign.cargo.find((c) => c.resourceId === resourceId);
  if (existing) {
    return {
      nextCargo: campaign.cargo.map((c) =>
        c.resourceId === resourceId ? { ...c, qty: c.qty + actual } : c
      ),
      added: actual,
    };
  }
  return {
    nextCargo: [...campaign.cargo, { resourceId, qty: actual, avgCostPaid: 0 }],
    added: actual,
  };
}

const GEAR_CATEGORY_LABELS: Record<'weapon' | 'shield' | 'extractor' | 'utility' | 'suit', string> = {
  weapon: 'Arma',
  shield: 'Escudo',
  extractor: 'Extrator',
  utility: 'Utilidade',
  suit: 'Traje',
};

function storeGearOrInstall(
  ship: OwnedShip,
  rarity: 'comum' | 'raro'
): {
  nextShip: OwnedShip;
  label: string;
  categoryLabel: string;
  rarityLabel: string;
  statsLine: string;
  stored: boolean;
} {
  const pool: Array<{ category: 'weapon' | 'shield' | 'extractor' | 'utility' | 'suit'; id: string; r: string }> = [
    ...WEAPONS.map((w) => ({ category: 'weapon' as const, id: w.id, r: w.rarity })),
    ...SHIELDS.map((s) => ({ category: 'shield' as const, id: s.id, r: s.rarity })),
    ...EXTRACTORS.map((e) => ({ category: 'extractor' as const, id: e.id, r: e.rarity })),
    ...UTILITY_MODULES.map((u) => ({ category: 'utility' as const, id: u.id, r: u.rarity })),
    ...SUIT_GEAR.map((g) => ({ category: 'suit' as const, id: g.id, r: g.rarity })),
  ];
  const filtered =
    rarity === 'raro'
      ? pool.filter((p) => p.r === 'raro' || p.r === 'épico')
      : pool.filter((p) => p.r === 'comum' || p.r === 'incomum');
  const chosen = filtered[Math.floor(Math.random() * filtered.length)] ?? pool[0];
  const meta = getEquipmentMeta(chosen.category, chosen.id);
  const stored = ship.depot.length < 30;
  const nextDepot = stored
    ? [
        ...ship.depot,
        {
          uid: `evgear_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          category: chosen.category,
          itemId: chosen.id,
          avgCostPaid: 0,
        },
      ]
    : ship.depot;
  return {
    nextShip: { ...ship, depot: nextDepot },
    label: meta.name,
    categoryLabel: GEAR_CATEGORY_LABELS[chosen.category],
    rarityLabel: RARITY_STYLES[meta.rarity]?.label ?? meta.rarity,
    statsLine: meta.statsLine,
    stored,
  };
}

function buildTextContext(
  campaign: PlayerCampaignState,
  system: StarSystemFull,
  planet?: PlanetData | null
): {
  tokens: Record<string, string>;
  speciesName: string;
  factionName: string;
  contextFactionId: string;
  rivalFactionId: string;
} {
  const species = SPECIES_BY_ID[campaign.chosenSpeciesId];
  const faction = FACTIONS_BY_ID[campaign.chosenFactionId];
  const activeShip = campaign.ships.find((s) => s.uid === campaign.activeShipUid) ?? campaign.ships[0];
  const ownerId =
    (planet ? getPlanetControllingFaction(planet, campaign) : null) ?? system.controllingFactionId;
  const ownerFac = ownerId ? FACTIONS_BY_ID[ownerId] : null;
  const rivalId = getPlayerRivalFactionId(campaign, ownerId);
  const rivalFac = FACTIONS_BY_ID[rivalId];
  const firstCrew = campaign.crew[0]?.name ?? 'seu imediato';

  const renownVal = ownerId ? campaign.factionRenown[ownerId] ?? 0 : 0;
  const renownTier = ownerId
    ? getRenownTierName(renownVal, campaign.formalAlliances.includes(ownerId))
    : 'Território Livre';
  const activeWarPartners = campaign.activeWars[campaign.chosenFactionId] ?? [];
  const warClause =
    activeWarPartners.length > 0
      ? `em meio à guerra contra ${FACTIONS_BY_ID[activeWarPartners[0]]?.name ?? 'rivais estelares'}`
      : 'em patrulha pela fronteira estelar';

  return {
    speciesName: species?.name ?? 'Viajante',
    factionName: faction?.name ?? 'Frota Independente',
    contextFactionId: ownerId ?? campaign.chosenFactionId,
    rivalFactionId: rivalId,
    tokens: {
      '{JOGADOR}': campaign.playerName,
      '{ESPECIE}': species?.name ?? 'Viajante',
      '{FACCAO}': faction?.name ?? 'Frota Independente',
      '{NAVE}': activeShip?.customName ?? 'sua nave',
      '{SISTEMA}': system.name,
      '{PLANETA}': planet?.name ?? system.name,
      '{CONTROLE_TEXTO}': ownerFac ? `${ownerFac.name} (${renownTier})` : 'Espaço Selvagem',
      '{RIVAL_NOME}': rivalFac?.name ?? 'frotas rivais',
      '{TRIPULANTE}': firstCrew,
      '{GUERRA_CONTEXTO}': warClause,
    },
  };
}

export function interpolateNarrativeText(
  text: string,
  tokens: Record<string, string>
): string {
  let out = text;
  for (const [k, v] of Object.entries(tokens)) {
    out = out.split(k).join(v);
  }
  return out;
}

function interpolateScene(
  scene: NarrativeEventScene,
  tokens: Record<string, string>,
  warMoodNote: string | null
): NarrativeEventScene {
  const baseText = interpolateNarrativeText(scene.narrativeText, tokens);
  const enriched =
    warMoodNote && scene.id === 'init'
      ? `${baseText} (${warMoodNote})`
      : baseText;
  return {
    id: scene.id,
    narrativeText: enriched,
    choices: [
      {
        ...scene.choices[0],
        label: interpolateNarrativeText(scene.choices[0].label, tokens),
        hint: interpolateNarrativeText(scene.choices[0].hint, tokens),
        conclusionText: interpolateNarrativeText(scene.choices[0].conclusionText, tokens),
      },
      {
        ...scene.choices[1],
        label: interpolateNarrativeText(scene.choices[1].label, tokens),
        hint: interpolateNarrativeText(scene.choices[1].hint, tokens),
        conclusionText: interpolateNarrativeText(scene.choices[1].conclusionText, tokens),
      },
    ],
  };
}

export function pickRandomNarrativeEvent(
  triggerKey: RandomEventTriggerKey,
  campaign: PlayerCampaignState,
  _system: StarSystemFull,
  planet?: PlanetData | null
): NarrativeEventDef | null {
  const planetLevel = planet ? getPlanetCurrentLevel(planet, campaign) : 0;
  const planetTypeCode = planet
    ? (campaign.planetOverrides[planet.id]?.typeCodeOverride ?? planet.typeCode)
    : undefined;
  const completedSet = new Set(campaign.completedEventIds ?? []);

  const candidates = ALL_NARRATIVE_EVENTS.filter((ev) => {
    if (ev.triggerKey !== triggerKey) return false;
    if (ev.requiresPlanetMaxLevel !== undefined && planet && planetLevel > ev.requiresPlanetMaxLevel) {
      return false;
    }
    if (planetTypeCode) {
      if (ev.allowedPlanetCodes && !ev.allowedPlanetCodes.includes(planetTypeCode)) {
        return false;
      }
      if (ev.excludedPlanetCodes && ev.excludedPlanetCodes.includes(planetTypeCode)) {
        return false;
      }
    }
    return true;
  });

  if (candidates.length === 0) return null;
  const unseen = candidates.filter((ev) => !completedSet.has(ev.id));
  const activePool = unseen.length > 0 ? unseen : candidates;
  const specific = activePool.filter((ev) => ev.allowedPlanetCodes && ev.allowedPlanetCodes.length <= 3);
  const pool = specific.length > 0 && Math.random() < 0.72 ? specific : activePool;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function buildNarrativeEventSession(
  def: NarrativeEventDef,
  campaign: PlayerCampaignState,
  system: StarSystemFull,
  planet?: PlanetData | null,
  startSceneId?: string
): ActiveNarrativeEventSession {
  const ctx = buildTextContext(campaign, system, planet);
  const fac = FACTIONS_BY_ID[campaign.chosenFactionId];
  const ownerId =
    (planet ? getPlanetControllingFaction(planet, campaign) : null) ?? system.controllingFactionId;
  const renown = ownerId ? campaign.factionRenown[ownerId] ?? 0 : 0;

  let warMoodNote: string | null = null;
  if (ownerId && ownerId !== campaign.chosenFactionId) {
    const atWar = (campaign.activeWars[campaign.chosenFactionId] ?? []).includes(ownerId);
    if (atWar) {
      warMoodNote = `Alerta diplomático: ${FACTIONS_BY_ID[ownerId]?.name ?? 'esta facção'} está em guerra aberta com ${ctx.factionName}`;
    } else if (renown <= -15) {
      warMoodNote = `Tensão alta: sua reputação com ${FACTIONS_BY_ID[ownerId]?.name ?? 'o setor'} está hostil (${renown})`;
    } else if (renown >= 50) {
      warMoodNote = `Sua reputação favorável (${renown}) abre respeito com o setor`;
    }
  }

  const followUps: Record<string, NarrativeEventScene> = {};
  for (const [k, sc] of Object.entries(def.followUpScenes ?? {})) {
    followUps[k] = interpolateScene(sc, ctx.tokens, null);
  }

  const chosenScene =
    startSceneId && followUps[startSceneId]
      ? followUps[startSceneId]
      : interpolateScene(def.initialScene, ctx.tokens, warMoodNote);

  return {
    eventId: def.id,
    title: def.title,
    scope: def.scope,
    complexity: def.complexity,
    triggerKey: def.triggerKey,
    category: def.category,
    visualMotif: def.visualMotif,
    accentColor: fac?.color ?? '#2ec8d0',
    starColor: system.starColor ?? '#f59e0b',
    speciesName: ctx.speciesName,
    factionName: ctx.factionName,
    targetPlanetId: planet?.id,
    targetPlanetName: planet?.name,
    contextFactionId: ctx.contextFactionId,
    rivalFactionId: ctx.rivalFactionId,
    currentScene: chosenScene,
    followUpScenes: followUps,
    phase: 'scene',
    appliedConsequences: [],
  };
}

function applySingleEffect(
  prev: PlayerCampaignState,
  effect: Omit<NarrativeEventEffect, 'luckCheck'>,
  session: ActiveNarrativeEventSession,
  currentSystem: StarSystemFull,
  summaries: string[]
): {
  next: PlayerCampaignState;
  spawnedMissionTitle?: string;
  hullDestroyed: boolean;
  jumpedSystem?: string;
} {
  let next: PlayerCampaignState = { ...prev };
  let activeShip = next.ships.find((s) => s.uid === next.activeShipUid) ?? next.ships[0];
  let hullDestroyed = false;
  let spawnedMissionTitle: string | undefined;
  let jumpedSystem: string | undefined;

  // 1. Credits
  if (effect.creditsDelta) {
    const nextCr = Math.max(0, next.credits + effect.creditsDelta);
    const actualDelta = nextCr - next.credits;
    next.credits = nextCr;
    summaries.push(
      actualDelta >= 0
        ? `+${actualDelta.toLocaleString('pt-BR')} créditos`
        : `${actualDelta.toLocaleString('pt-BR')} créditos`
    );
  }

  // 2. Fuel
  if (effect.fuelDelta) {
    const st = computeShipDerivedStats(activeShip, computeCrewBonuses(next));
    const nextFuel = Math.max(0, Math.min(st.fuelCapacity, next.fuel + effect.fuelDelta));
    next.fuel = nextFuel;
    summaries.push(
      effect.fuelDelta >= 0
        ? `+${effect.fuelDelta} combustível`
        : `${effect.fuelDelta} combustível`
    );
  }

  // 3. Supplies
  if (effect.suppliesDelta) {
    next.supplies = Math.max(0, next.supplies + effect.suppliesDelta);
    summaries.push(
      effect.suppliesDelta >= 0
        ? `+${effect.suppliesDelta} suprimentos`
        : `${effect.suppliesDelta} suprimentos`
    );
  }

  // 4. Crew health (Saúde da tripulação)
  if (effect.crewHealthDelta) {
    const maxHealth = 100 + Math.max(0, next.healthPotency ?? 0);
    next.crewHealth = Math.max(0, Math.min(maxHealth, (next.crewHealth ?? 100) + effect.crewHealthDelta));
    summaries.push(
      effect.crewHealthDelta >= 0
        ? `+${effect.crewHealthDelta} saúde da tripulação`
        : `${effect.crewHealthDelta} saúde da tripulação`
    );
  }

  // 5. Ship hull
  if (effect.hullDelta) {
    const st = computeShipDerivedStats(activeShip, computeCrewBonuses(next));
    const nextHull = Math.max(0, Math.min(st.maxHull, activeShip.currentHull + effect.hullDelta));
    if (nextHull <= 0) hullDestroyed = true;
    activeShip = { ...activeShip, currentHull: nextHull };
    next.ships = next.ships.map((s) => (s.uid === activeShip.uid ? activeShip : s));
    summaries.push(
      effect.hullDelta >= 0
        ? `+${effect.hullDelta} casco`
        : `${effect.hullDelta} casco`
    );
  }

  // 6. Faction Renown
  const primaryRenownTarget = effect.useSystemOwnerRenown
    ? session.contextFactionId ?? next.chosenFactionId
    : effect.useWarRivalRenown
      ? session.rivalFactionId ?? next.chosenFactionId
      : next.chosenFactionId;

  if (effect.renownDelta) {
    const cur = next.factionRenown[primaryRenownTarget] ?? 0;
    next.factionRenown = {
      ...next.factionRenown,
      [primaryRenownTarget]: cur + effect.renownDelta,
    };
    const fName = FACTIONS_BY_ID[primaryRenownTarget]?.name ?? 'facção';
    summaries.push(
      effect.renownDelta >= 0
        ? `+${effect.renownDelta} reputação com ${fName}`
        : `${effect.renownDelta} reputação com ${fName}`
    );
  }

  if (effect.secondaryRenownDelta) {
    const secTarget =
      primaryRenownTarget === next.chosenFactionId
        ? session.rivalFactionId ?? session.contextFactionId ?? next.chosenFactionId
        : next.chosenFactionId;
    const cur = next.factionRenown[secTarget] ?? 0;
    next.factionRenown = {
      ...next.factionRenown,
      [secTarget]: cur + effect.secondaryRenownDelta,
    };
    const fName = FACTIONS_BY_ID[secTarget]?.name ?? 'facção';
    summaries.push(
      effect.secondaryRenownDelta >= 0
        ? `+${effect.secondaryRenownDelta} reputação com ${fName}`
        : `${effect.secondaryRenownDelta} reputação com ${fName}`
    );
  }

  // 7. Resource cargo
  let resourceId = effect.resourceId;
  if (!resourceId && effect.randomRareResource) {
    const rares = RESOURCES.filter((r) => r.rarity === 'raro' || r.rarity === 'épico');
    resourceId = rares[Math.floor(Math.random() * rares.length)]?.id;
  } else if (!resourceId && effect.randomCommonResource) {
    const commons = RESOURCES.filter((r) => r.rarity === 'comum');
    resourceId = commons[Math.floor(Math.random() * commons.length)]?.id;
  }
  if (resourceId) {
    const qty = effect.resourceQty ?? 3;
    const resDef = RESOURCES_BY_ID[resourceId];
    const rLabel = resDef ? (RARITY_STYLES[resDef.rarity]?.label ?? resDef.rarity) : 'Comum';
    const { nextCargo, added } = addCargoWithRoom(next, activeShip, resourceId, qty);
    next.cargo = nextCargo;
    if (added > 0) {
      summaries.push(
        `+${added}x ${resDef?.name ?? resourceId} (Recurso ${rLabel}) — guardado no compartimento de carga${
          added < qty ? ` (${qty - added} perdido por falta de espaço)` : ''
        }`
      );
    } else {
      summaries.push(
        `Sem espaço no compartimento de carga para ${qty}x ${resDef?.name ?? resourceId} (Recurso ${rLabel})`
      );
    }
  }

  // 9. Consumables
  if (effect.consumableId) {
    const qty = effect.consumableQty ?? 1;
    const def = CONSUMABLES_BY_ID[effect.consumableId];
    next.consumables = {
      ...next.consumables,
      [effect.consumableId]: (next.consumables[effect.consumableId] ?? 0) + qty,
    };
    summaries.push(
      `+${qty}x ${def?.name ?? effect.consumableId} (Consumível)${def?.description ? ` — ${def.description}` : ''}`
    );
  }

  // 10. Equipment ("Item")
  if (effect.randomEquipment) {
    const gear = storeGearOrInstall(activeShip, effect.randomEquipment);
    activeShip = gear.nextShip;
    next.ships = next.ships.map((s) => (s.uid === activeShip.uid ? activeShip : s));
    if (gear.stored) {
      summaries.push(
        `Item obtido (${gear.categoryLabel} · ${gear.rarityLabel}): ${gear.label}${
          gear.statsLine ? ` [${gear.statsLine}]` : ''
        } — guardado no depósito da nave`
      );
    } else {
      summaries.push(
        `Depósito da nave lotado (30/30): ${gear.label} (${gear.categoryLabel} · ${gear.rarityLabel}) não pôde ser guardado`
      );
    }
  }

  // 11. Crew mutations
  if (effect.addCrewMember) {
    const hullDef = HULLS_BY_ID[activeShip.hullId];
    const activeCount = next.crew.filter((c) => c.status === 'ativo').length;
    const reserveCount = next.crew.filter((c) => c.status === 'reserva').length;
    const canActive = activeCount < (hullDef?.activeCrewPosts ?? 2);
    const canReserve = reserveCount < (hullDef?.reserveQuarters ?? 4);
    if (canActive || canReserve) {
      const roles: CrewRole[] = [
        'piloto_navegador',
        'engenheiro',
        'negociador',
        'explorador',
        'minerador',
        'diplomata',
        'mestre_tripulacao',
      ];
      const usedRoles = new Set(next.crew.filter((c) => c.status === 'ativo').map((c) => c.role));
      const freeRole = roles.find((r) => !usedRoles.has(r)) ?? roles[Math.floor(Math.random() * roles.length)];
      const newMember: CrewMember = {
        id: `evcrew_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: `${CREW_NAMES_EXTRA[Math.floor(Math.random() * CREW_NAMES_EXTRA.length)]}-${Math.floor(10 + Math.random() * 89)}`,
        speciesId: next.chosenSpeciesId,
        role: freeRole,
        skill: Math.floor(28 + Math.random() * 28),
        hireCost: 0,
        status: canActive && !usedRoles.has(freeRole) ? 'ativo' : 'reserva',
      };
      next.crew = [...next.crew, newMember];
      summaries.push(`Novo tripulante recrutado: ${newMember.name} (perícia ${newMember.skill})`);
    } else {
      next.credits += 180;
      summaries.push('Sem alojamento livre: recrutamento convertido em +180 créditos');
    }
  }

  if (effect.removeOneCrewMember && next.crew.length > 0) {
    const victim = next.crew[next.crew.length - 1];
    next.crew = next.crew.filter((c) => c.id !== victim.id);
    summaries.push(`Tripulante perdido ou dispensado: ${victim.name}`);
  }

  if (effect.promoteCookToEngineer) {
    if (next.crew.length > 0) {
      const first = next.crew[0];
      next.crew = next.crew.map((c, idx) =>
        idx === 0 ? { ...c, role: 'engenheiro', skill: Math.min(100, c.skill + 12) } : c
      );
      summaries.push(`${first.name} promovido a Engenheiro (+12 perícia)`);
    } else {
      const eng: CrewMember = {
        id: `eveng_${Date.now()}`,
        name: 'Toren-77',
        speciesId: next.chosenSpeciesId,
        role: 'engenheiro',
        skill: 44,
        hireCost: 0,
        status: 'ativo',
      };
      next.crew = [eng];
      summaries.push(`Novo Engenheiro promovido a bordo: ${eng.name}`);
    }
  }

  if (effect.boostCrewSkill && next.crew.length > 0) {
    const idx = Math.floor(Math.random() * next.crew.length);
    const boosted = next.crew[idx];
    next.crew = next.crew.map((c, i) =>
      i === idx ? { ...c, skill: Math.min(100, c.skill + effect.boostCrewSkill!) } : c
    );
    summaries.push(`${boosted.name} ganhou +${effect.boostCrewSkill} de perícia`);
  }

  // 12. Narrative buffs & states
  if (effect.grantNextEventBonus) {
    next.eventNextBonus = true;
    summaries.push('Registro tático preparado (+20% de chance em testes do próximo evento)');
  }
  if (effect.grantTempBuffLabel) {
    next.eventCrewBuffLabel = effect.grantTempBuffLabel;
    next.eventCrewBuffUntilSec = next.gameTimeSeconds + 300;
    summaries.push(`Efeito temporário de saúde da tripulação (5 min): ${effect.grantTempBuffLabel}`);
  }
  if (effect.grantAiAwakened) {
    if (!next.eventAiAwakened) {
      next.originBonuses = {
        ...next.originBonuses,
        explorerBonus: next.originBonuses.explorerBonus + 0.08,
        fuelCostMult: Math.max(0.55, Number((next.originBonuses.fuelCostMult * 0.94).toFixed(3))),
      };
    }
    next.eventAiAwakened = true;
    summaries.push('IA de bordo desperta (+8% exploração e -6% consumo de combustível permanentes)');
  }
  if (effect.grantCosmicSeed) {
    next.eventCosmicSeedActive = true;
    summaries.push('Estufa orgânica ativa a bordo (+1 suprimento a cada 10s)');
  }

  // 13. Wormhole Jump across the galaxy (strictly safe from breaking capitals)
  if (effect.wormholeJumpAcrossGalaxy) {
    const candidates = KNOWN_GALAXY_SYSTEMS.filter((s) => {
      if (s.isBlackHole || s.id === currentSystem.id) return false;
      const dist = Math.hypot(s.x - currentSystem.x, s.y - currentSystem.y, s.z - currentSystem.z);
      return dist >= 65;
    });
    const pickRaw =
      candidates[Math.floor(Math.random() * candidates.length)] ??
      KNOWN_GALAXY_SYSTEMS.find((s) => s.id !== currentSystem.id && !s.isBlackHole);
    if (pickRaw) {
      const effTarget = getEffectiveSystemSummary(pickRaw, next);
      next.currentSystemId = effTarget.id;
      next.orbitingPlanetId = null;
      next.playerPos = { x: effTarget.starExclusionRadius + 14, z: 10 };
      if (!next.visitedSystemIds.includes(effTarget.id)) {
        next.visitedSystemIds = [...next.visitedSystemIds, effTarget.id];
      }
      if (!next.scannedSystemIds.includes(effTarget.id)) {
        next.scannedSystemIds = [...next.scannedSystemIds, effTarget.id];
      }
      jumpedSystem = effTarget.name;
      summaries.push(`Buraco de minhoca atravessado: nave transportada para ${effTarget.name}!`);
    }
  }

  // 14. Planet scope-enforced effect (ONLY level <= 4, NEVER level 5)
  if (effect.planetLevelDeltaIfUnder5 && session.targetPlanetId) {
    const targetPl = currentSystem.planets.find((p) => p.id === session.targetPlanetId);
    if (targetPl) {
      const curLv = getPlanetCurrentLevel(targetPl, next);
      if (curLv >= 0 && curLv <= 4) {
        const nextLv = Math.max(0, Math.min(4, curLv + effect.planetLevelDeltaIfUnder5));
        if (nextLv !== curLv) {
          next.planetOverrides = {
            ...next.planetOverrides,
            [targetPl.id]: {
              ...(next.planetOverrides[targetPl.id] ?? {}),
              level: nextLv,
            },
          };
          summaries.push(`${targetPl.name} alterado para nível ${nextLv}`);
        }
      }
    }
  }

  // 15. Spawn Event Mission
  if (effect.spawnMission) {
    const nearby = getSystemsInRadius(currentSystem, 36).filter(
      (s) => !s.isBlackHole && s.id !== currentSystem.id
    );
    const targetRaw =
      nearby[Math.floor(Math.random() * nearby.length)] ?? currentSystem;
    const targetSys = getEffectiveSystemSummary(targetRaw, next);
    const targetFull = generateSolarSystem(targetSys);
    const targetPlanet = targetFull.planets[0];

    const newMission: Mission = {
      id: `evmis_${session.eventId}_${Date.now()}`,
      title: effect.spawnMission.title,
      type: 'evento_narrativo',
      issuerFactionId: session.contextFactionId ?? next.chosenFactionId,
      targetFactionId: session.rivalFactionId,
      targetSystemId: targetSys.id,
      targetSystemName: targetSys.name,
      targetSystemCoord: { x: targetSys.x, y: targetSys.y, z: targetSys.z },
      targetPlanetId: effect.spawnMission.requiresCombat ? undefined : targetPlanet?.id,
      targetPlanetName: effect.spawnMission.requiresCombat ? undefined : targetPlanet?.name,
      targetEnemyName: effect.spawnMission.requiresCombat ? effect.spawnMission.enemyName : undefined,
      targetEnemyScore: effect.spawnMission.requiresCombat ? 110 : undefined,
      targetEnemyDefeated: false,
      eventId: session.eventId,
      eventFollowUpBranch: effect.spawnMission.followUpSceneId,
      eventFollowUpDone: false,
      rewardCredits: 420,
      rewardRenown: 12,
      isRivalTerritory: false,
      status: 'aceita',
      description: interpolateNarrativeText(effect.spawnMission.description, {
        '{PLANETA}': session.targetPlanetName ?? targetPlanet?.name ?? targetSys.name,
        '{SISTEMA}': targetSys.name,
      }),
    };
    next.missions = [...next.missions, newMission];
    spawnedMissionTitle = newMission.title;
    summaries.push(`Missão de evento adicionada: "${newMission.title}" (${targetSys.name})`);
  }

  return { next, spawnedMissionTitle, hullDestroyed, jumpedSystem };
}

export function resolveNarrativeChoice(
  campaign: PlayerCampaignState,
  session: ActiveNarrativeEventSession,
  choice: NarrativeEventChoice,
  currentSystem: StarSystemFull
): {
  nextCampaign: PlayerCampaignState;
  nextSession: ActiveNarrativeEventSession;
  hullDestroyed: boolean;
  jumpedSystem?: string;
} {
  const summaries: string[] = [];
  let conclusionText = choice.conclusionText;
  let workingCampaign = { ...campaign };

  // Apply bonus from prior "Informação" choice if luck check exists
  let effectToApply: Omit<NarrativeEventEffect, 'luckCheck'> = choice.effects;
  let outcomeTone: ActiveNarrativeEventSession['outcomeTone'];
  if (choice.effects.luckCheck) {
    const bonusPct = workingCampaign.eventNextBonus ? 20 : 0;
    const finalChance = Math.min(92, choice.effects.luckCheck.winChancePct + bonusPct);
    const won = Math.random() * 100 < finalChance;
    outcomeTone = won ? 'sucesso' : 'fracasso';
    if (workingCampaign.eventNextBonus) {
      workingCampaign.eventNextBonus = false;
      summaries.push('Bônus de informação anterior utilizado (+20% chance)');
    }
    conclusionText = `${choice.conclusionText} ${
      won ? choice.effects.luckCheck.successText : choice.effects.luckCheck.failText
    }`;
    effectToApply = won ? choice.effects.luckCheck.successEffect : choice.effects.luckCheck.failEffect;
  }

  const applied = applySingleEffect(
    workingCampaign,
    effectToApply,
    session,
    currentSystem,
    summaries
  );

  const completedIds = new Set(applied.next.completedEventIds ?? []);
  if (!choice.nextSceneId) {
    completedIds.add(session.eventId);
  }

  const nextCampaign: PlayerCampaignState = {
    ...applied.next,
    completedEventIds: Array.from(completedIds),
  };

  const nextSession: ActiveNarrativeEventSession = {
    ...session,
    phase: 'conclusion',
    lastChoiceLabel: choice.label,
    lastConclusionText: conclusionText,
    appliedConsequences: summaries.length > 0 ? summaries : ['Nenhuma perda ou ganho material'],
    pendingNextSceneId: choice.nextSceneId,
    spawnedMissionTitle: applied.spawnedMissionTitle,
    outcomeTone,
  };

  return {
    nextCampaign,
    nextSession,
    hullDestroyed: applied.hullDestroyed,
    jumpedSystem: applied.jumpedSystem,
  };
}
