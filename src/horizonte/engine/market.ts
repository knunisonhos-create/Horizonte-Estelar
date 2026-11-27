/** Preço de mercado comparado ao valor de tabela. */
import type { Rarity } from '../types/game';

export type SupplyBand = 'local' | 'sistema' | 'ausente';

export interface PlanetDeposits {
  id: string;
  deposits: Array<{ resourceId: string; remaining?: number }>;
}

/** Onde o recurso existe em relação ao planeta em que a troca acontece. */
export function resourceSupplyBand(
  resourceId: string,
  planetId: string | null,
  planets: PlanetDeposits[]
): SupplyBand {
  if (!planetId) return 'sistema';
  const here = planets.find((planet) => planet.id === planetId);
  if (here?.deposits.some((deposit) => deposit.resourceId === resourceId && (deposit.remaining ?? 1) > 0)) {
    return 'local';
  }
  if (
    planets.some((planet) =>
      planet.deposits.some((deposit) => deposit.resourceId === resourceId && (deposit.remaining ?? 1) > 0)
    )
  ) {
    return 'sistema';
  }
  return 'ausente';
}

/** Quantidade base conforme a raridade do recurso (comércio e extração). */
export function baseMarketStockForRarity(rarity: Rarity): number {
  switch (rarity) {
    case 'lendário':
      return 1;
    case 'épico':
      return 3;
    case 'raro':
      return 7;
    case 'incomum':
      return 15;
    case 'comum':
      return 30;
    default:
      return 1;
  }
}

/**
 * Estoque máximo de compra no planeta:
 * - Planeta produz o recurso ('local'): 3x
 * - Sistema solar produz o recurso ('sistema'): 2x
 * - Caso contrário ('ausente'): 1x
 */
export function planetResourceMaxStock(rarity: Rarity, band: SupplyBand): number {
  const base = baseMarketStockForRarity(rarity);
  if (band === 'local') return base * 3;
  if (band === 'sistema') return base * 2;
  return base;
}

export function planetResourceRemainingStock(
  resourceId: string,
  rarity: Rarity,
  planetId: string | null,
  planets: PlanetDeposits[],
  alreadyPurchased: number
): number {
  const band = resourceSupplyBand(resourceId, planetId, planets);
  const maxStock = planetResourceMaxStock(rarity, band);
  return Math.max(0, maxStock - Math.max(0, alreadyPurchased));
}

export function consumableStockKey(consumableId: string): string {
  return `consumable:${consumableId}`;
}

export function equipmentStockKey(
  category: 'weapon' | 'shield' | 'jumpDrive' | 'extractor' | 'utility' | 'suit',
  itemId: string
): string {
  return `equip:${category}:${itemId}`;
}

export function hullStockKey(hullId: string): string {
  return `hull:${hullId}`;
}

export function blueprintStockKey(blueprintId: string): string {
  return `blueprint:${blueprintId}`;
}

export function planetConsumableMaxStock(rarity: Rarity, planetTech: number): number {
  const techBonus = planetTech >= 4 ? 1.5 : 1;
  switch (rarity) {
    case 'lendário':
      return 1;
    case 'épico':
      return 3;
    case 'raro':
      return Math.round(4 * techBonus);
    case 'incomum':
      return Math.round(7 * techBonus);
    case 'comum':
    default:
      return Math.round(12 * techBonus);
  }
}

export function planetConsumableRemainingStock(
  rarity: Rarity,
  planetTech: number,
  alreadyPurchased: number
): number {
  const maxStock = planetConsumableMaxStock(rarity, planetTech);
  return Math.max(0, maxStock - Math.max(0, alreadyPurchased));
}

export function planetEquipmentMaxStock(
  rarity: Rarity,
  planetTech: number,
  isFactionMatch: boolean
): number {
  const base =
    rarity === 'lendário'
      ? 1
      : rarity === 'épico'
      ? 1
      : rarity === 'raro'
      ? 2
      : rarity === 'incomum'
      ? 3
      : 4;
  if (rarity !== 'lendário' && (isFactionMatch || planetTech >= 5)) {
    return base + 1;
  }
  return base;
}

export function planetEquipmentRemainingStock(
  rarity: Rarity,
  planetTech: number,
  isFactionMatch: boolean,
  alreadyPurchased: number
): number {
  const maxStock = planetEquipmentMaxStock(rarity, planetTech, isFactionMatch);
  return Math.max(0, maxStock - Math.max(0, alreadyPurchased));
}

export function planetHullMaxStock(rarity: Rarity): number {
  switch (rarity) {
    case 'lendário':
    case 'épico':
      return 1;
    case 'raro':
    case 'incomum':
      return 2;
    case 'comum':
    default:
      return 3;
  }
}

export function planetHullRemainingStock(rarity: Rarity, alreadyPurchased: number): number {
  return Math.max(0, planetHullMaxStock(rarity) - Math.max(0, alreadyPurchased));
}

export function planetBlueprintRemainingStock(alreadyPurchased: number): number {
  return Math.max(0, 1 - Math.max(0, alreadyPurchased));
}

/** Local −15%, importado de outro mundo do sistema 0% (tabela), ausente +25%. */
export function supplyFactor(band: SupplyBand): number {
  if (band === 'local') return 0.85;
  if (band === 'sistema') return 1.0;
  return 1.25;
}

/**
 * A partir da primeira unidade, cada bloco de 10 unidades já vendidas
 * naquele planeta deixa o pagamento 2% mais baixo.
 */
export function saturationFactor(unitsAlreadySold: number): number {
  const steps = Math.floor(Math.max(0, unitsAlreadySold) / 10) + 1;
  return Math.max(0.2, 1 - steps * 0.02);
}

export function tableDeltaPct(price: number, tablePrice: number): number {
  if (tablePrice <= 0) return 0;
  return Math.round(((price - tablePrice) / tablePrice) * 100);
}

export function formatTablePct(pct: number): string {
  const n = Math.round(pct);
  if (n > 0) return `+${n}%`;
  return `${n}%`;
}

export function unitBuyPrice(tablePrice: number, band: SupplyBand, personalMult: number): number {
  return Math.max(1, Math.round(tablePrice * supplyFactor(band) * personalMult));
}

export function unitSellPrice(
  tablePrice: number,
  band: SupplyBand,
  tradePriceBonus: number,
  unitsAlreadySold: number,
  saturate: boolean
): number {
  const place = tablePrice * supplyFactor(band) * (1 + Math.max(0, tradePriceBonus));
  const worn = saturate ? place * saturationFactor(unitsAlreadySold) : place;
  return Math.max(1, Math.round(worn));
}

/** Soma o pagamento unidade a unidade, porque o desconto muda a cada 10. */
export function quoteSale(
  tablePrice: number,
  band: SupplyBand,
  tradePriceBonus: number,
  unitsAlreadySold: number,
  qty: number,
  saturate: boolean
): { nextUnit: number; total: number } {
  const safeQty = Math.max(0, Math.floor(qty));
  const nextUnit = unitSellPrice(tablePrice, band, tradePriceBonus, unitsAlreadySold, saturate);
  let total = 0;
  for (let i = 0; i < safeQty; i++) {
    total += unitSellPrice(tablePrice, band, tradePriceBonus, unitsAlreadySold + i, saturate);
  }
  return { nextUnit, total };
}
