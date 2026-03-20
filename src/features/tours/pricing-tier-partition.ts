/** Matches `PricingTierForm`; kept local to avoid circular imports with `tour.validation`. */
export type PartitionPricingTier = {
  id: string;
  min_pax: number;
  max_pax: number;
  amount: number;
  currency: string;
};

/** Upper bound for the pricing scale (participants 1..max). */
export function pricingScaleMaxPax(defaultCapacity: number | undefined | null): number {
  return Math.max(1, defaultCapacity ?? 5);
}

export function sortTiersByMinPax(tiers: PartitionPricingTier[]): PartitionPricingTier[] {
  return [...tiers].sort((a, b) => a.min_pax - b.min_pax || a.max_pax - b.max_pax);
}

/** Single tier covering 1..maxPax with defaults suitable for PHP wizard. */
export function createSinglePartitionBand(
  maxPax: number,
  currency: string,
  amountMinor = 10_000,
): PartitionPricingTier {
  const cap = Math.max(1, maxPax);
  return {
    id: crypto.randomUUID(),
    min_pax: 1,
    max_pax: cap,
    amount: amountMinor,
    currency,
  };
}

/**
 * Coerce any tier list into a contiguous partition of [1, maxPax], preserving tier order
 * and extending the last tier when needed. Gaps are filled by extending the next tier
 * downward; overlaps collapse by consuming the range in first-come order.
 */
export function normalizeToContiguousPartition(
  tiers: PartitionPricingTier[],
  maxPax: number,
  fallbackCurrency: string,
): PartitionPricingTier[] {
  const cap = Math.max(1, maxPax);
  if (tiers.length === 0) {
    return [createSinglePartitionBand(cap, fallbackCurrency)];
  }
  const sorted = sortTiersByMinPax(tiers);
  const out: PartitionPricingTier[] = [];
  let cursor = 1;
  for (const t of sorted) {
    if (cursor > cap) break;
    const tierMaxClamped = Math.min(Math.max(t.max_pax, t.min_pax), cap);
    if (tierMaxClamped < cursor) continue;
    const start = cursor;
    const end = Math.min(Math.max(tierMaxClamped, start), cap);
    out.push({
      ...t,
      min_pax: start,
      max_pax: end,
      currency: t.currency || fallbackCurrency,
    });
    cursor = end + 1;
  }
  if (out.length === 0) {
    return [createSinglePartitionBand(cap, sorted[0]?.currency ?? fallbackCurrency)];
  }
  if (cursor <= cap) {
    const last = out[out.length - 1];
    out[out.length - 1] = { ...last, max_pax: cap };
  }
  return sortTiersByMinPax(out);
}

/** After pax K: left tier ends at K, right starts at K+1. */
export function splitBandAfterPax(
  tiers: PartitionPricingTier[],
  tierId: string,
  afterPax: number,
): PartitionPricingTier[] | null {
  const sorted = sortTiersByMinPax(tiers);
  const idx = sorted.findIndex((t) => t.id === tierId);
  if (idx < 0) return null;
  const t = sorted[idx];
  if (!Number.isInteger(afterPax) || afterPax < t.min_pax || afterPax >= t.max_pax) {
    return null;
  }
  const left: PartitionPricingTier = { ...t, max_pax: afterPax };
  const right: PartitionPricingTier = {
    id: crypto.randomUUID(),
    min_pax: afterPax + 1,
    max_pax: t.max_pax,
    amount: t.amount,
    currency: t.currency,
  };
  return sortTiersByMinPax([...sorted.slice(0, idx), left, right, ...sorted.slice(idx + 1)]);
}

/**
 * Move the boundary between `sorted[boundaryIndex]` and `sorted[boundaryIndex+1]` so the
 * left tier ends at `newCut` (inclusive) and the right tier starts at `newCut + 1`.
 */
export function movePartitionBoundary(
  tiers: PartitionPricingTier[],
  boundaryIndex: number,
  newCut: number,
): PartitionPricingTier[] | null {
  const sorted = sortTiersByMinPax(tiers);
  if (boundaryIndex < 0 || boundaryIndex >= sorted.length - 1) return null;
  const left = sorted[boundaryIndex];
  const right = sorted[boundaryIndex + 1];
  const minCut = left.min_pax;
  const maxCut = right.max_pax - 1;
  if (!Number.isInteger(newCut) || newCut < minCut || newCut > maxCut) return null;
  const next = [...sorted];
  next[boundaryIndex] = { ...left, max_pax: newCut };
  next[boundaryIndex + 1] = { ...right, min_pax: newCut + 1 };
  return sortTiersByMinPax(next);
}

/** Split the widest tier at roughly its midpoint; returns null if every tier is a single pax. */
export function addSplitToWidestBand(tiers: PartitionPricingTier[]): PartitionPricingTier[] | null {
  const sorted = sortTiersByMinPax(tiers);
  let bestIdx = -1;
  let bestW = 0;
  sorted.forEach((t, i) => {
    const w = t.max_pax - t.min_pax + 1;
    if (w >= 2 && w > bestW) {
      bestW = w;
      bestIdx = i;
    }
  });
  if (bestIdx < 0) return null;
  const t = sorted[bestIdx];
  const after = t.min_pax + Math.floor((t.max_pax - t.min_pax) / 2);
  return splitBandAfterPax(tiers, t.id, after);
}

/** Merge tier at sorted index with the next tier; keeps left tier's amount. */
export function mergeBandWithNext(
  tiers: PartitionPricingTier[],
  tierIndex: number,
): PartitionPricingTier[] | null {
  const sorted = sortTiersByMinPax(tiers);
  if (tierIndex < 0 || tierIndex >= sorted.length - 1) return null;
  const left = sorted[tierIndex];
  const right = sorted[tierIndex + 1];
  if (left.max_pax + 1 !== right.min_pax) return null;
  const merged: PartitionPricingTier = {
    ...left,
    max_pax: right.max_pax,
  };
  return sortTiersByMinPax([
    ...sorted.slice(0, tierIndex),
    merged,
    ...sorted.slice(tierIndex + 2),
  ]);
}

export function setAllTierCurrencies(
  tiers: PartitionPricingTier[],
  currency: string,
): PartitionPricingTier[] {
  return tiers.map((t) => ({ ...t, currency }));
}

export function updateTierAmount(
  tiers: PartitionPricingTier[],
  tierId: string,
  amountMinor: number,
): PartitionPricingTier[] {
  return tiers.map((t) => (t.id === tierId ? { ...t, amount: amountMinor } : t));
}

export function bandSlotCount(minPax: number, maxPax: number): number {
  return Math.max(0, maxPax - minPax + 1);
}

/** Width as percent of full scale 1..maxPax (for flex layouts). */
export function bandWidthPercent(
  minPax: number,
  maxPax: number,
  scaleMaxPax: number,
): number {
  const cap = Math.max(1, scaleMaxPax);
  const slots = bandSlotCount(minPax, maxPax);
  return (slots / cap) * 100;
}

export function isContiguousPartition(
  tiers: PartitionPricingTier[],
  maxPax: number,
): boolean {
  const cap = Math.max(1, maxPax);
  if (tiers.length === 0) return false;
  const sorted = sortTiersByMinPax(tiers);
  if (sorted[0].min_pax !== 1 || sorted[sorted.length - 1].max_pax !== cap) return false;
  for (let i = 0; i < sorted.length; i++) {
    const b = sorted[i];
    if (b.min_pax > b.max_pax) return false;
    if (i > 0 && b.min_pax !== sorted[i - 1].max_pax + 1) return false;
  }
  return true;
}

/** Slot counts per part when dividing `total` participants into `parts` tiers as evenly as possible. */
export function evenSlotPartitionSizes(total: number, parts: number): number[] {
  const cap = Math.max(1, total);
  const k = Math.max(1, Math.floor(parts));
  const base = Math.floor(cap / k);
  const rem = cap % k;
  return Array.from({ length: k }, (_, i) => base + (i < rem ? 1 : 0));
}

/** One tier covering 1..maxPax; amount and currency from the first tier when sorted by min_pax. */
export function resetToSinglePartitionBand(
  tiers: PartitionPricingTier[],
  maxPax: number,
): PartitionPricingTier[] | null {
  if (tiers.length === 0) return null;
  const sorted = sortTiersByMinPax(tiers);
  const cap = Math.max(1, maxPax);
  const first = sorted[0];
  return [
    {
      id: first.id,
      min_pax: 1,
      max_pax: cap,
      amount: first.amount,
      currency: first.currency,
    },
  ];
}

function splitSingleIntoThreeEvenBands(
  tier: PartitionPricingTier,
  maxPax: number,
): PartitionPricingTier[] {
  const sizes = evenSlotPartitionSizes(maxPax, 3);
  const out: PartitionPricingTier[] = [];
  let start = 1;
  for (let i = 0; i < 3; i++) {
    const len = sizes[i];
    out.push({
      id: i === 0 ? tier.id : crypto.randomUUID(),
      min_pax: start,
      max_pax: start + len - 1,
      amount: tier.amount,
      currency: tier.currency,
    });
    start += len;
  }
  return sortTiersByMinPax(out);
}

/**
 * Evenly redistribute boundaries across existing tiers (same count, same tier order, same amounts).
 * When there is only one tier and maxPax >= 3, splits into three as-even-as-possible tiers with the same amount each.
 */
export function rebalancePartitionsEvenly(
  tiers: PartitionPricingTier[],
  maxPax: number,
): PartitionPricingTier[] | null {
  const sorted = sortTiersByMinPax(tiers);
  const cap = Math.max(1, maxPax);
  if (sorted.length === 0) return null;
  if (sorted.length > cap) return null;

  if (sorted.length === 1) {
    if (cap < 3) return null;
    return splitSingleIntoThreeEvenBands(sorted[0], cap);
  }

  const sizes = evenSlotPartitionSizes(cap, sorted.length);
  const out: PartitionPricingTier[] = [];
  let start = 1;
  for (let i = 0; i < sorted.length; i++) {
    const len = sizes[i];
    const t = sorted[i];
    out.push({
      ...t,
      min_pax: start,
      max_pax: start + len - 1,
    });
    start += len;
  }
  return sortTiersByMinPax(out);
}
