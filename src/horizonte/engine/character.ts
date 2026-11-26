import type { CharacterAttributeId, CharacterProgressState } from '../types/game';

export const CHARACTER_ATTRIBUTE_MAX = 20;
export const CHARACTER_POINTS_PER_LEVEL = 2;

export interface CharacterAttributeMeta {
  id: CharacterAttributeId;
  name: string;
  shortBonus: string;
  description: string;
  formatActiveBonus: (points: number) => string;
}

const fmtPct = (v: number) => `${Number(v.toFixed(1))}%`;

export const CHARACTER_ATTRIBUTE_LIST: CharacterAttributeMeta[] = [
  {
    id: 'artilharia',
    name: 'Artilharia & Tática',
    shortBonus: '+1.5% Dano · +0.5% Fuga / pt',
    description:
      'Ajuste tático moderado para armamentos e manobras evasivas. Oferece ganhos contidos em relação às especializações estruturais, comerciais e de exploração.',
    formatActiveBonus: (pts) => `+${fmtPct(pts * 1.5)} Dano das Armas · +${fmtPct(pts * 0.5)} Chance de Fuga`,
  },
  {
    id: 'engenharia',
    name: 'Engenharia & Escudos',
    shortBonus: '+6% Casco · +6% Escudos · +0.25/s Regen. / pt',
    description:
      'Reforça profundamente o casco, amplia capacidade e recarga dos escudos e ativa autorreparo contínuo em qualquer nave.',
    formatActiveBonus: (pts) =>
      `+${pts * 6}% Casco · +${pts * 6}% Escudos e Recarga · +${(pts * 0.25).toFixed(2)}/s Regen.`,
  },
  {
    id: 'navegacao',
    name: 'Navegação & Propulsão',
    shortBonus: '-3.5% Combustível · +5% Vel. · +1.5% Fuga / pt',
    description:
      'Otimiza saltos interestelares, aumenta drasticamente o empuxo dos propulsores e garante superioridade em manobras de fuga.',
    formatActiveBonus: (pts) =>
      `-${fmtPct(Math.min(70, pts * 3.5))} Salto · +${pts * 5}% Velocidade · +${fmtPct(pts * 1.5)} Fuga`,
  },
  {
    id: 'comercio',
    name: 'Comércio & Diplomacia',
    shortBonus: '+3.5% Comércio · +6% Rep. · +5 Carga / pt',
    description:
      'Expande margens de compra e venda, multiplica a reputação ganha com facções e amplia o compartimento de carga.',
    formatActiveBonus: (pts) =>
      `+${fmtPct(pts * 3.5)} Comércio · +${pts * 6}% Reputação · +${pts * 5} Carga`,
  },
  {
    id: 'mineracao',
    name: 'Mineração & Extração',
    shortBonus: '+8% Extração · +4 Carga · -1.5% Mant. / pt',
    description:
      'Acelera coletores atmosféricos e brocas em solo, amplia o compartimento industrial e reduz o consumo de mantimentos.',
    formatActiveBonus: (pts) =>
      `+${pts * 8}% Extração · +${pts * 4} Carga · -${fmtPct(Math.min(30, pts * 1.5))} Mantimentos`,
  },
  {
    id: 'exploracao',
    name: 'Exploração & Sobrevivência',
    shortBonus: '+8% Exploração · -3.5% Dano Solo · +6% Cons. / pt',
    description:
      'Eleva muito o sucesso em expedições, reduz dano ambiental e potencializa todos os kits de reparo e células de escudo.',
    formatActiveBonus: (pts) =>
      `+${pts * 8}% Exploração · -${fmtPct(Math.min(70, pts * 3.5))} Dano em Solo · +${pts * 6}% Consumíveis`,
  },
];

export const CHARACTER_ATTRIBUTES_BY_ID: Record<CharacterAttributeId, CharacterAttributeMeta> = Object.fromEntries(
  CHARACTER_ATTRIBUTE_LIST.map((attr) => [attr.id, attr])
) as Record<CharacterAttributeId, CharacterAttributeMeta>;

export function createDefaultCharacterProgress(): CharacterProgressState {
  return {
    level: 1,
    xp: 0,
    attributePoints: 0,
    attributes: {
      artilharia: 0,
      engenharia: 0,
      navegacao: 0,
      comercio: 0,
      mineracao: 0,
      exploracao: 0,
    },
  };
}

export function normalizeCharacterProgress(raw: unknown): CharacterProgressState {
  const base = createDefaultCharacterProgress();
  if (!raw || typeof raw !== 'object') return base;
  const obj = raw as Partial<CharacterProgressState>;
  const rawAttrs = (obj.attributes && typeof obj.attributes === 'object' ? obj.attributes : {}) as Record<
    string,
    unknown
  >;

  const clampAttr = (val: unknown) => {
    const n = Number(val);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return Math.min(CHARACTER_ATTRIBUTE_MAX, Math.floor(n));
  };

  return {
    level: Number.isFinite(obj.level) && Number(obj.level) >= 1 ? Math.floor(Number(obj.level)) : 1,
    xp: Number.isFinite(obj.xp) && Number(obj.xp) >= 0 ? Math.floor(Number(obj.xp)) : 0,
    attributePoints:
      Number.isFinite(obj.attributePoints) && Number(obj.attributePoints) >= 0
        ? Math.floor(Number(obj.attributePoints))
        : 0,
    attributes: {
      artilharia: clampAttr(rawAttrs.artilharia),
      engenharia: clampAttr(rawAttrs.engenharia),
      navegacao: clampAttr(rawAttrs.navegacao),
      comercio: clampAttr(rawAttrs.comercio),
      mineracao: clampAttr(rawAttrs.mineracao),
      exploracao: clampAttr(rawAttrs.exploracao),
    },
  };
}

export function xpRequiredForLevel(level: number): number {
  const lv = Math.max(1, Math.floor(level));
  return Math.round((100 * Math.pow(1.25, lv - 1)) / 10) * 10;
}

export function grantCharacterXp(
  current: CharacterProgressState | undefined,
  rawGain: number
): {
  nextCharacter: CharacterProgressState;
  xpAdded: number;
  levelsGained: number;
  pointsGained: number;
} {
  const base = normalizeCharacterProgress(current);
  const xpAdded = Math.max(0, Math.round(rawGain));
  if (xpAdded <= 0) {
    return { nextCharacter: base, xpAdded: 0, levelsGained: 0, pointsGained: 0 };
  }

  let level = base.level;
  let xp = base.xp + xpAdded;
  let levelsGained = 0;

  while (xp >= xpRequiredForLevel(level)) {
    xp -= xpRequiredForLevel(level);
    level += 1;
    levelsGained += 1;
  }

  const pointsGained = levelsGained * CHARACTER_POINTS_PER_LEVEL;

  return {
    nextCharacter: {
      level,
      xp,
      attributePoints: base.attributePoints + pointsGained,
      attributes: { ...base.attributes },
    },
    xpAdded,
    levelsGained,
    pointsGained,
  };
}

export function computeCharacterModifiers(character: CharacterProgressState | undefined) {
  const norm = normalizeCharacterProgress(character);
  const a = norm.attributes;
  return {
    dpsMult: 1 + a.artilharia * 0.015,
    fleeBonusPct: a.artilharia * 0.5 + a.navegacao * 1.5,
    hullMult: 1 + a.engenharia * 0.06,
    shieldMult: 1 + a.engenharia * 0.06,
    hullRegenBonus: a.engenharia * 0.25,
    fuelMult: Math.max(0.3, 1 - a.navegacao * 0.035),
    speedMult: 1 + a.navegacao * 0.05,
    tradeBonusPct: a.comercio * 0.035,
    renownMult: 1 + a.comercio * 0.06,
    cargoFlatBonus: a.comercio * 5 + a.mineracao * 4,
    supplyCostMult: Math.max(0.5, 1 - a.mineracao * 0.015),
    minerRateMult: 1 + a.mineracao * 0.08,
    explorerPowerMult: 1 + a.exploracao * 0.08,
    hazardDamageMult: Math.max(0.3, 1 - a.exploracao * 0.035),
    consumableMult: 1 + a.exploracao * 0.06,
  };
}
