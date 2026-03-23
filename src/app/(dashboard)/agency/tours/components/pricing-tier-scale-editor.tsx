"use client";

import React from "react";
import { ChevronDown, Info, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { PricingTierForm } from "@/features/tours/tour.types";
import {
  addSplitToWidestBand,
  bandSlotCount,
  mergeBandWithNext,
  movePartitionBoundary,
  rebalancePartitionsEvenly,
  resetToSinglePartitionBand,
  sortTiersByMinPax,
  updateTierAmount,
} from "@/features/tours/utils/pricing-tier-partition";
import {
  formatPriceFromMinorUnits,
  getCurrencySymbol,
  parseMoneyInputToCents,
} from "@/lib/geo/currencies";

type Props = {
  maxPax: number;
  tiers: PricingTierForm[];
  sharedCurrency: string;
  onTiersChange: (tiers: PricingTierForm[]) => void;
};

function canAddAnySplit(sorted: PricingTierForm[]): boolean {
  return sorted.some((t) => t.max_pax > t.min_pax);
}

function canRebalanceEvenly(sorted: PricingTierForm[], maxPax: number): boolean {
  const cap = Math.max(1, maxPax);
  if (sorted.length === 0) return false;
  if (sorted.length > cap) return false;
  if (sorted.length === 1 && cap < 3) return false;
  return true;
}

function canResetToSingle(sorted: PricingTierForm[], maxPax: number): boolean {
  if (sorted.length === 0) return false;
  if (
    sorted.length === 1 &&
    sorted[0].min_pax === 1 &&
    sorted[0].max_pax === maxPax
  ) {
    return false;
  }
  return true;
}

/** Left edge of participant slot `p` (1-based) as fraction of track [0,1]. */
function slotLeftFrac(p: number, maxPax: number): number {
  const cap = Math.max(1, maxPax);
  return Math.max(0, Math.min(1, (p - 1) / cap));
}

/**
 * X-position of the boundary immediately after participant `cut` (left tier ends at cut).
 * Aligns with the right edge of slot `cut`: cut/cap of track width from the left.
 */
function splitBoundaryFrac(cut: number, maxPax: number): number {
  const cap = Math.max(1, maxPax);
  return Math.max(0, Math.min(1, cut / cap));
}

function splitBoundaryPct(cut: number, maxPax: number): number {
  return splitBoundaryFrac(cut, maxPax) * 100;
}

export function PricingTierScaleEditor({
  maxPax,
  tiers,
  sharedCurrency,
  onTiersChange,
}: Props) {
  const sorted = React.useMemo(() => sortTiersByMinPax(tiers), [tiers]);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const cap = Math.max(1, maxPax);
  const tiersRef = React.useRef(tiers);

  const [activeTier, setActiveTier] = React.useState<PricingTierForm | null>(null);
  const [amountInput, setAmountInput] = React.useState("");
  const [amountError, setAmountError] = React.useState<string | null>(null);

  const [tierDetailsOpen, setTierDetailsOpen] = React.useState(true);
  const [amountDraftById, setAmountDraftById] = React.useState<
    Record<string, string>
  >({});
  const [rowErrors, setRowErrors] = React.useState<Record<string, string>>({});

  const dragBoundaryIdx = React.useRef<number | null>(null);
  const [splitDragIndex, setSplitDragIndex] = React.useState<number | null>(null);

  const tierSignature = React.useMemo(
    () => sorted.map((t) => `${t.id}:${t.amount}:${t.min_pax}-${t.max_pax}`).join("|"),
    [sorted],
  );

  React.useEffect(() => {
    tiersRef.current = tiers;
  }, [tiers]);

  React.useEffect(() => {
    setAmountDraftById(
      Object.fromEntries(
        sorted.map((t) => [t.id, (t.amount >= 0 ? t.amount / 100 : 0).toFixed(2)]),
      ),
    );
    setRowErrors({});
  }, [tierSignature, sorted]);

  React.useEffect(() => {
    if (!activeTier) return;
    setAmountInput((activeTier.amount / 100).toFixed(2));
    setAmountError(null);
  }, [activeTier?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const priceSymbol = getCurrencySymbol(sharedCurrency);

  const commitPrice = () => {
    if (!activeTier) return;
    const cents = parseMoneyInputToCents(amountInput);
    if (cents === null) {
      setAmountError("Enter a valid price (e.g. 100.10)");
      return;
    }
    setAmountError(null);
    onTiersChange(updateTierAmount(tiers, activeTier.id, cents));
    setActiveTier(null);
  };

  const commitInlineAmount = (tierId: string, raw: string) => {
    const cents = parseMoneyInputToCents(raw);
    if (cents === null) {
      setRowErrors((e) => ({
        ...e,
        [tierId]: "Enter a valid price",
      }));
      const t = sorted.find((x) => x.id === tierId);
      if (t) {
        setAmountDraftById((d) => ({
          ...d,
          [tierId]: (t.amount / 100).toFixed(2),
        }));
      }
      return;
    }
    setRowErrors((e) => {
      const next = { ...e };
      delete next[tierId];
      return next;
    });
    onTiersChange(updateTierAmount(tiers, tierId, cents));
  };

  const handleAddSplit = () => {
    const next = addSplitToWidestBand(tiers);
    if (next) onTiersChange(next);
  };

  const handleAutoSplitEvenly = () => {
    const next = rebalancePartitionsEvenly(tiers, maxPax);
    if (next) onTiersChange(next);
  };

  const handleResetSingleTier = () => {
    const next = resetToSinglePartitionBand(tiers, maxPax);
    if (next) onTiersChange(next);
  };

  const removeSplit = (boundaryIndex: number) => {
    const next = mergeBandWithNext(tiers, boundaryIndex);
    if (next) onTiersChange(next);
  };

  const applyBoundaryFromClientX = React.useCallback(
    (clientX: number, boundaryIndex: number) => {
      const el = trackRef.current;
      if (!el || maxPax < 2) return;
      const latest = tiersRef.current;
      const rect = el.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const sortedNow = sortTiersByMinPax(latest);
      if (boundaryIndex < 0 || boundaryIndex >= sortedNow.length - 1) return;
      const left = sortedNow[boundaryIndex];
      const right = sortedNow[boundaryIndex + 1];
      const minCut = left.min_pax;
      const maxCut = right.max_pax - 1;
      const cutApprox = t * maxPax;
      const cut = Math.min(maxCut, Math.max(minCut, Math.round(cutApprox)));
      const next = movePartitionBoundary(latest, boundaryIndex, cut);
      if (next) onTiersChange(next);
    },
    [maxPax, onTiersChange],
  );

  React.useEffect(() => {
    const onUp = () => {
      dragBoundaryIdx.current = null;
      setSplitDragIndex(null);
    };
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const onBoundaryPointerMove = React.useCallback(
    (e: PointerEvent) => {
      const idx = dragBoundaryIdx.current;
      if (idx == null) return;
      applyBoundaryFromClientX(e.clientX, idx);
    },
    [applyBoundaryFromClientX],
  );

  React.useEffect(() => {
    const onMove = (e: PointerEvent) => onBoundaryPointerMove(e);
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [onBoundaryPointerMove]);

  const startBoundaryDrag = (boundaryIndex: number, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragBoundaryIdx.current = boundaryIndex;
    setSplitDragIndex(boundaryIndex);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    applyBoundaryFromClientX(e.clientX, boundaryIndex);
  };

  const endBoundaryDrag = (e: React.PointerEvent) => {
    dragBoundaryIdx.current = null;
    setSplitDragIndex(null);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const autoEvenDisabled = !canRebalanceEvenly(sorted, maxPax);
  const resetDisabled = !canResetToSingle(sorted, maxPax);

  return (
    <div className="min-w-0 space-y-8">
      <Card className="border-border/80 shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1 space-y-3">
              <div>
                <p className="text-sm font-semibold leading-tight text-foreground">
                  Group size scale
                </p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  Each column is one participant slot. Splits sit on the edge between two
                  counts.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground sm:text-sm">
                <li className="flex gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80"
                    aria-hidden
                  />
                  <span>
                    <span className="font-medium text-foreground">Drag</span> the thumb on
                    a line to move that split.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80"
                    aria-hidden
                  />
                  <span>
                    <span className="font-medium text-foreground">Hover</span> a split to
                    remove it (merges with the tier on the right).
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80"
                    aria-hidden
                  />
                  <span>
                    <span className="font-medium text-foreground">Tap</span> a tier to
                    open the price editor.
                  </span>
                </li>
              </ul>
              <div
                className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5"
                role="note"
              >
                <Info
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden
                />
                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  <span className="font-medium text-foreground">Capacity on this scale:</span>{" "}
                  <span className="tabular-nums font-semibold text-foreground">{maxPax}</span>{" "}
                  participants (from <span className="text-foreground">Location</span> default
                  capacity). Change it in step 2 if you need a different maximum.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-10 shrink-0 gap-1.5 self-start border-border sm:mt-0.5"
              disabled={!canAddAnySplit(sorted)}
              onClick={handleAddSplit}
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add split
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-border/80 bg-muted/20 p-1 shadow-sm sm:p-1.5">
        <div className="relative w-full min-w-0">
          <div
            ref={trackRef}
            className="relative isolate h-40 w-full min-w-0 overflow-visible rounded-lg border border-border bg-card shadow-inner"
          >
            {sorted.map((tier, index) => {
              const leftPct = slotLeftFrac(tier.min_pax, maxPax) * 100;
              const widthPct =
                (bandSlotCount(tier.min_pax, tier.max_pax) / maxPax) * 100;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setActiveTier(tier)}
                  className={cn(
                    "absolute bottom-0 top-0 z-0 flex min-w-[2.5rem] flex-col items-center justify-center overflow-hidden px-1 py-2 text-center transition-colors sm:px-2",
                    "focus-visible:z-[6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    index % 2 === 0
                      ? "bg-muted/35 hover:bg-muted/45"
                      : "bg-accent/25 hover:bg-accent/35",
                  )}
                  style={{
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                  }}
                  aria-label={`Tier ${tier.min_pax} to ${tier.max_pax} participants, ${formatPriceFromMinorUnits(tier.amount, sharedCurrency)} per person. Click to edit price.`}
                >
                  <span className="text-xs font-medium text-muted-foreground">
                    {tier.min_pax}–{tier.max_pax} people
                  </span>
                  <span className="mt-1 line-clamp-2 text-lg font-semibold tabular-nums leading-tight text-foreground sm:text-xl">
                    {formatPriceFromMinorUnits(tier.amount, sharedCurrency)}
                  </span>
                  <span className="mt-1 text-[11px] text-muted-foreground">
                    per person
                  </span>
                </button>
              );
            })}

            {sorted.slice(0, -1).map((tier, boundaryIndex) => {
              const cut = tier.max_pax;
              const pct = splitBoundaryPct(cut, maxPax);
              const dragging = splitDragIndex === boundaryIndex;
              return (
                <div
                  key={`split-line-${boundaryIndex}`}
                  className="pointer-events-none absolute inset-y-0 z-[5] w-0 -translate-x-1/2"
                  style={{ left: `${pct}%` }}
                  aria-hidden
                >
                  <div
                    className={cn(
                      "absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-primary/45",
                      dragging && "w-0.5 bg-primary",
                    )}
                  />
                </div>
              );
            })}

            {sorted.slice(0, -1).map((tier, boundaryIndex) => {
              const cut = tier.max_pax;
              const pct = splitBoundaryPct(cut, maxPax);
              const dragging = splitDragIndex === boundaryIndex;
              return (
                <div
                  key={`split-${boundaryIndex}`}
                  className="pointer-events-none absolute bottom-0 top-0 z-[15] w-0 -translate-x-1/2"
                  style={{ left: `${pct}%` }}
                >
                  <div className="group/split pointer-events-auto relative h-full w-11 -translate-x-1/2 left-1/2 sm:w-12">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      title="Remove split"
                      className={cn(
                        "absolute left-1/2 top-2 h-6 w-6 -translate-x-1/2 rounded-full shadow-sm",
                        "opacity-0 transition-opacity group-hover/split:opacity-100 group-focus-within/split:opacity-100",
                      )}
                      aria-label={`Remove split between ${cut} and ${cut + 1} participants`}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSplit(boundaryIndex);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    <button
                      type="button"
                      title={`Split after ${cut}, before ${cut + 1}`}
                      aria-label={`Move split after participant ${cut} (before ${cut + 1}).`}
                      aria-valuemin={sorted[boundaryIndex]?.min_pax}
                      aria-valuemax={sorted[boundaryIndex + 1]?.max_pax - 1}
                      aria-valuenow={cut}
                      role="slider"
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => startBoundaryDrag(boundaryIndex, e)}
                      onPointerUp={endBoundaryDrag}
                      onPointerCancel={endBoundaryDrag}
                      className={cn(
                        "absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-grab bg-transparent touch-none",
                        "active:cursor-grabbing",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none absolute left-1/2 top-1/2 flex h-7 w-2 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary shadow-sm ring-2 ring-background dark:ring-card",
                          dragging && "ring-2 ring-primary/35 ring-offset-2 ring-offset-background",
                        )}
                        aria-hidden
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="mt-2 grid w-full min-w-0 rounded-b-md bg-muted/15 px-0.5 py-1.5"
            style={{
              gridTemplateColumns: `repeat(${cap}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: cap }, (_, i) => {
              const n = i + 1;
              const emphasize = n === 1 || n === maxPax;
              const atSplit = sorted.some(
                (t, idx) => idx < sorted.length - 1 && t.max_pax === n,
              );
              return (
                <div
                  key={n}
                  className="flex min-w-0 flex-col items-center gap-0.5 border-r border-border/30 last:border-r-0"
                >
                  <div
                    className={cn(
                      "h-2 w-px shrink-0 rounded-full",
                      atSplit ? "bg-primary/90" : "bg-muted-foreground/25",
                    )}
                  />
                  <span
                    className={cn(
                      "w-full min-w-0 truncate text-center tabular-nums leading-none",
                      cap > 28 ? "text-[8px]" : cap > 18 ? "text-[9px]" : "text-[10px] sm:text-xs",
                      emphasize
                        ? "font-semibold text-foreground"
                        : atSplit
                          ? "font-medium text-primary"
                          : "text-muted-foreground",
                    )}
                  >
                    {n}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <Button
          type="button"
          variant="outline"
          className="h-10 border-border"
          disabled={autoEvenDisabled}
          onClick={handleAutoSplitEvenly}
        >
          Auto-split evenly
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10 border-border"
          disabled={resetDisabled}
          onClick={handleResetSingleTier}
        >
          Reset to single tier
        </Button>
      </div>

      <Collapsible open={tierDetailsOpen} onOpenChange={setTierDetailsOpen}>
        <div className="flex items-center justify-between gap-2">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex items-center gap-2 text-left text-lg font-semibold text-foreground",
                "rounded-md outline-none hover:text-foreground/90",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
            >
              Tier details
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
                  tierDetailsOpen && "rotate-180",
                )}
              />
            </button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="mt-6 space-y-4 data-[state=closed]:animate-out">
          {sorted.map((tier, tierIndex) => (
            <Card key={tier.id} className="border-border bg-card shadow-sm">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 items-start gap-4 min-[480px]:grid-cols-[1fr_1fr] min-[720px]:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Tier {tierIndex + 1}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {tier.min_pax}–{tier.max_pax} participants
                    </p>
                  </div>
                  <div className="min-w-0 space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Price per person
                    </Label>
                    <div
                      className={cn(
                        "flex min-w-0 items-center gap-2 rounded-lg border border-input bg-background px-3 py-1 shadow-xs",
                        rowErrors[tier.id] && "border-destructive",
                      )}
                    >
                      <span className="shrink-0 text-sm font-medium text-muted-foreground">
                        {priceSymbol}
                      </span>
                      <Input
                        type="text"
                        inputMode="decimal"
                        aria-invalid={!!rowErrors[tier.id]}
                        className="h-9 min-w-0 border-0 px-0 shadow-none focus-visible:ring-0 font-medium tabular-nums"
                        value={amountDraftById[tier.id] ?? ""}
                        onChange={(e) => {
                          setAmountDraftById((d) => ({
                            ...d,
                            [tier.id]: e.target.value,
                          }));
                          setRowErrors((err) => {
                            const next = { ...err };
                            delete next[tier.id];
                            return next;
                          });
                        }}
                        onBlur={() =>
                          commitInlineAmount(
                            tier.id,
                            amountDraftById[tier.id] ?? "",
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.currentTarget.blur();
                          }
                        }}
                      />
                    </div>
                    {rowErrors[tier.id] ? (
                      <p className="text-xs text-destructive">{rowErrors[tier.id]}</p>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Card className="overflow-hidden border-border/80 shadow-sm">
        <CardHeader className="border-b border-border/60 bg-muted/25 px-4 py-4 sm:px-6 sm:py-5">
          <CardTitle className="text-base font-semibold sm:text-lg">
            Pricing summary
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {sorted.length} price tier{sorted.length === 1 ? "" : "s"}, charged per person
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border/60">
            {sorted.map((tier) => (
              <li key={tier.id}>
                <div className="flex flex-col gap-1 px-4 py-3.5 transition-colors hover:bg-muted/15 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      <span className="tabular-nums">
                        {tier.min_pax}–{tier.max_pax}
                      </span>{" "}
                      <span className="font-normal text-muted-foreground">
                        participants
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">Per person rate</p>
                  </div>
                  <div className="shrink-0 text-left sm:text-right">
                    <p className="text-base font-semibold tabular-nums text-foreground sm:text-lg">
                      {formatPriceFromMinorUnits(tier.amount, sharedCurrency)}
                    </p>
                    <p className="text-xs text-muted-foreground">each</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Dialog open={!!activeTier} onOpenChange={(open) => !open && setActiveTier(null)}>
        <DialogContent className="sm:max-w-[400px]" showCloseButton>
          {activeTier && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {activeTier.min_pax}–{activeTier.max_pax} participants
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Price per person for this tier. Splits are adjusted on the scale above.
                </p>
              </DialogHeader>
              <div className="space-y-2 py-2">
                <Label htmlFor="scale-tier-amount">Amount</Label>
                <div
                  className={cn(
                    "flex min-w-0 items-center gap-2 rounded-lg border border-input bg-background px-3 shadow-xs",
                    amountError && "border-destructive",
                  )}
                >
                  <span className="shrink-0 text-sm font-medium text-muted-foreground">
                    {priceSymbol}
                  </span>
                  <Input
                    id="scale-tier-amount"
                    type="text"
                    inputMode="decimal"
                    placeholder="100.10"
                    className="min-w-0 border-0 shadow-none focus-visible:ring-0 font-medium tabular-nums"
                    value={amountInput}
                    onChange={(e) => {
                      setAmountInput(e.target.value);
                      setAmountError(null);
                    }}
                  />
                </div>
                {amountError && <p className="text-xs text-destructive">{amountError}</p>}
              </div>
              <DialogFooter className="gap-2 sm:justify-end">
                <Button variant="outline" onClick={() => setActiveTier(null)}>
                  Cancel
                </Button>
                <Button onClick={commitPrice}>Save</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
