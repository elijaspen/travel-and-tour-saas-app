"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type {
  BlackoutDateForm,
  CreateTourWizardState,
  PricingTierForm,
} from "@/modules/tours/tour.types";
import {
  CURRENCY_SELECT_OPTIONS,
  DEFAULT_PRICING_CURRENCY,
  formatPriceFromMinorUnits,
  getCurrencySymbol,
  parseMoneyInputToCents,
} from "@/lib/geo/currencies";
import { cn } from "@/lib/utils";

type PricingPublishStepProps = {
  data: CreateTourWizardState;
  onUpdate: (updates: Partial<CreateTourWizardState>) => void;
};

const defaultTier = (): PricingTierForm => ({
  id: crypto.randomUUID(),
  min_pax: 1,
  max_pax: 5,
  amount: 10_000,
  currency: DEFAULT_PRICING_CURRENCY,
});

const defaultBlackout = (): BlackoutDateForm => ({
  id: crypto.randomUUID(),
  start_date: "",
  end_date: "",
  reason: "",
});

export function PricingPublishStep({ data, onUpdate }: PricingPublishStepProps) {
  const tiers = data.pricing_tiers ?? [];
  const blackouts = data.blackout_dates ?? [];
  const [formTier, setFormTier] = useState<PricingTierForm | null>(null);
  const [amountInput, setAmountInput] = useState("");
  const [amountError, setAmountError] = useState<string | null>(null);
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!formTier) return;
    /* eslint-disable react-hooks/set-state-in-effect -- local amount string tracks tier when switching rows */
    setAmountInput((formTier.amount / 100).toFixed(2));
    setAmountError(null);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [formTier?.id]); // eslint-disable-line react-hooks/exhaustive-deps -- sync amount input only when tier id changes

  const priceSymbol = formTier ? getCurrencySymbol(formTier.currency) : "";

  const commitAmountFromField = () => {
    const cents = parseMoneyInputToCents(amountInput);
    if (cents === null) {
      setAmountError("Enter a valid price (e.g. 100.10)");
      return;
    }
    setAmountError(null);
    setFormTier((prev) => (prev ? { ...prev, amount: cents } : null));
    setAmountInput((cents / 100).toFixed(2));
  };

  const addTier = () => {
    const newTier = defaultTier();
    onUpdate({ pricing_tiers: [...tiers, newTier] });
    setFormTier(newTier);
  };

  const editTier = (tier: PricingTierForm) => setFormTier({ ...tier });

  const saveTier = () => {
    if (!formTier) return;
    const cents = parseMoneyInputToCents(amountInput);
    if (cents === null) {
      setAmountError("Enter a valid price (e.g. 100.10)");
      return;
    }
    setAmountError(null);
    const normalized = { ...formTier, amount: cents };
    const idx = tiers.findIndex((t) => t.id === normalized.id);
    const next =
      idx >= 0
        ? tiers.map((t) => (t.id === normalized.id ? normalized : t))
        : [...tiers, normalized];
    onUpdate({ pricing_tiers: next });
    setFormTier(null);
  };

  const removeTier = (id: string) => {
    onUpdate({ pricing_tiers: tiers.filter((t) => t.id !== id) });
    if (formTier?.id === id) setFormTier(null);
  };

  const addBlackout = () => {
    const b: BlackoutDateForm = {
      ...defaultBlackout(),
      start_date,
      end_date,
      reason,
    };
    onUpdate({ blackout_dates: [...blackouts, b] });
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  const removeBlackout = (id: string) => {
    onUpdate({ blackout_dates: blackouts.filter((b) => b.id !== id) });
  };

  return (
    <div className="w-full space-y-10">
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">Pricing</h2>
          <p className="text-sm text-muted-foreground">
            Set tiered pricing based on group size. At least one tier is required.
          </p>
        </div>

        {formTier && (
          <div className="min-w-0">
            <Card className="border border-border rounded-lg overflow-hidden p-4 sm:p-6">
              <div className="space-y-4 min-w-0">
                <div>
                  <h4 className="font-medium">Add / Edit tier</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Price per person in major units; stored as centavos. Default currency is PHP.
                  </p>
                </div>
                <div className="space-y-2 min-w-0">
                  <Label htmlFor="pub-tier-currency">Currency</Label>
                  <Select
                    value={formTier.currency}
                    onValueChange={(v) => setFormTier({ ...formTier, currency: v })}
                    options={[...CURRENCY_SELECT_OPTIONS]}
                    searchable
                    searchPlaceholder="Search code or name…"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 min-w-0 sm:gap-4">
                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="pub-tier-min">Min pax</Label>
                    <Input
                      id="pub-tier-min"
                      type="number"
                      min={1}
                      className="min-w-0"
                      value={formTier.min_pax}
                      onChange={(e) =>
                        setFormTier({ ...formTier, min_pax: Number(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="pub-tier-max">Max pax</Label>
                    <Input
                      id="pub-tier-max"
                      type="number"
                      min={1}
                      className="min-w-0"
                      value={formTier.max_pax}
                      onChange={(e) =>
                        setFormTier({ ...formTier, max_pax: Number(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2 min-w-0">
                  <Label htmlFor="pub-tier-amount">Price per person</Label>
                  <div
                    className={cn(
                      "flex min-w-0 items-center gap-2 rounded-md border border-input bg-background px-3 shadow-xs focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
                      amountError &&
                        "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
                    )}
                  >
                    <span
                      className="shrink-0 text-sm font-medium text-muted-foreground tabular-nums"
                      aria-hidden
                    >
                      {priceSymbol}
                    </span>
                    <Input
                      id="pub-tier-amount"
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="100.10"
                      className={cn(
                        "min-w-0 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 font-medium tabular-nums",
                        amountError && "text-destructive",
                      )}
                      value={amountInput}
                      onChange={(e) => {
                        setAmountInput(e.target.value);
                        setAmountError(null);
                      }}
                      onBlur={commitAmountFromField}
                    />
                  </div>
                  {amountError ? (
                    <p className="text-xs text-destructive">{amountError}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Use decimals like 100.10 — we convert to centavos when you save.
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={saveTier}>Save tier</Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setFormTier(null);
                      setAmountError(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        <Button variant="outline" className="w-full" onClick={addTier}>
          <Plus className="w-4 h-4 mr-2" />
          Add pricing tier
        </Button>

        {tiers.length > 0 && (
          <div className="space-y-3 min-w-0">
            <h4 className="text-base font-medium">Active tiers</h4>
            <div className="space-y-2">
              {tiers.map((tier) => (
                <Card
                  key={tier.id}
                  className="overflow-hidden bg-secondary/50 border border-border rounded-lg p-4"
                >
                  <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                    <div className="flex min-w-0 flex-1 flex-col gap-2 min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-4">
                      <span className="inline-flex w-fit shrink-0 items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                        {tier.min_pax}–{tier.max_pax} pax
                      </span>
                      <div className="min-w-0">
                        <div className="break-words text-lg font-semibold">
                          {formatPriceFromMinorUnits(tier.amount, tier.currency)}
                        </div>
                        <div className="break-words text-sm text-muted-foreground">
                          {tier.currency} · per person
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => editTier(tier)}
                        aria-label="Edit tier"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-destructive"
                        onClick={() => removeTier(tier.id)}
                        aria-label="Remove tier"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <div className="space-y-1">
          <h3 className="text-base font-medium">Blackout dates</h3>
          <p className="text-sm text-muted-foreground">
            Block dates when the tour is unavailable.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="date"
                className="pl-10"
                value={start_date}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>End</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="date"
                className="pl-10"
                value={end_date}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Reason (optional)</Label>
          <Textarea
            placeholder="e.g., Holiday season, maintenance"
            className="min-h-[80px] resize-none"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <Button variant="secondary" onClick={addBlackout}>
          <Plus className="w-4 h-4 mr-2" />
          Add blackout period
        </Button>
        {blackouts.length > 0 && (
          <div className="space-y-2">
            {blackouts.map((b) => (
              <Card key={b.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">
                      {b.start_date} – {b.end_date}
                    </div>
                    {b.reason && (
                      <div className="text-sm text-muted-foreground">{b.reason}</div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-destructive"
                    onClick={() => removeBlackout(b.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <h3 className="text-base font-medium">Publish</h3>
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/60">
          <div>
            <div className="text-sm font-medium">Make tour active</div>
            <div className="text-xs text-muted-foreground">
              Visible and bookable by customers
            </div>
          </div>
          <Switch
            checked={data.is_active ?? true}
            onCheckedChange={(v) => onUpdate({ is_active: v })}
            className="data-[state=checked]:bg-primary"
          />
        </div>
        <Card className="bg-accent/50 border border-border rounded-lg p-4">
          <p className="text-sm text-accent-foreground">
            Once published, your tour will be visible and available for booking. You can change this
            anytime from the tour dashboard.
          </p>
        </Card>
      </div>
    </div>
  );
}
