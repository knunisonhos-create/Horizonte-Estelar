import React, { useEffect, useMemo, useState } from 'react';
import {
  Rocket,
  Shield,
  Users,
  X,
  ArrowUpDown,
  Trash2,
  Sparkles,
  Crosshair,
  Fuel,
  Gauge,
  HeartPulse,
  Compass,
  Cpu,
  Flag,
  Landmark,
  Package,
  User,
  Plus,
  Award,
} from 'lucide-react';
import type { CharacterAttributeId, CrewRole, InventoryItemRecord, OwnedShip, PlayerCampaignState, Rarity } from '../types/game';
import {
  CONSUMABLES_BY_ID,
  HULLS_BY_ID,
  JUMP_DRIVES_BY_ID,
  RESOURCES_BY_ID,
  SUIT_GEAR_BY_ID,
  UTILITY_BY_ID,
} from '../data/items';
import { FACTIONS_BY_ID, LIFE_FORMS_BY_ID, SPECIES_BY_ID } from '../data/lifeforms';
import { DEFAULT_ORIGIN_BONUSES, SPECIAL_ABILITIES_BY_ID } from '../data/originPerks';
import {
  compartmentUsed,
  computeCrewBonuses,
  computeCrewHarmony,
  computeShipDerivedStats,
  crewHealthRatio,
  getSuitGearEffectiveStats,
  TECH_SYNERGY_BONUS,
} from '../engine/combat';
import {
  CHARACTER_ATTRIBUTE_LIST,
  CHARACTER_ATTRIBUTE_MAX,
  computeCharacterModifiers,
  normalizeCharacterProgress,
  xpRequiredForLevel,
} from '../engine/character';
import { FACTION_VAULT_FEE_PER_ITEM, factionVaultFee, factionVaultItemCount, normalizeFactionVault } from '../engine/factionVault';
import { getEquipmentMeta, getLevelStyle, RARITY_STYLES, TECH_CATEGORY_META } from '../utils/formatting';
import { CreatureCard } from './CreatureCard';
import { CrewPortraitSprite, EquipmentSprite, HullSprite, ResourceSprite } from './SpriteArt';
import { TechCategoryBadge } from './TechCategoryBadge';

const ROLE_INFO: Record<CrewRole, { label: string; desc: string }> = {
  piloto_navegador: { label: 'Piloto Navegador', desc: 'Reduz consumo de combustível em saltos e voos' },
  piloto_combate: { label: 'Piloto de Combate', desc: 'Aumenta capacidade máxima e recarga dos escudos' },
  engenheiro: { label: 'Engenheiro', desc: 'Restauração gradual do casco e bônus em kits de reparo' },
  negociador: { label: 'Negociador', desc: 'Melhora preços de compra e venda nos mercados' },
  explorador: { label: 'Explorador', desc: 'Melhora expedições em solo e reduz dano ambiental' },
  minerador: { label: 'Minerador', desc: 'Aumenta velocidade e rendimento de extração contínua' },
  diplomata: { label: 'Diplomata', desc: 'Aumenta reputação ganho, agiliza contato e facilita aliança' },
  mestre_tripulacao: { label: 'Mestre de Tripulação', desc: 'Reduz gasto de mantimentos e custo de contratação' },
};

const CATEGORY_LABELS: Record<string, string> = {
  weapon: 'Arma',
  shield: 'Escudo',
  jumpDrive: 'Motor de Salto',
  extractor: 'Extrator',
  utility: 'Utilidade',
  suit: 'Traje & Solo',
};

const RarityBadge: React.FC<{ rarity: Rarity }> = ({ rarity }) => {
  const st = RARITY_STYLES[rarity] ?? RARITY_STYLES.comum;
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-semibold capitalize ${st.badge}`}>
      {st.label}
    </span>
  );
};

const vaultButtonClass =
  'px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold shrink-0 cursor-pointer';

function SendToVaultButtons({ qty, onSend }: { qty: number; onSend: (amount: number) => void }) {
  return (
    <>
      <button type="button" onClick={() => onSend(1)} className={vaultButtonClass}>
        Enviar para o Cofre
      </button>
      {qty > 1 && (
        <button type="button" onClick={() => onSend(qty)} className={vaultButtonClass}>
          Enviar Tudo
        </button>
      )}
    </>
  );
}

function getSkillBadge(skill: number): { label: string; badge: string } {
  if (skill >= 88) return { label: `Elite · ${skill}`, badge: 'bg-amber-500/15 border-amber-400/60 text-amber-300' };
  if (skill >= 72) return { label: `Veterano · ${skill}`, badge: 'bg-purple-500/15 border-purple-400/50 text-purple-300' };
  if (skill >= 55) return { label: `Perito · ${skill}`, badge: 'bg-sky-500/15 border-sky-400/50 text-sky-300' };
  if (skill >= 35) return { label: `Experiente · ${skill}`, badge: 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300' };
  return { label: `Aprendiz · ${skill}`, badge: 'bg-slate-800 border-slate-600 text-slate-300' };
}

interface ShipAndCrewPanelProps {
  campaign: PlayerCampaignState;
  inOrbit: boolean;
  onClose: () => void;
  onUseConsumable: (consumableId: string) => void;
  onEquipFromDepot: (depotUid: string) => void;
  onUnequip: (
    category: 'weapon' | 'shield' | 'jumpDrive' | 'extractor' | 'utility' | 'suit',
    itemId: string,
    slotIndex: number
  ) => void;
  onSwitchShip: (shipUid: string) => void;
  onToggleCrewStatus: (crewId: string) => void;
  onDismissCrew: (crewId: string) => void;
  onSendResourceToVault: (resourceId: string, qty: number) => void;
  onSendConsumableToVault: (consumableId: string, qty: number) => void;
  onSendDepotToVault: (depotUid: string) => void;
  onSendInstalledToVault: (
    category: InventoryItemRecord['category'],
    itemId: string,
    slotIndex: number
  ) => void;
  onEquipFromVault: (gearUid: string, shipUid: string) => void;
  onWithdrawResource: (resourceId: string, qty: number) => void;
  onWithdrawConsumable: (consumableId: string, qty: number) => void;
  onWithdrawGear: (gearUid: string) => void;
  onUseVaultConsumable: (consumableId: string) => void;
  onSpendAttributePoint: (attrId: CharacterAttributeId) => void;
  tutorialSync?: {
    seq: number;
    tab?: 'nave' | 'personagem' | 'tripulacao' | 'compartimento' | 'frota' | 'cofre';
  };
}

export const ShipAndCrewPanel: React.FC<ShipAndCrewPanelProps> = ({
  campaign,
  inOrbit: _inOrbit,
  onClose,
  onUseConsumable,
  onEquipFromDepot,
  onUnequip,
  onSwitchShip,
  onToggleCrewStatus,
  onDismissCrew,
  onSendResourceToVault,
  onSendConsumableToVault,
  onSendDepotToVault,
  onSendInstalledToVault,
  onEquipFromVault,
  onWithdrawResource,
  onWithdrawConsumable,
  onWithdrawGear,
  onUseVaultConsumable,
  onSpendAttributePoint,
  tutorialSync,
}) => {
  const [tab, setTab] = useState<'nave' | 'personagem' | 'tripulacao' | 'compartimento' | 'frota' | 'cofre'>('nave');
  const [equipShipUid, setEquipShipUid] = useState(campaign.activeShipUid);

  useEffect(() => {
    if (tutorialSync?.tab) {
      setTab(tutorialSync.tab);
    }
  }, [tutorialSync]);

  const bonuses = useMemo(() => computeCrewBonuses(campaign), [campaign]);
  const character = useMemo(() => normalizeCharacterProgress(campaign.character), [campaign.character]);
  const charMods = useMemo(() => computeCharacterModifiers(character), [character]);
  const playerSpecies = SPECIES_BY_ID[campaign.chosenSpeciesId];
  const playerLifeForm = playerSpecies ? LIFE_FORMS_BY_ID[playerSpecies.lifeFormId] : undefined;
  const originFaction = FACTIONS_BY_ID[campaign.chosenFactionId];
  const xpForNext = xpRequiredForLevel(character.level);
  const xpPct = Math.min(100, Math.round((character.xp / Math.max(1, xpForNext)) * 100));
  const ship = campaign.ships.find((s) => s.uid === campaign.activeShipUid) ?? campaign.ships[0];
  const stats = useMemo(() => computeShipDerivedStats(ship, bonuses), [ship, bonuses]);
  const hull = HULLS_BY_ID[ship.hullId];
  const jumpDrive = ship.jumpDriveId ? JUMP_DRIVES_BY_ID[ship.jumpDriveId] : undefined;
  const hullStyle = RARITY_STYLES[hull.rarity] ?? RARITY_STYLES.comum;
  const atkStyle = getLevelStyle(stats.attackLevel, 'attack');
  const shipFac = FACTIONS_BY_ID[ship.factionId ?? campaign.chosenFactionId];
  const shipColor = ship.color ?? shipFac?.color ?? hull.color ?? '#38bdf8';

  const activeCrew = campaign.crew.filter((c) => c.status === 'ativo');
  const reserveCrew = campaign.crew.filter((c) => c.status === 'reserva');
  const totalCrewSkill = campaign.crew.reduce((s, c) => s + c.skill, 0);
  const supplyDrainPerSec = ((totalCrewSkill * bonuses.supplyCostMult) / 60) * (1.5 / 2.5) * 0.65;
  const cargoTotal = compartmentUsed(campaign, ship);

  const suitGearEquipped = ship.suitGearIds.map((id) => SUIT_GEAR_BY_ID[id]).filter(Boolean);
  const suitEffectiveStats = getSuitGearEffectiveStats(ship.suitGearIds, bonuses.activeTechCategory);
  const suitExplorationBonus = suitEffectiveStats.explorationBonus;
  const suitCombatPower = suitEffectiveStats.combatPower;
  const suitHazardProtections = new Set(suitGearEquipped.map((g) => g.hazardType).filter(Boolean)).size;

  const utilitiesEquipped = ship.utilityIds.map((id) => UTILITY_BY_ID[id]).filter(Boolean);
  const utilityCargoBonus = utilitiesEquipped
    .filter((u) => u.kind === 'carga')
    .reduce(
      (s, u) =>
        s + Math.round(u.bonusValue * (u.factionStyle === bonuses.activeTechCategory ? 1 + TECH_SYNERGY_BONUS.utilityPct : 1)),
      0
    );
  const utilityFuelBonus = utilitiesEquipped
    .filter((u) => u.kind === 'tanque')
    .reduce(
      (s, u) =>
        s + Math.round(u.bonusValue * (u.factionStyle === bonuses.activeTechCategory ? 1 + TECH_SYNERGY_BONUS.utilityPct : 1)),
      0
    );

  const harmony = useMemo(() => computeCrewHarmony(campaign), [campaign]);
  const maxCrewHealth = 100 + Math.max(0, campaign.healthPotency ?? 0);
  const currentCrewHealth = Math.round(campaign.crewHealth ?? 100);
  const healthRatio = crewHealthRatio(campaign);
  const crewEfficiencyPct = Math.round(
    (campaign.supplies > 0 ? 1 : 0.5) * healthRatio * harmony.efficiencyMult * 100
  );
  const activeMaster = activeCrew.find((m) => m.role === 'mestre_tripulacao');
  const masterRawSkill = activeMaster
    ? activeMaster.skill * (campaign.supplies > 0 ? 1 : 0.5) * harmony.efficiencyMult
    : 0;
  const abilityHealthRegen = (campaign.specialAbilityIds ?? []).reduce(
    (sum, id) => sum + (SPECIAL_ABILITIES_BY_ID[id]?.healthRegenPerSec ?? 0),
    0
  );
  const buffCrewHealthRate = campaign.eventCrewBuffLabel
    ? /Fadiga/i.test(campaign.eventCrewBuffLabel)
      ? -0.1
      : 0.25
    : 0;
  const crewHealthRegenPerSec = masterRawSkill * 0.004 + abilityHealthRegen + buffCrewHealthRate;
  const fuelEconomyPct = Math.round((1 - stats.fuelEfficiency) * 100);

  const fuelPerLy = (2.1 * stats.fuelEfficiency).toFixed(2);
  const maxReachableLy = Math.floor(campaign.fuel / Math.max(0.2, 2.1 * stats.fuelEfficiency));

  const equipmentSlots = useMemo(() => {
    type EquipCategory = 'weapon' | 'shield' | 'jumpDrive' | 'extractor' | 'utility' | 'suit';
    const slots: Array<{
      key: string;
      slotLabel: string;
      category: EquipCategory;
      itemId: string | null;
      slotIndex: number;
      emptyHint: string;
    }> = [];

    slots.push({
      key: 'jd_0',
      slotLabel: 'Motor de Salto',
      category: 'jumpDrive',
      itemId: ship.jumpDriveId || null,
      slotIndex: 0,
      emptyHint: 'Sem motor de salto. A nave não deixa o sistema até equipar um.',
    });

    const wSlots = Math.max(1, hull.weaponSlots);
    for (let i = 0; i < wSlots; i++) {
      slots.push({
        key: `wpn_${i}`,
        slotLabel: wSlots > 1 ? `Armamento ${i + 1}/${wSlots}` : 'Armamento',
        category: 'weapon',
        itemId: i === 0 ? ship.weaponId || null : null,
        slotIndex: i,
        emptyHint: 'Encaixe de arma vazio. Equipe uma arma pelo compartimento.',
      });
    }

    for (let i = 0; i < hull.defenseSlots; i++) {
      slots.push({
        key: `sh_${i}`,
        slotLabel: `Escudo ${i + 1}/${hull.defenseSlots}`,
        category: 'shield',
        itemId: ship.shieldIds[i] ?? null,
        slotIndex: i,
        emptyHint: 'Encaixe de escudo vazio. Equipe um escudo pelo compartimento.',
      });
    }

    for (let i = 0; i < hull.extractionSlots; i++) {
      slots.push({
        key: `ex_${i}`,
        slotLabel: `Extrator ${i + 1}/${hull.extractionSlots}`,
        category: 'extractor',
        itemId: ship.extractorIds[i] ?? null,
        slotIndex: i,
        emptyHint: 'Encaixe de extrator vazio. Equipe um extrator pelo compartimento.',
      });
    }

    for (let i = 0; i < hull.utilitySlots; i++) {
      slots.push({
        key: `ut_${i}`,
        slotLabel: `Utilidade ${i + 1}/${hull.utilitySlots}`,
        category: 'utility',
        itemId: ship.utilityIds[i] ?? null,
        slotIndex: i,
        emptyHint: 'Encaixe de utilidade vazio. Equipe um módulo pelo compartimento.',
      });
    }

    ship.suitGearIds.forEach((id, i) => {
      slots.push({
        key: `su_${i}_${id}`,
        slotLabel: `Traje de Solo ${i + 1}`,
        category: 'suit',
        itemId: id,
        slotIndex: i,
        emptyHint: '',
      });
    });
    slots.push({
      key: `su_empty_${ship.suitGearIds.length}`,
      slotLabel: `Traje de Solo ${ship.suitGearIds.length + 1}`,
      category: 'suit',
      itemId: null,
      slotIndex: ship.suitGearIds.length,
      emptyHint: 'Espaço livre para traje ou drone de expedição em solo.',
    });

    return slots;
  }, [ship, hull]);

  const activeConsumables = Object.entries(campaign.consumables).filter(([, qty]) => qty > 0);
  const vault = useMemo(() => normalizeFactionVault(campaign.factionVault), [campaign.factionVault]);
  const vaultCount = factionVaultItemCount(vault);
  const vaultCycleFee = factionVaultFee(vault);
  const vaultFaction = FACTIONS_BY_ID[campaign.chosenFactionId];
  const cargoFree = Math.max(0, stats.cargoCapacity - cargoTotal);
  const equipShip = campaign.ships.find((entry) => entry.uid === equipShipUid) ?? ship;

  return (
    <div className="h-full flex flex-col gap-2.5 p-2.5 sm:p-3 bg-[#060a14] border-l border-slate-800 text-slate-100 select-none overflow-hidden">
      {/* CARD 1: Non-minimizable Hero Card */}
      <section
        className="shrink-0 bg-[#0b1222] border rounded-2xl p-3.5 shadow-lg"
        style={{ borderColor: `${shipColor}66` }}
      >
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-3 min-w-0">
            <HullSprite hullId={ship.hullId} size={48} colorOverride={shipColor} />
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <h2 className="font-display text-lg sm:text-xl font-bold text-white truncate">
                  {ship.customName}
                </h2>
                <span className="text-xs text-slate-500">-</span>
                <span className={`text-xs font-semibold ${hullStyle.text}`}>{hull.name}</span>
                <span className="text-xs text-slate-500">-</span>
                <span className={`text-xs font-semibold capitalize ${hullStyle.text}`}>
                  {hullStyle.label}
                </span>
                {shipFac && (
                  <>
                    <span className="text-xs text-slate-500">-</span>
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold"
                      style={{ color: shipColor }}
                    >
                      <Flag className="w-3 h-3 shrink-0" />
                      {shipFac.name}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                <TechCategoryBadge
                  category={hull.factionStyle}
                  activeCategory={stats.techSynergy.activeTechCategory}
                  bonusText="+10% Casco · +15% Vel."
                />
                {hull.factionStyle !== stats.techSynergy.activeTechCategory && (
                  <span className="text-[10px] text-slate-400">
                    Tipo da Raça:{' '}
                    <strong className={TECH_CATEGORY_META[stats.techSynergy.activeTechCategory].text}>
                      {TECH_CATEGORY_META[stats.techSynergy.activeTechCategory].shortLabel}
                    </strong>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{hull.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* CARD 2: Action Tabs Card */}
      <section className="shrink-0 bg-[#0b1222] border border-slate-800 rounded-2xl p-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
        <button
          type="button"
          data-tutorial-id="ship-tab-nave"
          onClick={() => setTab('nave')}
          className={`py-1.5 px-2 rounded-xl font-medium cursor-pointer transition-colors ${
            tab === 'nave'
              ? 'bg-cyan-500 text-slate-950 font-semibold'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          Nave
        </button>
        <button
          type="button"
          data-tutorial-id="ship-tab-personagem"
          onClick={() => setTab('personagem')}
          className={`py-1.5 px-2 rounded-xl font-medium cursor-pointer transition-colors inline-flex items-center justify-center gap-1 ${
            tab === 'personagem'
              ? 'bg-cyan-500 text-slate-950 font-semibold'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Personagem</span>
          {character.attributePoints > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold font-mono-tabular">
              +{character.attributePoints}
            </span>
          )}
        </button>
        <button
          type="button"
          data-tutorial-id="ship-tab-tripulacao"
          onClick={() => setTab('tripulacao')}
          className={`py-1.5 px-2 rounded-xl font-medium cursor-pointer transition-colors ${
            tab === 'tripulacao'
              ? 'bg-cyan-500 text-slate-950 font-semibold'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          Tripulação ({campaign.crew.length})
        </button>
        <button
          type="button"
          data-tutorial-id="ship-tab-compartimento"
          onClick={() => setTab('compartimento')}
          className={`py-1.5 px-2 rounded-xl font-medium cursor-pointer transition-colors ${
            tab === 'compartimento'
              ? 'bg-cyan-500 text-slate-950 font-semibold'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          Compartimento ({cargoTotal}/{stats.cargoCapacity})
        </button>
        <button
          type="button"
          data-tutorial-id="ship-tab-frota"
          onClick={() => setTab('frota')}
          className={`py-1.5 px-2 rounded-xl font-medium cursor-pointer transition-colors ${
            tab === 'frota'
              ? 'bg-cyan-500 text-slate-950 font-semibold'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          Frota ({campaign.ships.length})
        </button>
        <button
          type="button"
          data-tutorial-id="ship-tab-cofre"
          onClick={() => setTab('cofre')}
          className={`py-1.5 px-2 rounded-xl font-medium cursor-pointer transition-colors inline-flex items-center justify-center gap-1 ${
            tab === 'cofre'
              ? 'bg-amber-400 text-slate-950 font-semibold'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          Cofre ({vaultCount})
        </button>
      </section>

      {/* CARD 3: Scrollable Active Content Card */}
      <section data-tutorial-scroll="ship-body" className="flex-1 min-h-0 bg-[#0b1222] border border-slate-800 rounded-2xl p-3.5 overflow-y-auto space-y-4 text-xs">
        {tab === 'nave' && (
          <>
            {/* Combat Score & Core Engineering Specs */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm text-white flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  Engenharia & Combate
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded border text-xs font-semibold font-mono-tabular ${atkStyle.badge}`}>
                    Poder {stats.attackLevel}
                  </span>
                  <span className="font-mono-tabular text-sm font-bold text-amber-300">
                    {stats.combatScore} pts
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                {/* 1. Nível de Ataque & DPS Total */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg px-2.5 py-2 flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-rose-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] text-slate-400">Nível de Ataque & DPS Total</div>
                    <strong className="text-[13px] text-rose-300 font-mono-tabular">
                      Nível {stats.attackLevel} · {stats.dps} DPS
                    </strong>
                  </div>
                </div>

                {/* 2. Velocidade & Furtividade */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg px-2.5 py-2 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-amber-300 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] text-slate-400">Velocidade & Furtividade</div>
                    <strong className="text-[13px] text-white font-mono-tabular">
                      {stats.speed} u/s · -{Math.round(stats.cloakReduction * 100)}% risco
                    </strong>
                  </div>
                </div>

                {/* 3. Casco & Blindagem */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg px-2.5 py-2 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] text-slate-400">Casco & Blindagem</div>
                    <div className="text-[13px]">
                      <strong className="text-emerald-300 font-mono-tabular">
                        {Math.round(ship.currentHull)}/{stats.maxHull}
                      </strong>{' '}
                      <span className="text-slate-400 text-xs">
                        (+{bonuses.hullRegenPerSec.toFixed(1)}/s · Blind. {stats.armor})
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Escudos */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg px-2.5 py-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] text-slate-400">Escudos & Recarga</div>
                    <div className="text-[13px]">
                      <strong className="text-cyan-300 font-mono-tabular">
                        {Math.round(ship.currentShield)}/{stats.maxShield}
                      </strong>{' '}
                      <span className="text-slate-400 text-xs">({stats.shieldRegen.toFixed(1)}/s)</span>
                    </div>
                  </div>
                </div>

                {/* 5. Distância de Salto */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg px-2.5 py-2 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-sky-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] text-slate-400">
                      Distância de Salto {jumpDrive ? `(${jumpDrive.name})` : ''}
                    </div>
                    <strong className="text-[13px] text-sky-300 font-mono-tabular">
                      {stats.jumpRangeLy} anos-luz
                    </strong>
                  </div>
                </div>

                {/* 6. Economia */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg px-2.5 py-2 flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] text-slate-400">Economia & Autonomia</div>
                    <strong className="text-[13px] text-white font-mono-tabular">
                      {Math.round(campaign.fuel)}/{stats.fuelCapacity} ({fuelPerLy}/a.l. · ~{maxReachableLy} a.l.)
                    </strong>
                  </div>
                </div>

                {/* 7. Compartimento */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg px-2.5 py-2 flex items-center gap-2">
                  <Package className="w-4 h-4 text-sky-300 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] text-slate-400">Compartimento</div>
                    <strong className="text-[13px] text-sky-200 font-mono-tabular">
                      {cargoTotal}/{stats.cargoCapacity} ({cargoFree} livre)
                    </strong>
                  </div>
                </div>

                {/* 8. Tripulação */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg px-2.5 py-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-300 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] text-slate-400">Tripulação</div>
                    <strong className="text-[13px] text-emerald-200 font-mono-tabular">
                      {activeCrew.length}/{hull.activeCrewPosts} ativos · {reserveCrew.length}/{hull.reserveQuarters} reserva
                    </strong>
                  </div>
                </div>
              </div>

              {/* Mitigações de escudo no mesmo lugar, com fonte azul neon */}
              <div className="pt-2.5 border-t border-slate-800 text-xs">
                <div className="text-cyan-300/90 font-medium mb-1.5">
                  Mitigação dos Escudos contra dano recebido (teto 85%):
                </div>
                <div className="grid grid-cols-4 gap-1.5 font-mono-tabular text-center">
                  <div className="bg-cyan-950/30 rounded-lg p-1.5 border border-cyan-500/40 text-[#38bdf8] font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.65)]">
                    Laser {Math.round(stats.mitigation.laser * 100)}%
                  </div>
                  <div className="bg-cyan-950/30 rounded-lg p-1.5 border border-cyan-500/40 text-[#38bdf8] font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.65)]">
                    Cinética {Math.round(stats.mitigation.cinetica * 100)}%
                  </div>
                  <div className="bg-cyan-950/30 rounded-lg p-1.5 border border-cyan-500/40 text-[#38bdf8] font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.65)]">
                    Plasma {Math.round(stats.mitigation.plasma * 100)}%
                  </div>
                  <div className="bg-cyan-950/30 rounded-lg p-1.5 border border-cyan-500/40 text-[#38bdf8] font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.65)]">
                    Míssil {Math.round(stats.mitigation.missil * 100)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Equipamentos: todos os slots sempre desenhados (mesmo vazios) em 2 colunas com botões embaixo */}
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-1.5">
                <span className="font-semibold text-sm text-slate-200 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Equipamentos da Nave
                </span>
                <span className="text-[11px] text-slate-400">
                  Arma {ship.weaponId ? 1 : 0}/{hull.weaponSlots} · Escudo {ship.shieldIds.length}/{hull.defenseSlots} · Extrator {ship.extractorIds.length}/{hull.extractionSlots} · Utilidade {ship.utilityIds.length}/{hull.utilitySlots}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {equipmentSlots.map((slot) => {
                  if (!slot.itemId) {
                    return (
                      <div
                        key={slot.key}
                        className="bg-slate-950/55 border border-dashed border-slate-800 rounded-xl p-2.5 flex flex-col justify-between gap-2"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
                              {slot.slotLabel}
                            </span>
                            <span className="px-1.5 py-0.5 rounded border border-slate-800 bg-slate-900 text-slate-500 text-[10px] font-semibold">
                              Vazio
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg border border-dashed border-slate-800 bg-slate-900/50 flex items-center justify-center text-slate-600 shrink-0">
                              <Cpu className="w-4 h-4" />
                            </div>
                            <div className="text-[11px] text-slate-500 leading-snug">
                              {slot.emptyHint}
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => setTab('compartimento')}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-[11px] font-semibold cursor-pointer"
                          >
                            Equipar do Compartimento
                          </button>
                        </div>
                      </div>
                    );
                  }

                  const itemId = slot.itemId;
                  const meta = getEquipmentMeta(slot.category, itemId);
                  const rStyle = RARITY_STYLES[meta.rarity] ?? RARITY_STYLES.comum;
                  const slotBonusText =
                    slot.category === 'weapon'
                      ? '+18% DPS'
                      : slot.category === 'shield'
                      ? '+18% Esc.'
                      : slot.category === 'jumpDrive'
                      ? '+15% Alc.'
                      : slot.category === 'extractor'
                      ? '+25% Ext.'
                      : slot.category === 'suit'
                      ? '+25%'
                      : '+20%';
                  return (
                    <div
                      key={slot.key}
                      className={`bg-slate-950/90 border rounded-xl p-2.5 flex flex-col justify-between gap-2 ${rStyle.border}`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1.5 flex-wrap">
                          <span className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold truncate">
                            {slot.slotLabel}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <TechCategoryBadge
                              category={meta.factionStyle}
                              activeCategory={bonuses.activeTechCategory}
                              bonusText={slotBonusText}
                              compact
                            />
                            <RarityBadge rarity={meta.rarity} />
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <EquipmentSprite category={slot.category} itemId={itemId} size={36} />
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <div className={`font-semibold text-xs leading-snug ${rStyle.text}`}>
                              {meta.name}
                            </div>
                            <div className="text-[10px] text-cyan-300 font-mono-tabular leading-snug">
                              {meta.statsLine}
                            </div>
                          </div>
                        </div>

                        {meta.description && (
                          <div className="text-[11px] text-slate-300 leading-snug">{meta.description}</div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => onUnequip(slot.category, itemId, slot.slotIndex)}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-[11px] font-semibold cursor-pointer"
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={() => onSendInstalledToVault(slot.category, itemId, slot.slotIndex)}
                          className={`${vaultButtonClass} text-[11px]`}
                        >
                          Enviar para o Cofre
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Owned Fleet Switcher */}
            {campaign.ships.length > 1 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Rocket className="w-3.5 h-3.5 text-cyan-400" />
                  Frota Própria ({campaign.ships.length})
                </div>
                {campaign.ships.map((s: OwnedShip) => {
                  const sHull = HULLS_BY_ID[s.hullId];
                  const sFac = FACTIONS_BY_ID[s.factionId ?? campaign.chosenFactionId];
                  const sColor = s.color ?? sFac?.color ?? sHull?.color ?? '#38bdf8';
                  const sStyle = sHull ? RARITY_STYLES[sHull.rarity] : RARITY_STYLES.comum;
                  return (
                    <div
                      key={s.uid}
                      className={`flex items-center justify-between gap-2.5 bg-slate-950/90 border rounded-xl p-2.5 ${sStyle.border}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <HullSprite hullId={s.hullId} size={36} colorOverride={sColor} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-medium text-white">{s.customName}</span>
                            {sHull && <RarityBadge rarity={sHull.rarity} />}
                            {sFac && (
                              <span className="text-[10px] font-semibold" style={{ color: sColor }}>
                                {sFac.name}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">{sHull?.name}</div>
                        </div>
                      </div>
                      {s.uid === campaign.activeShipUid ? (
                        <span className="text-emerald-400 font-semibold text-[11px] shrink-0">Ativa</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSwitchShip(s.uid)}
                          className="px-2.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold shrink-0 cursor-pointer"
                        >
                          Assumir
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Por último: Origem, Bônus Fixos & Habilidades */}
            {((campaign.specialAbilityIds?.length ?? 0) > 0 || (campaign.chosenOriginSummary?.length ?? 0) > 0) && (
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Origem, Bônus Fixos & Habilidades
                  </span>
                </div>

                {(() => {
                  const ob = campaign.originBonuses ?? DEFAULT_ORIGIN_BONUSES;
                  const activeMods: string[] = [];
                  if (ob.combatDpsMult > 1) activeMods.push(`Dano +${Math.round((ob.combatDpsMult - 1) * 100)}%`);
                  if (ob.hullFlatBonus > 0) activeMods.push(`Casco +${ob.hullFlatBonus}`);
                  if (ob.shieldCapMult > 1) activeMods.push(`Escudo +${Math.round((ob.shieldCapMult - 1) * 100)}%`);
                  if (ob.hullRegenPerSec > 0) activeMods.push(`Regen. +${ob.hullRegenPerSec.toFixed(1)}/s`);
                  if (ob.cargoFlatBonus > 0) activeMods.push(`Compartimento +${ob.cargoFlatBonus}`);
                  if (ob.fuelCostMult < 1) activeMods.push(`Combustível -${Math.round((1 - ob.fuelCostMult) * 100)}%`);
                  if (ob.minerRateMult > 1) activeMods.push(`Extração +${Math.round((ob.minerRateMult - 1) * 100)}%`);
                  if (ob.tradePriceBonus > 0) activeMods.push(`Comércio +${Math.round(ob.tradePriceBonus * 100)}%`);
                  if (ob.explorerBonus > 0) activeMods.push(`Exploração +${ob.explorerBonus}`);
                  if (ob.hazardResistBonus > 0) activeMods.push(`Resist. Ambiental +${Math.round(ob.hazardResistBonus * 100)}%`);
                  if (ob.renownGainMult > 1) activeMods.push(`Reputação +${Math.round((ob.renownGainMult - 1) * 100)}%`);
                  if (ob.warScoreMult > 1) activeMods.push(`Guerra +${Math.round((ob.warScoreMult - 1) * 100)}%`);
                  if (ob.cloakBonus > 0) activeMods.push(`Furtividade +${Math.round(ob.cloakBonus * 100)}%`);
                  if (ob.supplyCostMult < 1) activeMods.push(`Mantimentos -${Math.round((1 - ob.supplyCostMult) * 100)}%`);
                  if ((ob.fleeBonusPct ?? 0) > 0) activeMods.push(`Chance de Fuga +${ob.fleeBonusPct}%`);

                  return activeMods.length > 0 ? (
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono-tabular text-cyan-200">
                      {activeMods.map((txt) => (
                        <div key={txt} className="bg-slate-900/70 border border-slate-800 rounded-lg px-2 py-1">
                          {txt}
                        </div>
                      ))}
                    </div>
                  ) : null;
                })()}

                {(campaign.specialAbilityIds?.length ?? 0) > 0 && (
                  <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                    {campaign.specialAbilityIds.map((abId) => {
                      const ab = SPECIAL_ABILITIES_BY_ID[abId];
                      if (!ab) return null;
                      return (
                        <div key={abId} className="bg-slate-900/80 border border-slate-800 rounded-lg p-2 space-y-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-white">{ab.name}</span>
                            <span className="text-[10px] font-mono-tabular text-amber-300 shrink-0">
                              {ab.kind === 'combate_ativa' ? `Ativa (${ab.cooldownSec ?? 24}s)` : 'Passiva'} · {ab.ownerName}
                            </span>
                          </div>
                          <div className="text-[11px] text-cyan-300">{ab.summary}</div>
                          <div className="text-[10px] text-slate-400">{ab.description}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {(campaign.chosenOriginSummary?.length ?? 0) > 0 && (
                  <div className="pt-1 border-t border-slate-800/80 space-y-1 text-[10px] text-slate-400">
                    {campaign.chosenOriginSummary.map((entry, idx) => (
                      <div key={`${entry.stage}_${idx}`} className="flex items-center justify-between gap-2">
                        <span className="truncate text-slate-300">
                          {entry.stage}: <strong className="text-white">{entry.label}</strong>
                        </span>
                        <span className="text-cyan-400 shrink-0">{entry.rewardTag}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {tab === 'personagem' && (
          <div className="space-y-3.5">
            {/* Ficha Principal do Personagem */}
            <div className="bg-slate-950/90 border border-cyan-500/35 rounded-xl p-3.5 space-y-3">
              <div className="flex items-start gap-3">
                {playerSpecies && (
                  <CreatureCard
                    cardId={`species_${playerSpecies.id}`}
                    kind="species"
                    name={playerSpecies.name}
                    lifeFormId={playerSpecies.lifeFormId}
                    description={playerSpecies.description}
                    sizeClass="w-20 h-20"
                    allowAiGeneration={false}
                  />
                )}
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-bold text-white truncate">
                        {campaign.playerName}
                      </h3>
                      <div className="text-xs text-slate-300 flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-cyan-300">{playerSpecies?.name ?? campaign.chosenSpeciesId}</span>
                        {playerLifeForm && <span className="text-slate-500">· {playerLifeForm.name}</span>}
                        {originFaction && (
                          <span className="text-slate-400">
                            · Origem: <strong style={{ color: originFaction.color }}>{originFaction.name}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-400/50 text-cyan-200 font-display font-bold text-xs font-mono-tabular">
                        Nível {character.level}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-slate-400">Tipo Tecnológico da Raça:</span>
                    <TechCategoryBadge category={bonuses.activeTechCategory} />
                  </div>
                  <div className="text-[11px] text-slate-400 leading-snug">
                    {TECH_CATEGORY_META[bonuses.activeTechCategory].synergyHint}. Naves, equipamentos, consumíveis e recursos desse mesmo tipo recebem bônus automáticos de harmonia.
                  </div>
                </div>
              </div>

              {/* Barra de XP & Pontos Disponíveis */}
              <div className="pt-2.5 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="text-slate-300 font-medium">
                    Experiência (missões, inimigos destruídos e eventos)
                  </span>
                  <span className="font-mono-tabular font-semibold text-cyan-300">
                    {character.xp} / {xpForNext} XP ({xpPct}%)
                  </span>
                </div>
                <div className="h-2 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${xpPct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5">
                  <span className="text-[11px] text-slate-400">
                    Cada nível concede <strong className="text-white">+2 pontos</strong> de atributo.
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg border font-mono-tabular font-bold text-[11px] ${
                      character.attributePoints > 0
                        ? 'bg-amber-500/20 border-amber-400/60 text-amber-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Pontos para distribuir: {character.attributePoints}
                  </span>
                </div>
              </div>
            </div>

            {/* Distribuição de Atributos */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  Atributos do Comandante
                </span>
                <span className="text-[11px] text-slate-400">Máximo {CHARACTER_ATTRIBUTE_MAX} pts por atributo</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CHARACTER_ATTRIBUTE_LIST.map((attr) => {
                  const pts = character.attributes[attr.id] ?? 0;
                  const canUpgrade = character.attributePoints > 0 && pts < CHARACTER_ATTRIBUTE_MAX;
                  const fillPct = Math.round((pts / CHARACTER_ATTRIBUTE_MAX) * 100);
                  return (
                    <div
                      key={attr.id}
                      className="bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between gap-2"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-white text-xs">{attr.name}</span>
                          <span className="font-mono-tabular text-[11px] font-bold text-cyan-300">
                            {pts}/{CHARACTER_ATTRIBUTE_MAX}
                          </span>
                        </div>
                        <div className="text-[10px] font-semibold text-emerald-300 font-mono-tabular">
                          {pts > 0 ? attr.formatActiveBonus(pts) : `Sem pontos (${attr.shortBonus})`}
                        </div>
                        <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 transition-all duration-200"
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">{attr.description}</p>
                      </div>

                      <div className="pt-1.5 border-t border-slate-800/70 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-500 font-mono-tabular">{attr.shortBonus}</span>
                        <button
                          type="button"
                          disabled={!canUpgrade}
                          onClick={() => onSpendAttributePoint(attr.id)}
                          className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-semibold text-[11px] inline-flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Plus className="w-3 h-3" />
                          Melhorar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resumo Percentual de Bônus Ativos */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Impacto Total do Personagem & Harmonia Tecnológica
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px] font-mono-tabular">
                <div className="bg-slate-900/70 border border-slate-800 rounded-lg px-2 py-1.5 text-rose-300">
                  Dano: +{Number(((charMods.dpsMult - 1) * 100).toFixed(1))}% · Fuga: +{Number(charMods.fleeBonusPct.toFixed(1))}%
                </div>
                <div className="bg-slate-900/70 border border-slate-800 rounded-lg px-2 py-1.5 text-emerald-300">
                  Casco/Esc.: +{Math.round((charMods.hullMult - 1) * 100)}% · +{charMods.hullRegenBonus.toFixed(2)}/s
                </div>
                <div className="bg-slate-900/70 border border-slate-800 rounded-lg px-2 py-1.5 text-sky-300">
                  Vel. +{Math.round((charMods.speedMult - 1) * 100)}% · Comb. -{Number(((1 - charMods.fuelMult) * 100).toFixed(1))}%
                </div>
                <div className="bg-slate-900/70 border border-slate-800 rounded-lg px-2 py-1.5 text-amber-300">
                  Com. +{Number((charMods.tradeBonusPct * 100).toFixed(1))}% · Rep. +{Math.round((charMods.renownMult - 1) * 100)}%
                </div>
                <div className="bg-slate-900/70 border border-slate-800 rounded-lg px-2 py-1.5 text-cyan-300">
                  Extração +{Math.round((charMods.minerRateMult - 1) * 100)}% · Carga +{charMods.cargoFlatBonus}
                </div>
                <div className="bg-slate-900/70 border border-slate-800 rounded-lg px-2 py-1.5 text-purple-300">
                  Expl. +{Math.round((charMods.explorerPowerMult - 1) * 100)}% · Cons. +{Math.round((charMods.consumableMult - 1) * 100)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'tripulacao' && (
          <>
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Mantimentos & Eficiência
                </span>
                <span className={`font-mono-tabular font-bold ${campaign.supplies > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {Math.round(campaign.supplies)} un.
                </span>
              </div>
              <div className="text-[11px] text-emerald-400 font-mono-tabular">
                Consumo: -{supplyDrainPerSec === 0 ? '0' : supplyDrainPerSec.toFixed(2)}/s
              </div>
              <div className="pt-2 border-t border-slate-800 space-y-0.5 font-mono-tabular">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Harmonia da Tripulação</span>
                  <span
                    className={`font-bold ${
                      harmony.harmonyPct > 50
                        ? 'text-emerald-400'
                        : harmony.harmonyPct === 50
                          ? 'text-slate-200'
                          : 'text-rose-400'
                    }`}
                  >
                    {harmony.harmonyPct}%
                  </span>
                </div>
                <div
                  className={`text-[11px] font-semibold ${
                    harmony.efficiencyBonusPct > 0
                      ? 'text-emerald-400'
                      : harmony.efficiencyBonusPct === 0
                        ? 'text-slate-300'
                        : 'text-rose-400'
                  }`}
                >
                  Bônus de Eficiência:{' '}
                  {harmony.efficiencyBonusPct > 0
                    ? `+${harmony.efficiencyBonusPct}`
                    : harmony.efficiencyBonusPct}
                  %
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <div className="text-[10px] uppercase tracking-wider text-cyan-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Bônus Ativos Totais
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-300 font-mono-tabular">
                  <div>
                    Saúde da Tripulação:{' '}
                    <span
                      className={
                        healthRatio >= 0.7
                          ? 'text-emerald-300'
                          : healthRatio >= 0.35
                            ? 'text-amber-300'
                            : 'text-rose-400'
                      }
                    >
                      {currentCrewHealth}/{maxCrewHealth}
                    </span>
                  </div>
                  <div>
                    Regen. Saúde: {crewHealthRegenPerSec >= 0 ? '+' : ''}
                    {crewHealthRegenPerSec.toFixed(2)}/s
                  </div>
                  <div>Eficiência Tripulação: {crewEfficiencyPct}%</div>
                  <div>Econ. Mantimentos: -{Math.round((1 - bonuses.supplyCostMult) * 100)}%</div>
                  <div>Combate em Solo: +{suitCombatPower}</div>
                  <div>Exploração Solo: +{Math.round(bonuses.explorerBonus + suitExplorationBonus)}</div>
                  <div>
                    Resist. Ambiental: +{Math.round(bonuses.hazardResistBonus * 100)}%
                    {suitHazardProtections > 0 ? ` (${suitHazardProtections} prot.)` : ''}
                  </div>
                  <div>Chance de Fuga: +{Math.round(bonuses.fleeBonusPct ?? 0)}%</div>
                  <div>Dano de Armas (DPS): +{Math.round((bonuses.combatDpsMult - 1) * 100)}%</div>
                  <div>Guerra Galáctica: +{Math.round((bonuses.warScoreMult - 1) * 100)}%</div>
                  <div>Casco Extra: +{Math.round(bonuses.hullFlatBonus ?? 0)}</div>
                  <div>Regen. Casco: +{bonuses.hullRegenPerSec.toFixed(1)}/s</div>
                  <div>Escudos: +{Math.round((bonuses.shieldCapMult - 1) * 100)}%</div>
                  <div>Recarga Escudo: +{Math.round((bonuses.shieldRegenMult - 1) * 100)}%</div>
                  <div>Kits Reparo: +{Math.round((bonuses.repairKitMult - 1) * 100)}%</div>
                  <div>Furtividade: +{Math.round(stats.cloakReduction * 100)}%</div>
                  <div>
                    Econ. Combustível:{' '}
                    {fuelEconomyPct >= 0 ? `-${fuelEconomyPct}` : `+${Math.abs(fuelEconomyPct)}`}%
                  </div>
                  <div>Tanque Extra: +{Math.round(utilityFuelBonus)}</div>
                  <div>Compartimento Extra: +{Math.round(utilityCargoBonus + (bonuses.cargoFlatBonus ?? 0))}</div>
                  <div>Extração: +{Math.round((bonuses.minerRateMult - 1) * 100)}%</div>
                  <div>Comércio: +{Math.round(bonuses.tradePriceBonus * 100)}%</div>
                  <div>Reputação: +{Math.round((bonuses.diplomatRenownMult - 1) * 100)}%</div>
                </div>
              </div>
            </div>

            {/* 8 Active Stations */}
            <div className="space-y-2">
              <div className="font-semibold text-slate-200">
                Postos Ativos ({activeCrew.length}/{hull.activeCrewPosts})
              </div>
              {(Object.keys(ROLE_INFO) as CrewRole[]).map((role) => {
                const member = activeCrew.find((c) => c.role === role);
                const reservesForRole = reserveCrew.filter((c) => c.role === role);
                const bonusPct = reservesForRole.length * 5;
                const skillMeta = member ? getSkillBadge(member.skill) : null;
                const spName = member ? SPECIES_BY_ID[member.speciesId]?.name : null;
                return (
                  <div
                    key={role}
                    className="bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 flex items-start gap-2.5"
                  >
                    {member ? (
                      <CrewPortraitSprite speciesId={member.speciesId} role={member.role} size={38} />
                    ) : (
                      <div className="w-[38px] h-[38px] rounded-lg border border-dashed border-slate-800 bg-slate-900/50 flex items-center justify-center text-slate-600 shrink-0">
                        <Users className="w-4 h-4" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-semibold text-cyan-300">{ROLE_INFO[role].label}</span>
                        {member && skillMeta ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-white font-semibold">{member.name}</span>
                            <span className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold font-mono-tabular ${skillMeta.badge}`}>
                              {skillMeta.label}
                            </span>
                            {bonusPct > 0 && (
                              <span className="text-emerald-300 text-[10px] font-mono-tabular">(+{bonusPct}%)</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500">Posto Vago</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between gap-2">
                        <span>
                          {ROLE_INFO[role].desc}
                          {member && spName && ` · ${spName} (${Number((member.skill * bonuses.supplyCostMult * (1.5 / 2.5) * 0.65).toFixed(1))} mant./min)`}
                        </span>
                        {member && (
                          <div className="flex gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={reserveCrew.length >= hull.reserveQuarters}
                              onClick={() => onToggleCrewStatus(member.id)}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 cursor-pointer"
                              title={
                                reserveCrew.length >= hull.reserveQuarters
                                  ? 'Quartos reserva lotados'
                                  : 'Mover para Reserva'
                              }
                            >
                              <ArrowUpDown className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDismissCrew(member.id)}
                              className="p-1 rounded bg-slate-800 hover:bg-rose-600 text-slate-300 cursor-pointer"
                              title="Dispensar"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reserve Quarters (+5% bonus per matching specialist) */}
            <div className="space-y-2">
              <div className="font-semibold text-slate-200">
                Quartos Reserva ({reserveCrew.length}/{hull.reserveQuarters}) · +5% potência ao ativo da mesma função
              </div>
              {reserveCrew.length === 0 ? (
                <div className="text-slate-500 italic">Nenhum tripulante na reserva.</div>
              ) : (
                reserveCrew.map((m) => {
                  const skillMeta = getSkillBadge(m.skill);
                  const roleFull = activeCrew.length >= hull.activeCrewPosts;
                  return (
                    <div
                      key={m.id}
                      className="flex items-center justify-between gap-2.5 bg-slate-950/90 border border-slate-800 rounded-xl p-2.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CrewPortraitSprite speciesId={m.speciesId} role={m.role} size={36} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-medium text-white">{m.name}</span>
                            <span className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold font-mono-tabular ${skillMeta.badge}`}>
                              {skillMeta.label}
                            </span>
                          </div>
                          <div className="text-[11px] text-cyan-300">{ROLE_INFO[m.role].label}</div>
                          <div className="text-[10px] text-slate-400">{ROLE_INFO[m.role].desc}</div>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={roleFull}
                          onClick={() => onToggleCrewStatus(m.id)}
                          className="px-2 py-1 rounded bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-semibold cursor-pointer"
                          title={roleFull ? 'Postos ativos da nave estão cheios' : 'Promover para posto ativo'}
                        >
                          {roleFull ? 'Postos Cheios' : 'Ativar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDismissCrew(m.id)}
                          className="p-1 rounded bg-slate-800 hover:bg-rose-600 text-slate-300 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {tab === 'compartimento' && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="font-semibold text-slate-200">Consumíveis</div>
              {activeConsumables.length === 0 ? (
                <div className="text-slate-500 italic">Nenhum consumível no compartimento.</div>
              ) : (
                activeConsumables.map(([id, qty]) => {
                  const def = CONSUMABLES_BY_ID[id];
                  if (!def) return null;
                  const rarity = def.rarity ?? 'comum';
                  return (
                    <div key={id} className="bg-slate-900/65 border border-slate-800 rounded-xl p-2.5">
                      <div className="flex items-start gap-2.5">
                        <EquipmentSprite category="consumable" itemId={id} size={32} />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="font-semibold text-white">{def.name}</span>
                            <TechCategoryBadge
                              category={def.factionStyle}
                              activeCategory={bonuses.activeTechCategory}
                              bonusText="+35%"
                              compact
                            />
                            <RarityBadge rarity={rarity} />
                            <span className="ml-auto inline-flex items-center gap-2 flex-wrap justify-end">
                              <span className="font-mono-tabular text-cyan-200">({qty})</span>
                              <button
                                type="button"
                                onClick={() => onUseConsumable(id)}
                                className="px-2.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold shrink-0 cursor-pointer"
                              >
                                Usar
                              </button>
                              <SendToVaultButtons qty={qty} onSend={(amount) => onSendConsumableToVault(id, amount)} />
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-300 leading-snug mt-1">{def.description}</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="space-y-1.5">
              <div className="font-semibold text-slate-200">Peças</div>
              {ship.depot.length === 0 ? (
                <div className="text-slate-500 italic">Nenhuma peça guardada. O que você compra chega aqui, e só entra na nave quando você equipa.</div>
              ) : (
                ship.depot.map((item) => {
                  const meta = getEquipmentMeta(item.category, item.itemId);
                  const rStyle = RARITY_STYLES[meta.rarity] ?? RARITY_STYLES.comum;
                  const slotBonusText =
                    item.category === 'weapon'
                      ? '+18% DPS'
                      : item.category === 'shield'
                      ? '+18% Esc.'
                      : item.category === 'jumpDrive'
                      ? '+15% Alc.'
                      : item.category === 'extractor'
                      ? '+25% Ext.'
                      : item.category === 'suit'
                      ? '+25%'
                      : '+20%';
                  return (
                    <div key={item.uid} className={`bg-slate-950/90 border rounded-xl p-2.5 flex items-start gap-2.5 ${rStyle.border}`}>
                      <EquipmentSprite category={item.category} itemId={item.itemId} size={36} />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`font-semibold ${rStyle.text}`}>{meta.name}</span>
                              <TechCategoryBadge
                                category={meta.factionStyle}
                                activeCategory={bonuses.activeTechCategory}
                                bonusText={slotBonusText}
                                compact
                              />
                              <RarityBadge rarity={meta.rarity} />
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {CATEGORY_LABELS[item.category] ?? item.category}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 shrink-0 justify-end">
                            <button
                              type="button"
                              onClick={() => onEquipFromDepot(item.uid)}
                              className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold shrink-0 cursor-pointer"
                            >
                              Equipar
                            </button>
                            <button
                              type="button"
                              onClick={() => onSendDepotToVault(item.uid)}
                              className={vaultButtonClass}
                            >
                              Enviar para o Cofre
                            </button>
                          </div>
                        </div>
                        <div className="text-[10px] text-cyan-300 font-mono-tabular">{meta.statsLine}</div>
                        {meta.description && <div className="text-[11px] text-slate-300">{meta.description}</div>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="space-y-1.5">
              <div className="font-semibold text-slate-200">Recursos</div>
              {campaign.cargo.length === 0 ? (
                <div className="text-slate-500 italic">Nenhum recurso guardado.</div>
              ) : (
                campaign.cargo.map((c) => {
                  const res = RESOURCES_BY_ID[c.resourceId];
                  if (!res || c.qty <= 0) return null;
                  const rStyle = RARITY_STYLES[res.rarity] ?? RARITY_STYLES.comum;
                  return (
                    <div key={c.resourceId} className={`bg-slate-950/90 border rounded-xl p-2.5 flex items-start gap-2.5 ${rStyle.border}`}>
                      <ResourceSprite resourceId={res.id} size={36} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                            <span className={`font-semibold truncate ${rStyle.text}`}>{res.name}</span>
                            <TechCategoryBadge
                              category={res.factionStyle}
                              activeCategory={bonuses.activeTechCategory}
                              bonusText="+15% venda"
                              compact
                            />
                          </div>
                          <span className="font-mono-tabular text-white shrink-0">{c.qty} unidades</span>
                        </div>
                        <div className="text-[11px] text-slate-400">{res.description}</div>
                        <div className="flex flex-wrap gap-1 justify-end pt-1">
                          <SendToVaultButtons qty={c.qty} onSend={(amount) => onSendResourceToVault(c.resourceId, amount)} />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {tab === 'frota' && (
          <div className="space-y-2.5">
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-300 space-y-1">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-amber-400" />
                Frota Própria & Alinhamento de Facção
              </div>
              <p className="text-slate-400">
                Cada nave pertence a uma facção e possui sua própria cor tática. Ao assumir o comando de uma nave de outra facção, sua facção ativa e pintura na galáxia mudam automaticamente para a facção da nave pilotada.
              </p>
            </div>

            {campaign.ships.map((s: OwnedShip) => {
              const sHull = HULLS_BY_ID[s.hullId];
              const sFac = FACTIONS_BY_ID[s.factionId ?? campaign.chosenFactionId];
              const sColor = s.color ?? sFac?.color ?? sHull?.color ?? '#38bdf8';
              const isActive = s.uid === campaign.activeShipUid;
              return (
                <div
                  key={s.uid}
                  className="bg-slate-950/90 border rounded-xl p-3 space-y-2"
                  style={{ borderColor: isActive ? sColor : `${sColor}55` }}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <HullSprite hullId={s.hullId} size={42} colorOverride={sColor} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-white">{s.customName}</span>
                          {sHull && <RarityBadge rarity={sHull.rarity} />}
                          {sHull && (
                            <TechCategoryBadge
                              category={sHull.factionStyle}
                              activeCategory={bonuses.activeTechCategory}
                              bonusText="+10% Casco"
                              compact
                            />
                          )}
                          {isActive && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[10px] font-semibold">
                              Pilotando Agora
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-300">{sHull?.name}</div>
                        {sFac && (
                          <div className="text-[11px] font-semibold flex items-center gap-1 mt-0.5" style={{ color: sColor }}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sColor }} />
                            Facção: {sFac.name} ({sFac.axis})
                          </div>
                        )}
                      </div>
                    </div>

                    {!isActive && (
                      <button
                        type="button"
                        onClick={() => onSwitchShip(s.uid)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold shrink-0 cursor-pointer"
                      >
                        Assumir Nave
                      </button>
                    )}
                  </div>
                  {sHull && (
                    <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono-tabular text-slate-300 pt-1 border-t border-slate-800/80">
                      <div>Casco: <strong className="text-white">{Math.round(s.currentHull)}/{sHull.maxHull}</strong></div>
                      <div>Blind.: <strong className="text-white">{sHull.armor}</strong></div>
                      <div>Compartimento: <strong className="text-white">{sHull.cargoCapacity}</strong></div>
                      <div>Vel.: <strong className="text-white">{sHull.speed}</strong></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === 'cofre' && (
          <div className="space-y-3">
            <div className="bg-slate-950/90 border border-amber-500/40 rounded-xl p-3 space-y-1.5">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-amber-400" />
                Cofre da Facção
                {vaultFaction && (
                  <span className="text-[11px] font-semibold" style={{ color: vaultFaction.color }}>
                    {vaultFaction.name}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                A facção guarda peças, recursos e consumíveis sem limite de quantidade. Cada item custa {FACTION_VAULT_FEE_PER_ITEM} créditos por ciclo galáctico, descontados do seu saldo quando o ciclo vira.
              </p>
              <p className="text-[11px] text-amber-200 font-mono-tabular">
                {vaultCount === 1 ? '1 item' : `${vaultCount} itens`} no cofre · {vaultCycleFee} créditos por ciclo
              </p>
              <p className="text-[11px] text-slate-400 leading-snug">
                Equipar instala a peça na nave escolhida. Se o encaixe já estiver ocupado, a peça que sair volta para o cofre.
              </p>
            </div>

            {campaign.ships.length > 1 && (
              <label className="block space-y-1">
                <span className="text-[11px] font-semibold text-slate-300">Nave que recebe a peça</span>
                <select
                  value={equipShip.uid}
                  onChange={(event) => setEquipShipUid(event.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-100"
                >
                  {campaign.ships.map((entry) => (
                    <option key={entry.uid} value={entry.uid}>
                      {entry.customName}
                      {entry.uid === campaign.activeShipUid ? ' · pilotando agora' : ''}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <div className="space-y-1.5">
              <div className="font-semibold text-slate-200">Peças</div>
              {vault.gear.length === 0 ? (
                <div className="text-slate-500 italic">Nenhuma peça no cofre.</div>
              ) : (
                vault.gear.map((item) => {
                  const meta = getEquipmentMeta(item.category, item.itemId);
                  const rStyle = RARITY_STYLES[meta.rarity] ?? RARITY_STYLES.comum;
                  return (
                    <div key={item.uid} className={`bg-slate-950/90 border rounded-xl p-2.5 flex items-start gap-2.5 ${rStyle.border}`}>
                      <EquipmentSprite category={item.category} itemId={item.itemId} size={36} />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`font-semibold ${rStyle.text}`}>{meta.name}</span>
                              <TechCategoryBadge
                                category={meta.factionStyle}
                                activeCategory={bonuses.activeTechCategory}
                                compact
                              />
                              <RarityBadge rarity={meta.rarity} />
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {CATEGORY_LABELS[item.category] ?? item.category} · {FACTION_VAULT_FEE_PER_ITEM} créditos por ciclo
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-cyan-300 font-mono-tabular">{meta.statsLine}</div>
                        {meta.description && <div className="text-[11px] text-slate-300">{meta.description}</div>}
                        <div className="flex flex-wrap gap-1 justify-end">
                          <button
                            type="button"
                            onClick={() => onEquipFromVault(item.uid, equipShip.uid)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold cursor-pointer"
                          >
                            Equipar{campaign.ships.length > 1 ? ` em ${equipShip.customName}` : ''}
                          </button>
                          <button
                            type="button"
                            disabled={cargoFree <= 0}
                            onClick={() => onWithdrawGear(item.uid)}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-100 font-semibold cursor-pointer"
                          >
                            Retirar para o Compartimento
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="space-y-1.5">
              <div className="font-semibold text-slate-200">Recursos</div>
              {vault.resources.length === 0 ? (
                <div className="text-slate-500 italic">Nenhum recurso no cofre.</div>
              ) : (
                vault.resources.map((row) => {
                  const res = RESOURCES_BY_ID[row.resourceId];
                  if (!res) return null;
                  const rStyle = RARITY_STYLES[res.rarity] ?? RARITY_STYLES.comum;
                  return (
                    <div key={row.resourceId} className={`bg-slate-950/90 border rounded-xl p-2.5 flex items-start gap-2.5 ${rStyle.border}`}>
                      <ResourceSprite resourceId={res.id} size={36} />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                            <span className={`font-semibold truncate ${rStyle.text}`}>{res.name}</span>
                            <TechCategoryBadge
                              category={res.factionStyle}
                              activeCategory={bonuses.activeTechCategory}
                              compact
                            />
                          </div>
                          <span className="font-mono-tabular text-white shrink-0">{row.qty} unidades</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {res.description} · {row.qty * FACTION_VAULT_FEE_PER_ITEM} créditos por ciclo
                        </div>
                        <div className="flex flex-wrap gap-1 justify-end">
                          <button
                            type="button"
                            disabled={cargoFree <= 0}
                            onClick={() => onWithdrawResource(row.resourceId, 1)}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-100 font-semibold cursor-pointer"
                          >
                            Retirar
                          </button>
                          {row.qty > 1 && (
                            <button
                              type="button"
                              disabled={cargoFree <= 0}
                              onClick={() => onWithdrawResource(row.resourceId, row.qty)}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-100 font-semibold cursor-pointer"
                            >
                              Retirar Tudo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="space-y-1.5">
              <div className="font-semibold text-slate-200">Consumíveis</div>
              {Object.entries(vault.consumables).filter(([, qty]) => qty > 0).length === 0 ? (
                <div className="text-slate-500 italic">Nenhum consumível no cofre.</div>
              ) : (
                Object.entries(vault.consumables)
                  .filter(([, qty]) => qty > 0)
                  .map(([id, qty]) => {
                    const def = CONSUMABLES_BY_ID[id];
                    if (!def) return null;
                    const rarity = def.rarity ?? 'comum';
                    return (
                      <div key={id} className="bg-slate-900/65 border border-slate-800 rounded-xl p-2.5">
                        <div className="flex items-start gap-2.5">
                          <EquipmentSprite category="consumable" itemId={id} size={32} />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <span className="font-semibold text-white">{def.name}</span>
                              <TechCategoryBadge
                                category={def.factionStyle}
                                activeCategory={bonuses.activeTechCategory}
                                bonusText="+35%"
                                compact
                              />
                              <RarityBadge rarity={rarity} />
                              <span className="font-mono-tabular text-cyan-200">({qty})</span>
                            </div>
                            <div className="text-[11px] text-slate-300 leading-snug mt-1">{def.description}</div>
                            <div className="text-[10px] text-amber-200/90 mt-1">
                              {qty * FACTION_VAULT_FEE_PER_ITEM} créditos por ciclo
                            </div>
                            <div className="flex flex-wrap gap-1 justify-end mt-1.5">
                              <button
                                type="button"
                                onClick={() => onUseVaultConsumable(id)}
                                className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold cursor-pointer"
                              >
                                Usar
                              </button>
                              <button
                                type="button"
                                disabled={cargoFree <= 0}
                                onClick={() => onWithdrawConsumable(id, 1)}
                                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-100 font-semibold cursor-pointer"
                              >
                                Retirar
                              </button>
                              {qty > 1 && (
                                <button
                                  type="button"
                                  disabled={cargoFree <= 0}
                                  onClick={() => onWithdrawConsumable(id, qty)}
                                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-100 font-semibold cursor-pointer"
                                >
                                  Retirar Tudo
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
