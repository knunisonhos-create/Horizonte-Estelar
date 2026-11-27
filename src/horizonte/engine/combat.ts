import type {
  ActiveEnemy,
  CrewMember,
  CrewRole,
  FactionTechStyle,
  InventoryItemRecord,
  OwnedShip,
  PlayerCampaignState,
  WeaponDamageType,
} from '../types/game';
import {
  EXTRACTORS_BY_ID,
  HULLS_BY_ID,
  JUMP_DRIVES_BY_ID,
  SHIELDS_BY_ID,
  SUIT_GEAR_BY_ID,
  UTILITY_BY_ID,
  WEAPONS_BY_ID,
} from '../data/items';
import { FACTIONS_BY_ID, SPECIES_BY_ID } from '../data/lifeforms';
import { DEFAULT_ORIGIN_BONUSES } from '../data/originPerks';
import { computeCharacterModifiers } from './character';

export const TECH_SYNERGY_BONUS = {
  hullPct: 0.1,
  speedPct: 0.15,
  weaponDpsPct: 0.18,
  shieldPct: 0.18,
  jumpRangePct: 0.15,
  jumpFuelMult: 0.85,
  utilityPct: 0.2,
  extractorPct: 0.25,
  suitPct: 0.25,
  consumablePct: 0.35,
  resourceSellPct: 0.15,
  resourceBuyMult: 0.9,
  resourceExtractPct: 0.15,
} as const;

export interface CrewBonuses {
  navFuelMult: number;       // reduces fuel consumption
  shieldCapMult: number;     // increases max shield
  shieldRegenMult: number;   // increases shield recharge
  hullRegenPerSec: number;   // passive hull restoration
  repairKitMult: number;     // boosts repair kit effect
  tradePriceBonus: number;   // improves buy/sell prices (0..0.45)
  explorerBonus: number;     // boosts ground expedition & reduces cooldown
  minerRateMult: number;     // increases mining speed (up to +100%+)
  diplomatRenownMult: number;// boosts mission renown & reduces cooldown/alliance req
  supplyCostMult: number;    // reduces supply consumption & hire cost
  combatDpsMult: number;     // origin weapon DPS multiplier
  hullFlatBonus: number;     // flat hull integrity bonus
  cargoFlatBonus: number;    // flat cargo bonus
  cloakBonus: number;        // origin stealth bonus
  hazardResistBonus: number; // origin environmental hazard resistance
  warScoreMult: number;      // galactic war impact multiplier
  fleeBonusPct: number;      // evasion bonus from origin + pilot navigator + character
  hullMult: number;          // hull multiplier from character engineering attribute
  speedMult: number;         // flight speed multiplier from character navigation attribute
  consumableMult: number;    // consumable potency multiplier from character exploration attribute
  explorerPowerMult: number; // ground exploration success multiplier from character
  hazardDamageMult: number;  // environmental damage reduction multiplier from character
  activeTechCategory: FactionTechStyle; // active technological category defined by chosen species
}

export function computeCrewHarmony(state: PlayerCampaignState): {
  distinctRaces: number;
  harmonyPct: number;
  efficiencyBonusPct: number;
  efficiencyMult: number;
} {
  const speciesSet = new Set<string>();
  if (state.chosenSpeciesId) speciesSet.add(state.chosenSpeciesId);
  for (const member of state.crew) {
    if (member.speciesId) speciesSet.add(member.speciesId);
  }
  const distinctRaces = Math.max(1, speciesSet.size);
  const harmonyPct = Math.round(100 / distinctRaces);
  const efficiencyBonusPct = harmonyPct - 50;
  const efficiencyMult = Math.max(0.1, 1 + efficiencyBonusPct / 100);
  return {
    distinctRaces,
    harmonyPct,
    efficiencyBonusPct,
    efficiencyMult,
  };
}

export function getEffectiveRoleSkill(
  crew: CrewMember[],
  role: CrewRole,
  hasSupplies: boolean,
  efficiencyRatio = 1
): number {
  const active = crew.find((c) => c.status === 'ativo' && c.role === role);
  if (!active) return 0;
  const reserveCount = crew.filter((c) => c.status === 'reserva' && c.role === role).length;
  const raw = active.skill * (1 + reserveCount * 0.05);
  const fed = hasSupplies ? raw : raw * 0.5;
  return fed * Math.max(0, efficiencyRatio);
}

export function crewHealthRatio(state: PlayerCampaignState): number {
  const max = 100 + Math.max(0, state.healthPotency ?? 0);
  return Math.max(0, Math.min(1, (state.crewHealth ?? 100) / max));
}

export function computeCrewBonuses(state: PlayerCampaignState): CrewBonuses {
  const hasSupplies = state.supplies > 0;
  const healthRatio = crewHealthRatio(state);
  const harmony = computeCrewHarmony(state);
  const effRatio = healthRatio * harmony.efficiencyMult;
  const ob = state.originBonuses ?? DEFAULT_ORIGIN_BONUSES;
  const nav = getEffectiveRoleSkill(state.crew, 'piloto_navegador', hasSupplies, effRatio);
  const combat = getEffectiveRoleSkill(state.crew, 'piloto_combate', hasSupplies, effRatio);
  const eng = getEffectiveRoleSkill(state.crew, 'engenheiro', hasSupplies, effRatio);
  const neg = getEffectiveRoleSkill(state.crew, 'negociador', hasSupplies, effRatio);
  const exp = getEffectiveRoleSkill(state.crew, 'explorador', hasSupplies, effRatio);
  const min = getEffectiveRoleSkill(state.crew, 'minerador', hasSupplies, effRatio);
  const dip = getEffectiveRoleSkill(state.crew, 'diplomata', hasSupplies, effRatio);
  const master = getEffectiveRoleSkill(state.crew, 'mestre_tripulacao', hasSupplies, effRatio);

  const charMods = computeCharacterModifiers(state.character);
  const activeTechCategory: FactionTechStyle =
    SPECIES_BY_ID[state.chosenSpeciesId]?.techCategory ?? 'mercantil';

  const sq = computeSquadronBonus(state);
  const sqMult = sq.active && sq.bonusPct > 0 ? 1 + sq.bonusPct / 100 : 1;

  return {
    navFuelMult: Math.max(0.28, (1 - nav * 0.0045) * ob.fuelCostMult * charMods.fuelMult),
    shieldCapMult: (1 + combat * 0.006) * ob.shieldCapMult * charMods.shieldMult * sqMult,
    shieldRegenMult: (1 + combat * 0.008) * ob.shieldRegenMult * charMods.shieldMult,
    hullRegenPerSec: eng * 0.035 + ob.hullRegenPerSec + charMods.hullRegenBonus,
    repairKitMult: (1 + eng * 0.007) * charMods.consumableMult,
    tradePriceBonus: Math.min(0.85, neg * 0.0028 + ob.tradePriceBonus + charMods.tradeBonusPct),
    explorerBonus: (exp + ob.explorerBonus) * charMods.explorerPowerMult + (charMods.explorerPowerMult - 1) * 45,
    minerRateMult: (1 + Math.min(1.3, min * 0.01)) * ob.minerRateMult * charMods.minerRateMult,
    diplomatRenownMult: (1 + dip * 0.006) * ob.renownGainMult * charMods.renownMult,
    supplyCostMult: Math.max(0.12, Math.max(0.15, 1 - master * 0.011) * ob.supplyCostMult * charMods.supplyCostMult),
    combatDpsMult: ob.combatDpsMult * charMods.dpsMult * sqMult,
    hullFlatBonus: ob.hullFlatBonus,
    cargoFlatBonus: ob.cargoFlatBonus + charMods.cargoFlatBonus,
    cloakBonus: ob.cloakBonus,
    hazardResistBonus: ob.hazardResistBonus,
    warScoreMult: ob.warScoreMult,
    fleeBonusPct: Math.round((ob.fleeBonusPct ?? 0) + nav * 0.14 + charMods.fleeBonusPct),
    hullMult: charMods.hullMult,
    speedMult: charMods.speedMult,
    consumableMult: charMods.consumableMult,
    explorerPowerMult: charMods.explorerPowerMult,
    hazardDamageMult: charMods.hazardDamageMult,
    activeTechCategory,
  };
}

export const CREW_BASE_SUPPLY_DRAIN_FACTOR = (1.5 / 2.5) * 0.34;

export function computeCrewMemberSupplyPerMin(
  member: CrewMember,
  supplyCostMult: number,
  isBulkActiveCrew = false
): number {
  const weight = member.status === 'reserva' ? 0.5 : isBulkActiveCrew ? 0.65 : 1.0;
  return member.skill * weight * supplyCostMult * CREW_BASE_SUPPLY_DRAIN_FACTOR;
}

export function computeCrewSupplyDrainPerSec(crew: CrewMember[], supplyCostMult: number): number {
  let activeCount = 0;
  let totalPerMin = 0;
  for (const member of crew) {
    const isBulk = member.status === 'ativo' && activeCount >= 3;
    if (member.status === 'ativo') activeCount += 1;
    totalPerMin += computeCrewMemberSupplyPerMin(member, supplyCostMult, isBulk);
  }
  return totalPerMin / 60;
}

export function getEffectiveExtractorRate(
  extractorIds: string[],
  extractionClass: string,
  activeTechCategory: FactionTechStyle,
  minerRateMult: number,
  resourceTechCategory?: FactionTechStyle
): number {
  const extractors = extractorIds
    .map((id) => EXTRACTORS_BY_ID[id])
    .filter((ex) => ex && ex.extractionClass === extractionClass);

  const shipExtractors = extractors.filter((ex) => ex.extractorScope === 'nave');
  // Extratores de nave dão acesso à extração (80% da potência base)
  if (shipExtractors.length === 0) return 0;

  const manualExtractors = extractors.filter((ex) => ex.extractorScope === 'manual');

  const shipBaseRate = shipExtractors.reduce(
    (sum, ex) => sum + ex.ratePerSec * (ex.factionStyle === activeTechCategory ? 1 + TECH_SYNERGY_BONUS.extractorPct : 1),
    0
  ) * 0.8;

  // Extratores manuais sozinhos não extraem nada; potencializam a extração da nave
  const manualAmplification = manualExtractors.reduce(
    (sum, ex) => sum + ex.ratePerSec * 0.25 * (ex.factionStyle === activeTechCategory ? 1.25 : 1),
    0
  );

  const baseRate = shipBaseRate + manualAmplification;
  const resMult = resourceTechCategory === activeTechCategory ? 1 + TECH_SYNERGY_BONUS.resourceExtractPct : 1;
  return baseRate * minerRateMult * resMult;
}

export function isManualExtractor(itemId: string): boolean {
  return EXTRACTORS_BY_ID[itemId]?.extractorScope === 'manual';
}

export function isShipExtractor(itemId: string): boolean {
  const ex = EXTRACTORS_BY_ID[itemId];
  return Boolean(ex && ex.extractorScope === 'nave');
}

export function isCrewEquipableItem(category: InventoryItemRecord['category'], itemId: string): boolean {
  if (category === 'suit') return Boolean(SUIT_GEAR_BY_ID[itemId]);
  if (category === 'extractor') return isManualExtractor(itemId);
  return false;
}

export function getCrewSuitIds(campaign: Pick<PlayerCampaignState, 'crewEquipment'>): string[] {
  return (campaign.crewEquipment ?? [])
    .filter((item) => item.category === 'suit' && Boolean(SUIT_GEAR_BY_ID[item.itemId]))
    .map((item) => item.itemId);
}

export function getCrewManualExtractorIds(campaign: Pick<PlayerCampaignState, 'crewEquipment'>): string[] {
  return (campaign.crewEquipment ?? [])
    .filter((item) => item.category === 'extractor' && isManualExtractor(item.itemId))
    .map((item) => item.itemId);
}

export function getCrewItemMaintenancePerCycle(
  category: InventoryItemRecord['category'],
  itemId: string
): number {
  const price =
    category === 'suit'
      ? SUIT_GEAR_BY_ID[itemId]?.price ?? 0
      : category === 'extractor'
        ? EXTRACTORS_BY_ID[itemId]?.price ?? 0
        : 0;
  if (price <= 0) return 0;
  return Math.max(4, Math.round(price * 0.03));
}

export function computeCrewEquipmentMaintenance(
  campaign: Pick<PlayerCampaignState, 'crewEquipment'>
): { totalCost: number; itemCount: number } {
  const list = campaign.crewEquipment ?? [];
  let totalCost = 0;
  for (const item of list) {
    totalCost += getCrewItemMaintenancePerCycle(item.category, item.itemId);
  }
  return { totalCost, itemCount: list.length };
}

export function getSuitGearEffectiveStats(
  suitGearIds: string[],
  activeTechCategory: FactionTechStyle
): { explorationBonus: number; combatPower: number; matchedCount: number } {
  let explorationBonus = 0;
  let combatPower = 0;
  let matchedCount = 0;
  for (const id of suitGearIds) {
    const g = SUIT_GEAR_BY_ID[id];
    if (!g) continue;
    const matched = g.factionStyle === activeTechCategory;
    if (matched) matchedCount += 1;
    const mult = matched ? 1 + TECH_SYNERGY_BONUS.suitPct : 1;
    explorationBonus += Math.round(g.explorationBonus * mult);
    combatPower += Math.round(g.combatPower * mult);
  }
  return { explorationBonus, combatPower, matchedCount };
}

export function computeShipDerivedStats(ship: OwnedShip, bonuses: CrewBonuses) {
  const hull = HULLS_BY_ID[ship.hullId];
  const weapon = ship.weaponId ? WEAPONS_BY_ID[ship.weaponId] : null;
  const shields = ship.shieldIds.map((id) => SHIELDS_BY_ID[id]).filter(Boolean);
  const jumpDrive = ship.jumpDriveId ? JUMP_DRIVES_BY_ID[ship.jumpDriveId] : undefined;
  const utilities = ship.utilityIds.map((id) => UTILITY_BY_ID[id]).filter(Boolean);

  const techCategory: FactionTechStyle = bonuses.activeTechCategory;

  const hullMatched = hull.factionStyle === techCategory;
  const weaponMatched = Boolean(weapon && weapon.factionStyle === techCategory);
  const matchedShieldCount = shields.filter((sh) => sh.factionStyle === techCategory).length;
  const jumpDriveMatched = Boolean(jumpDrive && jumpDrive.factionStyle === techCategory);
  const matchedUtilityCount = utilities.filter((u) => u.factionStyle === techCategory).length;
  const matchedExtractorCount = ship.extractorIds.filter(
    (id) => EXTRACTORS_BY_ID[id]?.factionStyle === techCategory
  ).length;
  const matchedSuitCount = 0;

  const cargoBonus = utilities
    .filter((u) => u.kind === 'carga')
    .reduce((s, u) => s + Math.round(u.bonusValue * (u.factionStyle === techCategory ? 1 + TECH_SYNERGY_BONUS.utilityPct : 1)), 0);
  const fuelBonus = utilities
    .filter((u) => u.kind === 'tanque')
    .reduce((s, u) => s + Math.round(u.bonusValue * (u.factionStyle === techCategory ? 1 + TECH_SYNERGY_BONUS.utilityPct : 1)), 0);
  const cloakBonus = utilities
    .filter((u) => u.kind === 'camuflagem')
    .reduce((s, u) => Math.max(s, u.bonusValue * (u.factionStyle === techCategory ? 1 + TECH_SYNERGY_BONUS.utilityPct : 1)), 0);
  const warpFuelSave = utilities
    .filter((u) => u.kind === 'dobra')
    .reduce((s, u) => s + u.bonusValue * (u.factionStyle === techCategory ? 1 + TECH_SYNERGY_BONUS.utilityPct : 1), 0);
  const hasLongScanner = utilities.some((u) => u.kind === 'scanner');

  const maxHull = Math.round(
    (hull.maxHull * (hullMatched ? 1 + TECH_SYNERGY_BONUS.hullPct : 1) + (bonuses.hullFlatBonus ?? 0)) *
      (bonuses.hullMult ?? 1)
  );
  const baseShieldCap = shields.reduce(
    (s, sh) => s + sh.capacity * (sh.factionStyle === techCategory ? 1 + TECH_SYNERGY_BONUS.shieldPct : 1),
    0
  );
  const maxShield = Math.round(baseShieldCap * bonuses.shieldCapMult);
  const shieldRegen =
    shields.reduce(
      (s, sh) => s + sh.rechargePerSec * (sh.factionStyle === techCategory ? 1 + TECH_SYNERGY_BONUS.shieldPct : 1),
      0
    ) * bonuses.shieldRegenMult;

  const mitigation: Record<WeaponDamageType, number> = {
    laser: 0,
    cinetica: 0,
    plasma: 0,
    missil: 0,
  };
  let reflectRatio = 0;
  for (const sh of shields) {
    (['laser', 'cinetica', 'plasma', 'missil'] as WeaponDamageType[]).forEach((t) => {
      // Combine multiplicatively and cap strictly at 85% (Section 16.1)
      mitigation[t] = Math.min(0.85, 1 - (1 - mitigation[t]) * (1 - sh.mitigation[t]));
    });
    reflectRatio = Math.min(0.45, reflectRatio + (sh.reflectDamageRatio ?? 0));
  }

  const effectiveDps = weapon
    ? Math.round(
        weapon.dps *
          (weaponMatched ? 1 + TECH_SYNERGY_BONUS.weaponDpsPct : 1) *
          (bonuses.combatDpsMult ?? 1) *
          10
      ) / 10
    : 0;
  const effectiveSpeed =
    Math.round(hull.speed * (hullMatched ? 1 + TECH_SYNERGY_BONUS.speedPct : 1) * (bonuses.speedMult ?? 1) * 10) / 10;

  // Calibrated to Section 16.7:
  // Fragata Metalocto (280 hull, 45 armor) + Emissor Gama de Pulsar (155 dps, atk 5)
  // + 2x Egide Quantica Soberana (320 cap each, 0.85 mitigation) + lvl 98 crew -> ~2,650 combat score
  const avgMit = (mitigation.laser + mitigation.cinetica + mitigation.plasma + mitigation.missil) / 4;
  const effectiveHpScore =
    (maxHull + hull.armor * 2.5 + maxShield * 1.15) * (1 / Math.max(0.22, 1 - avgMit * 0.72));
  const offenseScore = weapon ? effectiveDps * 2.2 + weapon.attackLevel * 28 : 0;
  const combatScore = Math.round(effectiveHpScore * 0.65 + offenseScore);

  return {
    maxHull,
    armor: hull.armor,
    maxShield,
    shieldRegen,
    mitigation,
    reflectRatio,
    weapon,
    dps: effectiveDps,
    attackLevel: weapon ? weapon.attackLevel : 0,
    weaponRange: weapon ? weapon.range : 16,
    cargoCapacity: hull.cargoCapacity + cargoBonus + (bonuses.cargoFlatBonus ?? 0),
    fuelCapacity: hull.fuelCapacity + fuelBonus,
    jumpRangeLy: jumpDrive
      ? Math.round(jumpDrive.jumpRangeLy * (jumpDriveMatched ? 1 + TECH_SYNERGY_BONUS.jumpRangePct : 1))
      : 0,
    fuelEfficiency:
      (jumpDrive ? jumpDrive.fuelEfficiency * (jumpDriveMatched ? TECH_SYNERGY_BONUS.jumpFuelMult : 1) : 1) *
      Math.max(0.4, 1 - warpFuelSave) *
      bonuses.navFuelMult,
    cloakReduction: Math.min(0.8, cloakBonus + (bonuses.cloakBonus ?? 0)),
    hasLongScanner,
    speed: effectiveSpeed,
    combatScore,
    techSynergy: {
      activeTechCategory: techCategory,
      hullMatched,
      weaponMatched,
      matchedShieldCount,
      jumpDriveMatched,
      matchedUtilityCount,
      matchedExtractorCount,
      matchedSuitCount,
    },
  };
}

function rarityTierNum(rarity?: string): number {
  if (rarity === 'lendário') return 5;
  if (rarity === 'épico') return 4;
  if (rarity === 'raro') return 3;
  if (rarity === 'incomum') return 2;
  return 1;
}

export function computeShipTechLevel(ship: OwnedShip): 1 | 2 | 3 | 4 | 5 {
  const hull = HULLS_BY_ID[ship.hullId];
  const weapon = ship.weaponId ? WEAPONS_BY_ID[ship.weaponId] : null;
  const shields = ship.shieldIds.map((id) => SHIELDS_BY_ID[id]).filter(Boolean);
  const jumpDrive = ship.jumpDriveId ? JUMP_DRIVES_BY_ID[ship.jumpDriveId] : undefined;

  const hullTier = rarityTierNum(hull?.rarity);
  const weaponTier = weapon ? weapon.attackLevel : 1;
  const shieldTier =
    shields.length > 0
      ? shields.reduce((acc, s) => acc + rarityTierNum(s.rarity), 0) / shields.length
      : 1;
  const driveTier = rarityTierNum(jumpDrive?.rarity);

  const avg = hullTier * 0.4 + weaponTier * 0.25 + shieldTier * 0.2 + driveTier * 0.15;
  return Math.max(1, Math.min(5, Math.round(avg))) as 1 | 2 | 3 | 4 | 5;
}

export function computeSquadronBonus(state: PlayerCampaignState): {
  active: boolean;
  bonusPct: number;
  ships: Array<{ ship: OwnedShip; techLevel: 1 | 2 | 3 | 4 | 5 }>;
} {
  const renown = state.factionRenown?.[state.chosenFactionId] ?? 0;
  const cmd = state.factionCommand;
  if (renown < 100 || cmd?.rank3Choice !== 'esquadrao') {
    return { active: false, bonusPct: 0, ships: [] };
  }
  const seen = new Set<string>();
  const linked: Array<{ ship: OwnedShip; techLevel: 1 | 2 | 3 | 4 | 5 }> = [];
  for (const uid of cmd.squadronShipUids ?? []) {
    if (!uid || uid === state.activeShipUid || seen.has(uid)) continue;
    const ship = state.ships.find((s) => s.uid === uid);
    if (!ship) continue;
    seen.add(uid);
    linked.push({ ship, techLevel: computeShipTechLevel(ship) });
    if (linked.length >= 3) break;
  }
  const bonusPct = linked.reduce((sum, entry) => sum + entry.techLevel, 0);
  return {
    active: linked.length > 0,
    bonusPct,
    ships: linked,
  };
}

export function computeEnemyOrbitDetectionChancePct(
  planetTech: number,
  shipTech: number,
  cloakReduction: number
): number {
  const techDiff = planetTech - shipTech;
  const raw = 55 + techDiff * 14 - Math.max(0, cloakReduction) * 65;
  return Math.max(5, Math.min(95, Math.round(raw)));
}

/** Recursos, peças guardadas e consumíveis ocupam o mesmo compartimento de carga. */
export function compartmentUsed(state: PlayerCampaignState, ship?: OwnedShip | null): number {
  const resources = state.cargo.reduce((sum, entry) => sum + entry.qty, 0);
  const kits = Object.values(state.consumables ?? {}).reduce((sum, qty) => sum + (Number.isFinite(qty) ? qty : 0), 0);
  const gear = ship?.depot?.length ?? 0;
  return resources + kits + gear;
}

interface EnemyTierSpec {
  baseHull: number;
  baseArmor: number;
  baseShield: number;
  baseShieldRegen: number;
  baseShieldMit: number;
  baseDps: number;
  enhancerMult: number;
  enhancerLabel: string;
}

const ENEMY_TIER_SPECS: Record<number, EnemyTierSpec> = {
  1: {
    baseHull: 82,
    baseArmor: 3,
    baseShield: 32,
    baseShieldRegen: 1.5,
    baseShieldMit: 0.12,
    baseDps: 7.2,
    enhancerMult: 1.12,
    enhancerLabel: 'Tripulação Novata · Reforço Leve',
  },
  2: {
    baseHull: 165,
    baseArmor: 8,
    baseShield: 130,
    baseShieldRegen: 4.5,
    baseShieldMit: 0.26,
    baseDps: 17,
    enhancerMult: 1.28,
    enhancerLabel: 'Tripulação Tática · Núcleo Blindado',
  },
  3: {
    baseHull: 270,
    baseArmor: 16,
    baseShield: 290,
    baseShieldRegen: 9.5,
    baseShieldMit: 0.42,
    baseDps: 36,
    enhancerMult: 1.54,
    enhancerLabel: 'Tripulação Veterana · Matriz Tática',
  },
  4: {
    baseHull: 405,
    baseArmor: 24,
    baseShield: 530,
    baseShieldRegen: 15.5,
    baseShieldMit: 0.54,
    baseDps: 78,
    enhancerMult: 1.9,
    enhancerLabel: 'Tripulação de Elite · Sobrecarga Quântica',
  },
  5: {
    baseHull: 450,
    baseArmor: 19,
    baseShield: 650,
    baseShieldRegen: 15.5,
    baseShieldMit: 0.6,
    baseDps: 150,
    enhancerMult: 2.35,
    enhancerLabel: 'Tripulação Suprema · Potencializador Apex',
  },
};

export function getEnemyCombatShieldRegenPerSec(enemy: Pick<ActiveEnemy, 'shieldRegen' | 'techLevel'>): number {
  const baseRegen = enemy.shieldRegen ?? 1.5 + Math.max(1, enemy.techLevel) * 3.5;
  // Matches player's active-combat 0.55x gradual shield recharge pacing
  return Math.max(0, baseRegen * 0.55);
}

export function applyDamageToEnemy(enemy: ActiveEnemy, rawDmg: number): void {
  if (rawDmg <= 0 || enemy.hull <= 0) return;
  const mit = Math.max(0, Math.min(0.85, enemy.shieldMitigation ?? 0));
  const armor = Math.max(0, enemy.armor ?? 0);
  if (enemy.shield > 0) {
    const mitigated = rawDmg * (1 - mit);
    const absorbed = Math.min(enemy.shield, mitigated);
    enemy.shield -= absorbed;
    const overflow = mitigated - absorbed;
    if (overflow > 0) {
      enemy.hull -= Math.max(0, overflow - armor * 0.25);
    }
  } else {
    enemy.hull -= Math.max(0.5, rawDmg - armor * 0.35);
  }
}

export function buildEnemyWave(
  factionId: string,
  count: number,
  techLevel: number,
  playerPos: { x: number; z: number },
  namePrefix = 'Interceptador',
  options?: { isElite?: boolean }
): ActiveEnemy[] {
  const dmgTypes: WeaponDamageType[] = ['laser', 'cinetica', 'plasma', 'missil'];
  const safeCount = Math.max(1, Math.round(count));
  const clampedTech = Math.max(1, Math.min(5, Math.round(techLevel)));
  const spec = ENEMY_TIER_SPECS[clampedTech] ?? ENEMY_TIER_SPECS[1];
  const fac = FACTIONS_BY_ID[factionId];
  const axis = fac?.axis;

  // Player fights as 1 ship (+up to 15% from Squadron). Sub-linear wave budget ensures
  // 2..5 simultaneous enemy ships scale to ~1.28x..1.70x total instead of 2x..5x.
  const squadScale =
    safeCount === 1
      ? 1.0
      : safeCount === 2
        ? 0.64
        : safeCount === 3
          ? 0.48
          : safeCount === 4
            ? 0.39
            : 1.7 / safeCount;
  const mitGroupScale = safeCount === 1 ? 1.0 : Math.max(0.76, 1 - (safeCount - 1) * 0.06);

  // Faction-axis specialization & optional elite bonus mirror player's Origin & Rank perks
  const hullAxisMult = axis === 'Militar' || axis === 'Tradicionalistas' ? 1.08 : 1.0;
  const shieldAxisMult = axis === 'Mercantil' || axis === 'Reformistas' ? 1.1 : 1.0;
  const regenAxisMult = axis === 'Reformistas' || axis === 'Mercantil' ? 1.12 : 1.0;
  const dpsAxisMult = axis === 'Militar' ? 1.1 : 1.0;
  const mitAxisBonus = axis === 'Tradicionalistas' || axis === 'Reformistas' ? 0.04 : 0;

  const eliteMult = options?.isElite ? 1.12 : 1.0;
  const effectiveMult = spec.enhancerMult * eliteMult;

  const maxHull = Math.max(24, Math.round(spec.baseHull * effectiveMult * hullAxisMult * squadScale));
  const armor = Math.max(1, Math.round(spec.baseArmor * effectiveMult * Math.max(0.55, squadScale)));
  const maxShield = Math.max(10, Math.round(spec.baseShield * effectiveMult * shieldAxisMult * squadScale));
  const shieldRegen = Math.max(0.4, Math.round(spec.baseShieldRegen * effectiveMult * regenAxisMult * squadScale * 10) / 10);
  const shieldMitigation = Math.min(
    0.78,
    Math.round((spec.baseShieldMit + mitAxisBonus) * mitGroupScale * 100) / 100
  );
  const dps = Math.max(2, Math.round(spec.baseDps * effectiveMult * dpsAxisMult * squadScale * 10) / 10);

  const enhancerBonusPct = Math.round((effectiveMult - 1) * 100);
  const enhancerLabel = options?.isElite ? `${spec.enhancerLabel} (Elite)` : spec.enhancerLabel;

  // Same combatScore calibration as computeShipDerivedStats for true player/enemy parity
  const effectiveHpScore =
    (maxHull + armor * 2.5 + maxShield * 1.15) * (1 / Math.max(0.22, 1 - shieldMitigation * 0.72));
  const offenseScore = dps * 2.2 + clampedTech * 28;
  const combatScore = Math.round(effectiveHpScore * 0.65 + offenseScore);

  return Array.from({ length: safeCount }, (_, i) => {
    const a = (i / safeCount) * Math.PI * 2 + Math.random() * 0.6;
    const dist = 24 + i * 5;
    return {
      id: `en_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 6)}`,
      name: safeCount > 1 ? `${namePrefix} ${i + 1}` : namePrefix,
      factionId,
      techLevel: clampedTech,
      hull: maxHull,
      maxHull,
      shield: maxShield,
      maxShield,
      armor,
      shieldRegen,
      shieldMitigation,
      enhancerBonusPct,
      enhancerLabel,
      dps,
      damageType: dmgTypes[(clampedTech + i) % dmgTypes.length],
      combatScore,
      speed: 12 + clampedTech * 1.6,
      x: playerPos.x + Math.cos(a) * dist,
      z: playerPos.z + Math.sin(a) * dist,
      angle: a,
      orbitDir: i % 2 === 0 ? 1 : -1,
    };
  });
}

export function estimateEncounterWinChance(
  ship: OwnedShip,
  bonuses: CrewBonuses,
  enemies: ActiveEnemy[]
): { winChancePct: number; tacticalRating: string } {
  const stats = computeShipDerivedStats(ship, bonuses);
  const currentRatio = Math.max(0.2, ship.currentHull / Math.max(1, stats.maxHull));
  const primaryType = enemies[0]?.damageType ?? 'laser';
  const specificMit = stats.mitigation[primaryType];

  const playerEffective =
    (ship.currentHull + ship.currentShield + stats.armor * 2.5) *
      (1 / Math.max(0.22, 1 - specificMit * 0.72)) *
      0.65 +
    stats.dps * 2.2 +
    stats.attackLevel * 28;

  const enemyTotalScore = enemies.reduce((s, e) => s + e.combatScore, 0);
  const ratio = (playerEffective * currentRatio + 10) / Math.max(15, enemyTotalScore);
  const pct = Math.round(Math.max(4, Math.min(99, 50 + (ratio - 1) * 42)));

  let tacticalRating = 'Combate Equilibrado';
  if (pct >= 85) tacticalRating = 'Superioridade Esmagadora';
  else if (pct >= 68) tacticalRating = 'Vantagem Tática';
  else if (pct >= 45) tacticalRating = 'Combate Equilibrado';
  else if (pct >= 25) tacticalRating = 'Desvantagem Severa';
  else tacticalRating = 'Risco Crítico';

  return { winChancePct: pct, tacticalRating };
}

export function computeFleeSuccessChance(
  ship: OwnedShip,
  bonuses: CrewBonuses,
  enemies: ActiveEnemy[]
): {
  chancePct: number;
  speedFactor: number;
  cloakFactor: number;
  racePilotBonus: number;
  threatPenalty: number;
} {
  const stats = computeShipDerivedStats(ship, bonuses);
  const speedFactor = Math.round(stats.speed * 1.9);
  const cloakFactor = Math.round(stats.cloakReduction * 32);
  const racePilotBonus = bonuses.fleeBonusPct ?? 0;
  const maxEnemySpeed = enemies.reduce((m, e) => Math.max(m, e.speed ?? 11 + e.techLevel * 1.5), 12);
  const threatPenalty = Math.max(0, Math.round((maxEnemySpeed - stats.speed) * 1.6 + enemies.length * 4));
  const raw = 24 + speedFactor + cloakFactor + racePilotBonus - threatPenalty;
  const chancePct = Math.round(Math.max(18, Math.min(95, raw)));
  return {
    chancePct,
    speedFactor,
    cloakFactor,
    racePilotBonus,
    threatPenalty,
  };
}

export function getMaxShipExtractors(hull: { rarity?: string; extractionSlots?: number }): number {
  const r = hull?.rarity ?? 'comum';
  if (r === 'comum') return 1;
  if (r === 'incomum') return 2;
  return Math.max(6, hull?.extractionSlots ?? 6);
}

