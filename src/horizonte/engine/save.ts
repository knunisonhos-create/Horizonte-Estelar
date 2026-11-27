import type { InventoryItemRecord, OwnedShip, PlayerCampaignState } from '../types/game';
import { FACTIONS, FACTIONS_BY_ID, getFactionDistanceLy, SPECIES_BY_ID } from '../data/lifeforms';
import { EXTRACTORS_BY_ID, HULLS_BY_ID, SUIT_GEAR_BY_ID } from '../data/items';
import { generateSolarSystem, getSystemSummaryById } from '../data/universe';
import {
  buildGalacticWarsFromActiveMap,
  buildInitialGalacticWars,
  syncActiveWarsMap,
} from './galacticWar';
import { DEFAULT_ORIGIN_BONUSES } from '../data/originPerks';
import { createDefaultCharacterProgress, normalizeCharacterProgress } from './character';
import { isCrewEquipableItem, isManualExtractor, isShipExtractor, getMaxShipExtractors } from './combat';
import { normalizeFactionVault } from './factionVault';
import { emptyFactionCommand, normalizeFactionCommand } from './factionRanks';

function sanitizeIdList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((id): id is string => typeof id === 'string' && id.length > 0);
}

function sanitizePendingHeadquarters(
  raw: unknown
): Array<{ planetId: string; systemId: string; factionId: string }> {
  if (!Array.isArray(raw)) return [];
  const out: Array<{ planetId: string; systemId: string; factionId: string }> = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const row = item as { planetId?: unknown; systemId?: unknown; factionId?: unknown };
    if (typeof row.planetId !== 'string' || typeof row.systemId !== 'string' || typeof row.factionId !== 'string') {
      continue;
    }
    out.push({ planetId: row.planetId, systemId: row.systemId, factionId: row.factionId });
  }
  return out;
}

function sanitizePlanetSales(raw: unknown): Record<string, Record<string, number>> {
  if (!raw || typeof raw !== 'object') return {};
  const out: Record<string, Record<string, number>> = {};
  for (const [planetId, bucket] of Object.entries(raw as Record<string, unknown>)) {
    if (!bucket || typeof bucket !== 'object') continue;
    const next: Record<string, number> = {};
    for (const [resourceId, qty] of Object.entries(bucket as Record<string, unknown>)) {
      const n = Number(qty);
      if (Number.isFinite(n) && n > 0) next[resourceId] = Math.floor(n);
    }
    if (Object.keys(next).length > 0) out[planetId] = next;
  }
  return out;
}

const SAVE_KEY = 'horizonte_estelar_campaign_v1';
export const CURRENT_SAVE_VERSION = 1;

export function createStarterCampaign(
  speciesId: string,
  factionId: string,
  playerName: string,
  playerGender: 'M' | 'F' = 'M'
): PlayerCampaignState {
  const fac = FACTIONS_BY_ID[factionId] ?? FACTIONS[0];
  const sp = SPECIES_BY_ID[speciesId] ?? SPECIES_BY_ID[fac.speciesId];
  const startSysSummary = getSystemSummaryById(fac.capitalSystemId)!;
  const startSysFull = generateSolarSystem(startSysSummary);
  const capitalPlanet = startSysFull.planets.find((p) => p.level === 5) ?? startSysFull.planets[0];

  // Initial jump range is 16 a.l. (Motor de Salto Civil Mk.I)
  // Section 24: player initially knows ONLY chosen faction and neighbors within jump range
  const knownFactions = new Set<string>([fac.id]);
  for (const other of FACTIONS) {
    if (getFactionDistanceLy(fac.id, other.id) <= 28) {
      knownFactions.add(other.id);
    }
  }

  const starterShip: OwnedShip = {
    uid: 'ship_starter_1',
    hullId: 'balsa_estelar_civil',
    factionId: fac.id,
    color: fac.color,
    customName: `${sp.name.slice(0, 5)} Pioneira`,
    avgCostPaid: 900,
    currentHull: HULLS_BY_ID['balsa_estelar_civil'].maxHull,
    currentShield: 0,
    weaponId: 'laser_civil_mk1',
    shieldIds: [],
    jumpDriveId: 'motor_curto_mk1',
    extractorIds: [],
    utilityIds: ['rebocador_carga_mk1'],
    suitGearIds: [],
    depot: [],
  };

  const angle = capitalPlanet.orbitPhase;
  const px = Math.cos(angle) * capitalPlanet.orbitRadius;
  const pz = Math.sin(angle) * capitalPlanet.orbitRadius;

  const initialWars = buildInitialGalacticWars();
  const warsMap = syncActiveWarsMap(initialWars);

  return {
    version: CURRENT_SAVE_VERSION,
    started: true,
    playerName: playerName.trim() || 'Viajante',
    playerGender,
    chosenSpeciesId: sp.id,
    chosenFactionId: fac.id,
    character: createDefaultCharacterProgress(),
    credits: 1200,
    fuel: 100,
    supplies: 150,
    crewHealth: 100,
    healthPotency: 0,
    priceModifierBias: 0,
    currentSystemId: startSysFull.id,
    visitedSystemIds: [startSysFull.id],
    scannedSystemIds: [startSysFull.id],
    scannedPlanetIds: [capitalPlanet.id], // Only origin faction's main planet starts cataloged (Section 18.1)
    scannedCreatureIds: [],
    knownFactionIds: Array.from(knownFactions),
    factionRenown: {
      [fac.id]: 25, // Ally starting standing with home faction
    },
    formalAlliances: [],
    activeWars: warsMap,
    galacticCycle: 1,
    cycleElapsedSec: 0,
    galacticWars: initialWars,
    systemOwnerOverrides: {},
    systemExtractionLicenses: [],
    warHistory: [],
    planetOverrides: {},
    phenomenonCooldowns: {},
    clearedHazards: [],
    ships: [starterShip],
    activeShipUid: starterShip.uid,
    cargo: [],
    consumables: {
      kit_reparo: 1,
      sonda_orbital: 1,
      combustivel_salto: 1,
    },
    blueprintsOwned: [],
    crew: [],
    crewEquipment: [
      {
        uid: 'crew_init_lanterna',
        category: 'suit',
        itemId: 'lanterna_tatica',
        avgCostPaid: SUIT_GEAR_BY_ID['lanterna_tatica']?.price ?? 100,
      },
      {
        uid: 'crew_init_broca',
        category: 'extractor',
        itemId: 'broca_mineral_basica',
        avgCostPaid: EXTRACTORS_BY_ID['broca_mineral_basica']?.price ?? 100,
      },
    ],
    hiredCrewCandidateIds: [],
    missions: [],
    logbook: [
      {
        id: 'log_init_1',
        timestamp: 0,
        category: 'viagem',
        text: `Licença de exploração concedida pela ${fac.name}. Partindo da órbita de ${capitalPlanet.name}.`,
      },
    ],
    gameTimeSeconds: 0,
    playerPos: { x: px, z: pz },
    orbitingPlanetId: capitalPlanet.id,
    openingCompleted: false,
    originBonuses: { ...DEFAULT_ORIGIN_BONUSES },
    specialAbilityIds: [],
    abilityCooldowns: {},
    chosenOriginSummary: [],
    lifeScale: 3,
    craftedBlueprintIds: [],
    pendingHeadquarters: [],
    planetSales: {},
    planetPurchases: {},
    factionVault: normalizeFactionVault(null),
    factionCommand: emptyFactionCommand(),
    completedEventIds: [],
    eventNextBonus: false,
    eventAiAwakened: false,
    eventCosmicSeedActive: false,
    eventCooldownSec: 0,
  };
}

export function validateAndMigrateSave(raw: unknown): PlayerCampaignState | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Partial<PlayerCampaignState>;
  if (
    typeof obj.currentSystemId !== 'string' ||
    !Array.isArray(obj.ships) ||
    obj.ships.length === 0 ||
    typeof obj.chosenFactionId !== 'string'
  ) {
    return null;
  }

  // Ensure system exists
  if (!getSystemSummaryById(obj.currentSystemId)) {
    return null;
  }

  const rawActiveWars = obj.activeWars && typeof obj.activeWars === 'object' ? obj.activeWars : {};
  const migratedWars =
    Array.isArray(obj.galacticWars) && obj.galacticWars.length > 0
      ? obj.galacticWars
      : buildGalacticWarsFromActiveMap(rawActiveWars);
  const syncedWarsMap = syncActiveWarsMap(migratedWars);

  const migratedCrewEquipment: InventoryItemRecord[] = [];
  if (Array.isArray(obj.crewEquipment)) {
    for (const rawItem of obj.crewEquipment) {
      if (!rawItem || typeof rawItem !== 'object') continue;
      const rec = rawItem as Partial<InventoryItemRecord>;
      if (
        (rec.category === 'suit' || rec.category === 'extractor') &&
        typeof rec.itemId === 'string' &&
        isCrewEquipableItem(rec.category, rec.itemId)
      ) {
        migratedCrewEquipment.push({
          uid:
            typeof rec.uid === 'string' && rec.uid
              ? rec.uid
              : `creweq_${migratedCrewEquipment.length}_${rec.itemId}`,
          category: rec.category,
          itemId: rec.itemId,
          avgCostPaid: Number.isFinite(rec.avgCostPaid) ? Number(rec.avgCostPaid) : 0,
        });
      }
    }
  }

  const migratedShips: OwnedShip[] = obj.ships.map((s, shipIdx) => {
    const hullDef = HULLS_BY_ID[s.hullId];
    const fId = s.factionId ?? hullDef?.factionExclusiveId ?? obj.chosenFactionId;
    const shipColor = (fId ? FACTIONS_BY_ID[fId]?.color : undefined) ?? '#38bdf8';
    const scaledHull = (obj.lifeScale ?? 1) < 3 ? Math.round((s.currentHull ?? 0) * 3) : (s.currentHull ?? 0);
    const cap = hullDef?.maxHull ?? scaledHull;

    const rawDepot = Array.isArray(s.depot) ? [...s.depot] : [];

    // Migrate legacy ship suitGearIds -> campaign crewEquipment
    const legacySuits = Array.isArray(s.suitGearIds) ? s.suitGearIds : [];
    legacySuits.forEach((suitId, idx) => {
      if (typeof suitId === 'string' && SUIT_GEAR_BY_ID[suitId]) {
        migratedCrewEquipment.push({
          uid: `mig_suit_${shipIdx}_${idx}_${suitId}`,
          category: 'suit',
          itemId: suitId,
          avgCostPaid: SUIT_GEAR_BY_ID[suitId]?.price ?? 0,
        });
      }
    });

    // Separate manual extractors (move to crewEquipment) vs ship extractors (cap to min(2, extractionSlots))
    const rawExtractors = Array.isArray(s.extractorIds) ? s.extractorIds : [];
    const maxShipExtractors = hullDef ? getMaxShipExtractors(hullDef) : 1;
    const keptShipExtractors: string[] = [];
    rawExtractors.forEach((exId, idx) => {
      if (typeof exId !== 'string') return;
      if (isManualExtractor(exId)) {
        migratedCrewEquipment.push({
          uid: `mig_ext_${shipIdx}_${idx}_${exId}`,
          category: 'extractor',
          itemId: exId,
          avgCostPaid: EXTRACTORS_BY_ID[exId]?.price ?? 0,
        });
      } else if (isShipExtractor(exId)) {
        if (keptShipExtractors.length < maxShipExtractors) {
          keptShipExtractors.push(exId);
        } else {
          rawDepot.push({
            uid: `mig_dep_ext_${shipIdx}_${idx}_${exId}`,
            category: 'extractor',
            itemId: exId,
            avgCostPaid: EXTRACTORS_BY_ID[exId]?.price ?? 0,
          });
        }
      }
    });

    return {
      ...s,
      factionId: fId,
      color: shipColor,
      currentHull: Math.max(1, Math.min(cap, scaledHull)),
      jumpDriveId: typeof s.jumpDriveId === 'string' ? s.jumpDriveId : 'motor_curto_mk1',
      depot: rawDepot,
      suitGearIds: [],
      shieldIds: Array.isArray(s.shieldIds) ? s.shieldIds : [],
      extractorIds: keptShipExtractors,
      utilityIds: Array.isArray(s.utilityIds) ? s.utilityIds : [],
    };
  });

  // Migrate missing arrays/fields from older save formats safely
  return {
    version: CURRENT_SAVE_VERSION,
    started: obj.started ?? true,
    playerName: typeof obj.playerName === 'string' ? obj.playerName : 'Viajante',
    playerGender: obj.playerGender === 'F' ? 'F' : 'M',
    chosenSpeciesId: obj.chosenSpeciesId ?? 'solarianos',
    chosenFactionId: obj.chosenFactionId,
    character: normalizeCharacterProgress(obj.character),
    credits: Number.isFinite(obj.credits) ? Number(obj.credits) : 1000,
    fuel: Number.isFinite(obj.fuel) ? Number(obj.fuel) : 100,
    supplies: Number.isFinite(obj.supplies) ? Number(obj.supplies) : 150,
    crewHealth: Number.isFinite(obj.crewHealth) ? Number(obj.crewHealth) : 100,
    healthPotency: Number.isFinite(obj.healthPotency) ? Number(obj.healthPotency) : 0,
    priceModifierBias: Number.isFinite(obj.priceModifierBias) ? Number(obj.priceModifierBias) : 0,
    currentSystemId: obj.currentSystemId,
    visitedSystemIds: Array.isArray(obj.visitedSystemIds) ? obj.visitedSystemIds : [obj.currentSystemId],
    scannedSystemIds: Array.isArray(obj.scannedSystemIds) ? obj.scannedSystemIds : [obj.currentSystemId],
    scannedPlanetIds: Array.isArray(obj.scannedPlanetIds) ? obj.scannedPlanetIds : [],
    scannedCreatureIds: Array.isArray(obj.scannedCreatureIds) ? obj.scannedCreatureIds : [],
    knownFactionIds: Array.isArray(obj.knownFactionIds) ? obj.knownFactionIds : [obj.chosenFactionId],
    factionRenown: obj.factionRenown && typeof obj.factionRenown === 'object' ? obj.factionRenown : {},
    formalAlliances: Array.isArray(obj.formalAlliances) ? obj.formalAlliances : [],
    activeWars: syncedWarsMap,
    galacticCycle: Number.isFinite(obj.galacticCycle) ? Number(obj.galacticCycle) : 1,
    cycleElapsedSec: Number.isFinite(obj.cycleElapsedSec) ? Number(obj.cycleElapsedSec) : 0,
    galacticWars: migratedWars,
    systemOwnerOverrides:
      obj.systemOwnerOverrides && typeof obj.systemOwnerOverrides === 'object' ? obj.systemOwnerOverrides : {},
    systemExtractionLicenses: Array.isArray(obj.systemExtractionLicenses) ? obj.systemExtractionLicenses : [],
    warHistory: Array.isArray(obj.warHistory) ? obj.warHistory : [],
    planetOverrides: obj.planetOverrides && typeof obj.planetOverrides === 'object' ? obj.planetOverrides : {},
    phenomenonCooldowns: obj.phenomenonCooldowns && typeof obj.phenomenonCooldowns === 'object' ? obj.phenomenonCooldowns : {},
    clearedHazards: Array.isArray(obj.clearedHazards) ? obj.clearedHazards.filter((id) => typeof id === 'string') : [],
    ships: migratedShips,
    activeShipUid: obj.activeShipUid ?? obj.ships[0].uid,
    cargo: Array.isArray(obj.cargo) ? obj.cargo : [],
    consumables: obj.consumables && typeof obj.consumables === 'object' ? obj.consumables : {},
    blueprintsOwned: Array.isArray(obj.blueprintsOwned) ? obj.blueprintsOwned : [],
    crew: Array.isArray(obj.crew) ? obj.crew : [],
    crewEquipment: migratedCrewEquipment,
    hiredCrewCandidateIds: sanitizeIdList(obj.hiredCrewCandidateIds),
    missions: Array.isArray(obj.missions) ? obj.missions : [],
    logbook: Array.isArray(obj.logbook) ? obj.logbook : [],
    gameTimeSeconds: Number.isFinite(obj.gameTimeSeconds) ? Number(obj.gameTimeSeconds) : 0,
    playerPos: obj.playerPos ?? { x: 25, z: 0 },
    orbitingPlanetId: obj.orbitingPlanetId ?? null,
    openingCompleted: typeof obj.openingCompleted === 'boolean' ? obj.openingCompleted : true,
    originBonuses:
      obj.originBonuses && typeof obj.originBonuses === 'object'
        ? { ...DEFAULT_ORIGIN_BONUSES, ...obj.originBonuses }
        : { ...DEFAULT_ORIGIN_BONUSES },
    specialAbilityIds: Array.isArray(obj.specialAbilityIds) ? obj.specialAbilityIds : [],
    abilityCooldowns:
      obj.abilityCooldowns && typeof obj.abilityCooldowns === 'object' ? obj.abilityCooldowns : {},
    chosenOriginSummary: Array.isArray(obj.chosenOriginSummary) ? obj.chosenOriginSummary : [],
    lifeScale: 3,
    craftedBlueprintIds: sanitizeIdList(obj.craftedBlueprintIds),
    pendingHeadquarters: sanitizePendingHeadquarters(obj.pendingHeadquarters),
    planetSales: sanitizePlanetSales(obj.planetSales),
    planetPurchases: sanitizePlanetSales(obj.planetPurchases),
    factionVault: normalizeFactionVault(obj.factionVault),
    factionCommand: normalizeFactionCommand(obj.factionCommand),
    completedEventIds: Array.isArray(obj.completedEventIds)
      ? obj.completedEventIds.filter((id): id is number => typeof id === 'number' && Number.isInteger(id))
      : [],
    eventNextBonus: Boolean(obj.eventNextBonus),
    eventCrewBuffLabel: typeof obj.eventCrewBuffLabel === 'string' ? obj.eventCrewBuffLabel : undefined,
    eventCrewBuffUntilSec: Number.isFinite(obj.eventCrewBuffUntilSec) ? Number(obj.eventCrewBuffUntilSec) : undefined,
    eventAiAwakened: Boolean(obj.eventAiAwakened),
    eventCosmicSeedActive: Boolean(obj.eventCosmicSeedActive),
    eventCooldownSec: Number.isFinite(obj.eventCooldownSec) ? Number(obj.eventCooldownSec) : 0,
  };
}

export function loadSavedCampaign(): PlayerCampaignState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return validateAndMigrateSave(parsed);
  } catch {
    return null;
  }
}

export function saveCampaign(state: PlayerCampaignState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function clearSavedCampaign(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // Ignore
  }
}
