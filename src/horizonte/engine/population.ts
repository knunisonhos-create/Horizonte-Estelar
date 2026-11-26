import { FACTIONS_BY_ID, SPECIES } from '../data/lifeforms';
import { PLANET_TYPES_BY_CODE } from '../data/planets';
import type {
  LifeFormId,
  PlanetData,
  PlanetPopulationShare,
  PlayerCampaignState,
  StarSystemFull,
} from '../types/game';

function roundWeightsTo100(
  weights: Map<string, number>,
  priorityOrder: Map<string, number>
): PlanetPopulationShare[] {
  const entries = Array.from(weights.entries()).filter(([, w]) => w > 0);
  if (entries.length === 0) return [];
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  if (total <= 0) return [];

  const scaled = entries.map(([speciesId, w], idx) => {
    const exact = (w / total) * 100;
    const base = Math.floor(exact);
    return {
      speciesId,
      base,
      rem: exact - base,
      prio: priorityOrder.get(speciesId) ?? 100 + idx,
    };
  });

  let remaining = 100 - scaled.reduce((sum, item) => sum + item.base, 0);
  const byRem = [...scaled].sort((a, b) => {
    if (Math.abs(b.rem - a.rem) > 1e-9) return b.rem - a.rem;
    return a.prio - b.prio;
  });

  let cursor = 0;
  while (remaining > 0 && byRem.length > 0) {
    byRem[cursor % byRem.length].base += 1;
    remaining--;
    cursor++;
  }

  return scaled
    .filter((item) => item.base > 0)
    .map((item) => ({ speciesId: item.speciesId, pct: item.base }))
    .sort((a, b) => {
      if (b.pct !== a.pct) return b.pct - a.pct;
      return (priorityOrder.get(a.speciesId) ?? 999) - (priorityOrder.get(b.speciesId) ?? 999);
    });
}

function addWeight(map: Map<string, number>, speciesId: string, amount: number): void {
  map.set(speciesId, (map.get(speciesId) ?? 0) + amount);
}

/**
 * Calcula a distribuição populacional de um planeta:
 * - Com facção dominante:
 *   - 40% da raça da facção dominante
 *   - 20% (10% cada) das outras duas raças da mesma forma de vida da facção
 *   - 40% das raças nativas compatíveis com a biologia do planeta local
 * - Em espaço selvagem (sem facção dominante):
 *   - 100% determinado pela biologia do planeta local
 */
export function computePlanetPopulation(params: {
  level: number;
  typeCode: string;
  controllingFactionId: string | null;
  lifeFormId?: LifeFormId | null;
  speciesId?: string | null;
  hasExtractorColony?: boolean;
}): PlanetPopulationShare[] {
  const { level, typeCode, controllingFactionId, lifeFormId, speciesId, hasExtractorColony } = params;

  if (level === -1 || level === 0 || (level === 1 && !hasExtractorColony)) {
    return [];
  }

  const pt = PLANET_TYPES_BY_CODE[typeCode];
  const bioLifeForms: LifeFormId[] =
    pt && pt.allowedLifeForms.length > 0
      ? pt.allowedLifeForms
      : lifeFormId
      ? [lifeFormId]
      : [];
  const bioSpecies = SPECIES.filter((s) => bioLifeForms.includes(s.lifeFormId));

  const weights = new Map<string, number>();
  const priority = new Map<string, number>();

  const owner = controllingFactionId ? FACTIONS_BY_ID[controllingFactionId] : null;
  if (owner) {
    // 40% da raça da facção dominante
    addWeight(weights, owner.speciesId, 40);
    priority.set(owner.speciesId, 0);

    // 20% das outras duas raças da mesma forma de vida da facção
    const siblings = SPECIES.filter(
      (s) => s.lifeFormId === owner.lifeFormId && s.id !== owner.speciesId
    );
    if (siblings.length > 0) {
      const eachSibling = 20 / siblings.length;
      siblings.forEach((sib, idx) => {
        addWeight(weights, sib.id, eachSibling);
        if (!priority.has(sib.id)) priority.set(sib.id, 1 + idx);
      });
    } else {
      addWeight(weights, owner.speciesId, 20);
    }

    // 40% de acordo com a biologia do planeta local
    const localPool =
      bioSpecies.length > 0
        ? bioSpecies
        : SPECIES.filter((s) => s.lifeFormId === owner.lifeFormId);
    if (localPool.length > 0) {
      const eachLocal = 40 / localPool.length;
      localPool.forEach((sp, idx) => {
        addWeight(weights, sp.id, eachLocal);
        if (!priority.has(sp.id)) priority.set(sp.id, 10 + idx);
      });
    }
  } else {
    // Sem facção dominante: população 100% determinada pela biologia local do planeta
    const localPool =
      bioSpecies.length > 0
        ? bioSpecies
        : speciesId
        ? SPECIES.filter((s) => s.id === speciesId)
        : [];
    if (localPool.length === 0) return [];

    if (speciesId && localPool.some((s) => s.id === speciesId) && localPool.length > 1) {
      addWeight(weights, speciesId, 50);
      priority.set(speciesId, 0);
      const others = localPool.filter((s) => s.id !== speciesId);
      const eachOther = 50 / others.length;
      others.forEach((sp, idx) => {
        addWeight(weights, sp.id, eachOther);
        if (!priority.has(sp.id)) priority.set(sp.id, 1 + idx);
      });
    } else {
      const eachLocal = 100 / localPool.length;
      localPool.forEach((sp, idx) => {
        addWeight(weights, sp.id, eachLocal);
        priority.set(sp.id, idx);
      });
    }
  }

  return roundWeightsTo100(weights, priority);
}

/**
 * Calcula a composição populacional agregada de todo o sistema solar,
 * ponderando os mundos habitados pela sua escala de civilização (ou biologia local dos planetas do sistema).
 */
export function computeSystemPopulation(
  system: StarSystemFull,
  campaign?: Pick<PlayerCampaignState, 'planetOverrides' | 'systemOwnerOverrides'> | null
): PlanetPopulationShare[] {
  if (system.isBlackHole || system.planets.length === 0) return [];

  const systemOwnerId = campaign
    ? campaign.systemOwnerOverrides[system.id] === '__wild__'
      ? null
      : campaign.systemOwnerOverrides[system.id] ?? system.controllingFactionId
    : system.controllingFactionId;

  const totalWeights = new Map<string, number>();
  const priority = new Map<string, number>();
  const owner = systemOwnerId ? FACTIONS_BY_ID[systemOwnerId] : null;
  if (owner) {
    priority.set(owner.speciesId, 0);
    SPECIES.filter((s) => s.lifeFormId === owner.lifeFormId && s.id !== owner.speciesId).forEach(
      (sib, idx) => priority.set(sib.id, 1 + idx)
    );
  }

  let hasAnyPopulatedPlanet = false;

  const resolveLevel = (pl: PlanetData): number =>
    campaign ? campaign.planetOverrides[pl.id]?.level ?? pl.level : pl.level;

  const resolveTypeCode = (pl: PlanetData, lv: number): string => {
    if (lv === -1) return 'TX31';
    return (campaign ? campaign.planetOverrides[pl.id]?.typeCodeOverride : undefined) ?? pl.typeCode;
  };

  const resolveFaction = (pl: PlanetData, lv: number): string | null => {
    if (lv === -1) return null;
    if (campaign) {
      if (campaign.systemOwnerOverrides[pl.systemId] === '__wild__') return null;
      const ov = campaign.planetOverrides[pl.id]?.factionId;
      if (ov === '__wild__') return null;
      return ov ?? campaign.systemOwnerOverrides[pl.systemId] ?? pl.factionId ?? systemOwnerId;
    }
    return pl.factionId ?? systemOwnerId;
  };

  for (const planet of system.planets) {
    const lv = resolveLevel(planet);
    if (lv === -1 || lv === 0 || (lv === 1 && !planet.hasExtractorColony)) continue;
    hasAnyPopulatedPlanet = true;
    const typeCode = resolveTypeCode(planet, lv);
    const facId = resolveFaction(planet, lv);
    const pop = computePlanetPopulation({
      level: lv,
      typeCode,
      controllingFactionId: facId,
      lifeFormId: planet.lifeFormId,
      speciesId: planet.speciesId,
      hasExtractorColony: planet.hasExtractorColony,
    });
    const civWeight = lv === 5 ? 5 : lv === 4 ? 3 : lv === 3 ? 2 : 1;
    pop.forEach((entry, idx) => {
      addWeight(totalWeights, entry.speciesId, (entry.pct / 100) * civWeight);
      if (!priority.has(entry.speciesId)) priority.set(entry.speciesId, 10 + idx);
    });
  }

  if (!hasAnyPopulatedPlanet && owner) {
    // Fallback para sistemas recém-reivindicados sem colônias povoadas:
    // usa 40% facção + 20% mesma forma de vida + 40% biologias compatíveis dos planetas do sistema
    addWeight(totalWeights, owner.speciesId, 40);
    const siblings = SPECIES.filter(
      (s) => s.lifeFormId === owner.lifeFormId && s.id !== owner.speciesId
    );
    siblings.forEach((sib) => addWeight(totalWeights, sib.id, 20 / Math.max(1, siblings.length)));

    const sysBioLifeForms = new Set<LifeFormId>();
    for (const planet of system.planets) {
      const lv = resolveLevel(planet);
      if (lv === -1) continue;
      const pt = PLANET_TYPES_BY_CODE[resolveTypeCode(planet, lv)];
      pt?.allowedLifeForms.forEach((lf) => sysBioLifeForms.add(lf));
    }
    const localPool =
      sysBioLifeForms.size > 0
        ? SPECIES.filter((s) => sysBioLifeForms.has(s.lifeFormId))
        : SPECIES.filter((s) => s.lifeFormId === owner.lifeFormId);
    localPool.forEach((sp, idx) => {
      addWeight(totalWeights, sp.id, 40 / Math.max(1, localPool.length));
      if (!priority.has(sp.id)) priority.set(sp.id, 10 + idx);
    });
  }

  return roundWeightsTo100(totalWeights, priority);
}

/** Seleciona uma espécie respeitando exatamente as porcentagens populacionais. */
export function pickSpeciesFromPopulation(
  population: PlanetPopulationShare[],
  rng: { next(): number },
  fallbackSpeciesId: string
): string {
  if (population.length === 0) return fallbackSpeciesId;
  const total = population.reduce((sum, entry) => sum + entry.pct, 0);
  if (total <= 0) return fallbackSpeciesId;
  let roll = rng.next() * total;
  for (const entry of population) {
    roll -= entry.pct;
    if (roll <= 0) return entry.speciesId;
  }
  return population[0]?.speciesId ?? fallbackSpeciesId;
}
