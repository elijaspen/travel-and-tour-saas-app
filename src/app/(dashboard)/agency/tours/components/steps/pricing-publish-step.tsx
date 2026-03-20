"use client";

import React from "react";
import { Plus, Pencil, Trash2, Calendar, DollarSign } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, type SelectOption } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import type {
  CreateTourPayload,
  PricingTierPayload,
  BlackoutDatePayload,
} from "@/features/tours/tour.validation";

const CURRENCY_OPTIONS: SelectOption[] = [
  { value: "USD", label: "USD" },
  { value: "PHP", label: "PHP" },
  { value: "EUR", label: "EUR" },
];

type PricingPublishStepProps = {
  data: CreateTourPayload;
  onUpdate: (updates: Partial<CreateTourPayload>) => void;
};

const defaultTier = (): PricingTierPayload => ({
  id: crypto.randomUUID(),
  minPax: 1,
  maxPax: 5,
  amount: 5000,
  currency: "USD",
});

const defaultBlackout = (): BlackoutDatePayload => ({
  id: crypto.randomUUID(),
  startDate: "",
  endDate: "",
  reason: "",
});

export function PricingPublishStep({ data, onUpdate }: PricingPublishStepProps) {
  const tiers = data.pricingTiers ?? [];
  const blackouts = data.blackoutDates ?? [];
  const [formTier, setFormTier] = React.useState<PricingTierPayload | null>(null);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [reason, setReason] = React.useState("");

  const addTier = () => {
    const newTier = defaultTier();
    onUpdate({ pricingTiers: [...tiers, newTier] });
    setFormTier(newTier);
  };

  const editTier = (tier: PricingTierPayload) => setFormTier({ ...tier });

  const saveTier = () => {
    if (!formTier) return;
    const idx = tiers.findIndex((t) => t.id === formTier.id);
    const next =
      idx >= 0 ? tiers.map((t) => (t.id === formTier.id ? formTier : t)) : [...tiers, formTier];
    onUpdate({ pricingTiers: next });
    setFormTier(null);
  };

  const removeTier = (id: string) => {
    onUpdate({ pricingTiers: tiers.filter((t) => t.id !== id) });
    if (formTier?.id === id) setFormTier(null);
  };

  const addBlackout = () => {
    const b: BlackoutDatePayload = {
      ...defaultBlackout(),
      startDate,
      endDate,
      reason,
    };
    onUpdate({ blackoutDates: [...blackouts, b] });
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  const removeBlackout = (id: string) => {
    onUpdate({ blackoutDates: blackouts.filter((b) => b.id !== id) });
  };

  return (
    <div className="w-full space-y-10">
      {/* Pricing */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">Pricing</h2>
          <p className="text-sm text-muted-foreground">
            Set tiered pricing based on group size. At least one tier is required.
          </p>
        </div>

        {formTier && (
          <div>
            <Card className="border border-border rounded-lg p-6 space-y-4">
              <h4 className="font-medium">Add / Edit tier</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={formTier.currency}
                    onValueChange={(v) => setFormTier({ ...formTier, currency: v })}
                    options={CURRENCY_OPTIONS}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Min pax</Label>
                  <Input
                    type="number"
                    min={1}
                    value={formTier.minPax}
                    onChange={(e) =>
                      setFormTier({ ...formTier, minPax: Number(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max pax</Label>
                  <Input
                    type="number"
                    min={1}
                    value={formTier.maxPax}
                    onChange={(e) =>
                      setFormTier({ ...formTier, maxPax: Number(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2 max-w-xs">
                <Label>Amount (cents)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min={0}
                    className="pl-10"
                    value={formTier.amount}
                    onChange={(e) =>
                      setFormTier({ ...formTier, amount: Number(e.target.value) || 0 })
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground">e.g. 5000 = $50.00</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={saveTier}>Save tier</Button>
                <Button variant="ghost" onClick={() => setFormTier(null)}>
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        <Button variant="outline" className="w-full" onClick={addTier}>
          <Plus className="w-4 h-4 mr-2" />
          Add pricing tier
        </Button>

        {tiers.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-base font-medium">Active tiers</h4>
            <div className="space-y-2">
              {tiers.map((tier) => (
                <Card
                  key={tier.id}
                  className="bg-secondary/50 border border-border rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-muted text-muted-foreground">
                        {tier.minPax}–{tier.maxPax} pax
                      </span>
                      <div>
                        <span className="text-lg font-semibold">
                          ${(tier.amount / 100).toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">
                          {tier.currency}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => editTier(tier)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-destructive"
                        onClick={() => removeTier(tier.id)}
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

      {/* Blackout dates */}
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
                value={startDate}
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
                value={endDate}
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
                      {b.startDate} – {b.endDate}
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

      {/* Publish */}
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
            checked={data.isActive ?? true}
            onCheckedChange={(v) => onUpdate({ isActive: v })}
            className="data-[state=checked]:bg-primary"
          />
        </div>
        <Card className="bg-accent/50 border border-border rounded-lg p-4">
          <p className="text-sm text-accent-foreground">
            Once published, your tour will be visible and available for booking. You can
            change this anytime from the tour dashboard.
          </p>
        </Card>
      </div>
    </div>
  );
}
