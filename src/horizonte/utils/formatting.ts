import type { ExtractionClass, FactionTechStyle, PlayerCampaignState, Rarity, WeaponDamageType } from '../types/game';
import {
  BLUEPRINTS_BY_ID,
  EXTRACTORS_BY_ID,
  HULLS_BY_ID,
  JUMP_DRIVES_BY_ID,
  SHIELDS_BY_ID,
  SUIT_GEAR_BY_ID,
  UTILITY_BY_ID,
  WEAPONS_BY_ID,
} from '../data/items';
import { SPECIES_BY_ID } from '../data/lifeforms';

export const TECH_CATEGORY_META: Record<
  FactionTechStyle,
  { label: string; shortLabel: string; badge: string; text: string; synergyHint: string }
> = {
  silicoide: {
    label: 'Categoria Silicoide',
    shortLabel: 'Silicoide',
    badge: 'bg-amber-500/15 border-amber-400/50 text-amber-300',
    text: 'text-amber-300',
    synergyHint: 'Engenharia mineral, blindagem pesada e perfuração',
  },
  criogenica: {
    label: 'Categoria Criogênica',
    shortLabel: 'Criogênica',
    badge: 'bg-cyan-500/15 border-cyan-400/50 text-cyan-300',
    text: 'text-cyan-300',
    synergyHint: 'Sistemas térmicos, fluidos e suporte vital',
  },
  gasosa: {
    label: 'Categoria Gasosa',
    shortLabel: 'Gasosa',
    badge: 'bg-teal-500/15 border-teal-400/50 text-teal-300',
    text: 'text-teal-300',
    synergyHint: 'Propulsão nebular, coletores e dobra econômica',
  },
  radioativa: {
    label: 'Categoria Radioativa',
    shortLabel: 'Radioativa',
    badge: 'bg-lime-500/15 border-lime-400/50 text-lime-300',
    text: 'text-lime-300',
    synergyHint: 'Núcleos de alta energia, plasma e radiação',
  },
  militar: {
    label: 'Categoria Militar',
    shortLabel: 'Militar',
    badge: 'bg-rose-500/15 border-rose-400/50 text-rose-300',
    text: 'text-rose-300',
    synergyHint: 'Poder de fogo tático, escudos e blindagem de combate',
  },
  mercantil: {
    label: 'Categoria Mercantil',
    shortLabel: 'Mercantil',
    badge: 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300',
    text: 'text-emerald-300',
    synergyHint: 'Logística de carga, rotas e suprimentos',
  },
  pesquisadores: {
    label: 'Categoria Pesquisadores',
    shortLabel: 'Pesquisadores',
    badge: 'bg-violet-500/15 border-violet-400/50 text-violet-300',
    text: 'text-violet-300',
    synergyHint: 'Escâneres, ciência avançada e precisão orbital',
  },
};

export function getActiveTechCategory(campaign: PlayerCampaignState): FactionTechStyle {
  return SPECIES_BY_ID[campaign.chosenSpeciesId]?.techCategory ?? 'mercantil';
}

export const RARITY_STYLES: Record<
  Rarity,
  { label: string; text: string; badge: string; border: string; dot: string }
> = {
  comum: {
    label: 'Comum',
    text: 'text-slate-300',
    badge: 'bg-slate-800/90 border-slate-600/70 text-slate-200',
    border: 'border-slate-700/80',
    dot: '#94a3b8',
  },
  incomum: {
    label: 'Incomum',
    text: 'text-emerald-300',
    badge: 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300',
    border: 'border-emerald-500/40',
    dot: '#34d399',
  },
  raro: {
    label: 'Raro',
    text: 'text-sky-300',
    badge: 'bg-sky-500/15 border-sky-400/50 text-sky-300',
    border: 'border-sky-500/40',
    dot: '#38bdf8',
  },
  épico: {
    label: 'Épico',
    text: 'text-purple-300',
    badge: 'bg-purple-500/15 border-purple-400/50 text-purple-300',
    border: 'border-purple-500/40',
    dot: '#c084fc',
  },
  lendário: {
    label: 'Lendário',
    text: 'text-amber-300',
    badge: 'bg-amber-500/15 border-amber-400/60 text-amber-300',
    border: 'border-amber-400/50',
    dot: '#fbbf24',
  },
  único: {
    label: 'Único',
    text: 'text-rose-300',
    badge: 'bg-rose-500/15 border-rose-400/60 text-rose-300',
    border: 'border-rose-400/50',
    dot: '#fb7185',
  },
};

export function getLevelStyle(
  level: number,
  kind: 'planet' | 'tech' | 'attack' | 'conflict' = 'planet'
): { badge: string; text: string } {
  if (kind === 'conflict') {
    if (level <= 1) return { badge: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300', text: 'text-emerald-300' };
    if (level === 2) return { badge: 'bg-lime-500/15 border-lime-500/40 text-lime-300', text: 'text-lime-300' };
    if (level === 3) return { badge: 'bg-amber-500/15 border-amber-500/40 text-amber-300', text: 'text-amber-300' };
    if (level === 4) return { badge: 'bg-orange-500/15 border-orange-500/40 text-orange-300', text: 'text-orange-300' };
    return { badge: 'bg-rose-500/20 border-rose-500/60 text-rose-300', text: 'text-rose-300' };
  }

  if (level < 0) return { badge: 'bg-red-950/90 border-orange-500/75 text-orange-300', text: 'text-orange-300' };
  if (level === 0) return { badge: 'bg-slate-800/80 border-slate-700 text-slate-400', text: 'text-slate-400' };
  if (level === 1) return { badge: 'bg-teal-500/15 border-teal-500/40 text-teal-300', text: 'text-teal-300' };
  if (level === 2) return { badge: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300', text: 'text-emerald-300' };
  if (level === 3) return { badge: 'bg-sky-500/15 border-sky-500/40 text-sky-300', text: 'text-sky-300' };
  if (level === 4) return { badge: 'bg-purple-500/15 border-purple-500/40 text-purple-300', text: 'text-purple-300' };
  return { badge: 'bg-amber-500/20 border-amber-400/60 text-amber-300', text: 'text-amber-300' };
}

export const PLANET_LEVEL_LABELS: Record<number, string> = {
  [-1]: 'Planeta Destruído',
  0: 'Estéril',
  1: 'Vida Primitiva',
  2: 'Pré-Estelar',
  3: 'Regional',
  4: 'Avançado',
  5: 'Sede Imperial',
};

export const DAMAGE_TYPE_LABELS: Record<WeaponDamageType, string> = {
  laser: 'Laser',
  cinetica: 'Cinética',
  plasma: 'Plasma',
  missil: 'Míssil',
};

export const EXTRACTION_CLASS_LABELS: Record<ExtractionClass, string> = {
  broca_mineral: 'Broca Mineral',
  coletor_atmosferico: 'Coletor Atmosférico',
  bomba_liquida: 'Bomba Líquida',
  coletor_biologico: 'Coletor Biológico',
  extrator_energia: 'Extrator de Energia',
  escavador_arqueologico: 'Escavador Arqueológico',
};

export const SUIT_GEAR_CATEGORY_LABELS: Record<'protecao' | 'ferramenta' | 'drone' | 'veiculo' | 'tanque', string> = {
  protecao: 'Traje de Proteção',
  ferramenta: 'Ferramenta de Campo',
  drone: 'Drone de Reconhecimento',
  veiculo: 'Carro de Exploração',
  tanque: 'Tanque de Expedição',
};

export function getEquipmentMeta(
  category: 'weapon' | 'shield' | 'jumpDrive' | 'extractor' | 'utility' | 'suit' | 'hull' | 'blueprint',
  id: string
): { name: string; rarity: Rarity; factionStyle: FactionTechStyle; description: string; level?: number; statsLine: string } {
  if (category === 'weapon') {
    const w = WEAPONS_BY_ID[id];
    if (!w) return { name: id, rarity: 'comum', factionStyle: 'militar', description: '', statsLine: '' };
    return {
      name: w.name,
      rarity: w.rarity,
      factionStyle: w.factionStyle,
      level: w.attackLevel,
      description: w.description,
      statsLine: `${DAMAGE_TYPE_LABELS[w.damageType]} · ${w.dps} DPS · Alcance ${w.range} · ${w.fireRate}/s${w.canBombard ? ' · Bombardeio Orbital' : ''}`,
    };
  }
  if (category === 'shield') {
    const s = SHIELDS_BY_ID[id];
    if (!s) return { name: id, rarity: 'comum', factionStyle: 'militar', description: '', statsLine: '' };
    const refl = s.reflectDamageRatio ? ` · Reflete ${Math.round(s.reflectDamageRatio * 100)}%` : '';
    return {
      name: s.name,
      rarity: s.rarity,
      factionStyle: s.factionStyle,
      description: s.description,
      statsLine: `Escudo +${s.capacity} · Recarga ${s.rechargePerSec}/s · Mit. L ${Math.round(s.mitigation.laser * 100)}% / C ${Math.round(s.mitigation.cinetica * 100)}% / P ${Math.round(s.mitigation.plasma * 100)}% / M ${Math.round(s.mitigation.missil * 100)}%${refl}`,
    };
  }
  if (category === 'jumpDrive') {
    const j = JUMP_DRIVES_BY_ID[id];
    if (!j) return { name: id, rarity: 'comum', factionStyle: 'gasosa', description: '', statsLine: '' };
    return {
      name: j.name,
      rarity: j.rarity,
      factionStyle: j.factionStyle,
      description: j.description,
      statsLine: `Alcance ${j.jumpRangeLy} a.l. · Consumo ${Math.round(j.fuelEfficiency * 100)}%`,
    };
  }
  if (category === 'extractor') {
    const e = EXTRACTORS_BY_ID[id];
    if (!e) return { name: id, rarity: 'comum', factionStyle: 'silicoide', description: '', statsLine: '' };
    const scopeLabel = e.extractorScope === 'nave' ? 'Extração de Nave (máx. 2/nave)' : 'Extração Manual (Tripulação)';
    return {
      name: e.name,
      rarity: e.rarity,
      factionStyle: e.factionStyle,
      level: e.techTier,
      description: e.description,
      statsLine: `${scopeLabel} · ${EXTRACTION_CLASS_LABELS[e.extractionClass]} · ${e.ratePerSec.toFixed(1)} un./s`,
    };
  }
  if (category === 'utility') {
    const u = UTILITY_BY_ID[id];
    if (!u) return { name: id, rarity: 'comum', factionStyle: 'mercantil', description: '', statsLine: '' };
    return {
      name: u.name,
      rarity: u.rarity,
      factionStyle: u.factionStyle,
      description: u.description,
      statsLine: `Módulo de Utilidade`,
    };
  }
  if (category === 'suit') {
    const g = SUIT_GEAR_BY_ID[id];
    if (!g) return { name: id, rarity: 'comum', factionStyle: 'pesquisadores', description: '', statsLine: '' };
    const kindLabel = SUIT_GEAR_CATEGORY_LABELS[g.category] ?? 'Equipamento';
    return {
      name: g.name,
      rarity: g.rarity,
      factionStyle: g.factionStyle,
      description: g.description,
      statsLine: `${kindLabel} · Exploração +${g.explorationBonus} · Combate solo +${g.combatPower}`,
    };
  }
  if (category === 'hull') {
    const h = HULLS_BY_ID[id];
    if (!h) return { name: id, rarity: 'comum', factionStyle: 'mercantil', description: '', statsLine: '' };
    return {
      name: h.name,
      rarity: h.rarity,
      factionStyle: h.factionStyle,
      description: h.description,
      statsLine: `Casco ${h.maxHull} · Blindagem ${h.armor} · Carga ${h.cargoCapacity} · Comb. ${h.fuelCapacity} · Trip. ${h.activeCrewPosts}/${h.reserveQuarters}`,
    };
  }
  const bp = BLUEPRINTS_BY_ID[id];
  if (!bp) return { name: id, rarity: 'comum', factionStyle: 'pesquisadores', description: '', statsLine: '' };
  return {
    name: bp.name,
    rarity: bp.minPlanetLevel >= 4 ? 'lendário' : 'raro',
    factionStyle: bp.factionStyle,
    level: bp.minPlanetLevel,
    description: bp.description,
    statsLine: `Requer civilização ${bp.minPlanetLevel}+`,
  };
}
