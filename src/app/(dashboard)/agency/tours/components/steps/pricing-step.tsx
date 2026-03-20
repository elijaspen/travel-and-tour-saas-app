"use client";

import React from "react";
import { Plus, Pencil, Trash2, DollarSign } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, type SelectOption } from "@/components/ui/select";
import { FormStepLayout } from "@/components/shared/form-step-layout";
import { cn } from "@/lib/utils";

import type {
  CreateTourPayload,
  PricingTierPayload,
} from "@/features/tours/tour.validation";
import { CURRENCY_SELECT_OPTIONS } from "@/lib/geo/currencies";

type PricingStepProps = {
  data: CreateTourPayload;
  onUpdate: (updates: Partial<CreateTourPayload>) => void;
};

const defaultTier = (): PricingTierPayload => ({
  id: crypto.randomUUID(),
  minPax: 1,
  maxPax: 5,
  amount: 5000, // cents
  currency: "USD",
});

export function PricingStep({ data, onUpdate }: PricingStepProps) {
  const tiers = data.pricingTiers ?? [];
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formTier, setFormTier] = React.useState<PricingTierPayload | null>(null);

  const addTier = () => {
    const newTier = defaultTier();
    setFormTier(newTier);
    setEditingId(newTier.id);
  };

  const editTier = (tier: PricingTierPayload) => {
    setFormTier({ ...tier });
    setEditingId(tier.id);
  };

  const saveTier = () => {
    if (!formTier) return;
    const idx = tiers.findIndex((t) => t.id === formTier.id);
    const next =
      idx >= 0
        ? tiers.map((t) => (t.id === formTier.id ? formTier : t))
        : [...tiers, formTier];
    onUpdate({ pricingTiers: next });
    setFormTier(null);
    setEditingId(null);
  };

  const removeTier = (id: string) => {
    onUpdate({ pricingTiers: tiers.filter((t) => t.id !== id) });
    if (editingId === id) {
      setFormTier(null);
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setFormTier(null);
    setEditingId(null);
  };

  const isOpen = !!formTier && !!editingId;

  return (
    <FormStepLayout
      title="Pricing"
      description="Set tiered pricing based on group size. At least one tier is required."
    >
      <Dialog open={isOpen} onOpenChange={(open) => !open && cancelEdit()}>
        <DialogContent className="sm:max-w-[440px]" showCloseButton={true}>
          {formTier && (
            <>
              <DialogHeader>
                <DialogTitle>Add / edit pricing tier</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      Currency
                    </Label>
                    <Select
                      value={formTier.currency}
                      onValueChange={(v) => setFormTier({ ...formTier, currency: v })}
                      options={[...CURRENCY_SELECT_OPTIONS]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      Min pax
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      className="h-11 rounded-lg border-input bg-background"
                      value={formTier.minPax}
                      onChange={(e) =>
                        setFormTier({ ...formTier, minPax: Number(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      Max pax
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      className="h-11 rounded-lg border-input bg-background"
                      value={formTier.maxPax}
                      onChange={(e) =>
                        setFormTier({ ...formTier, maxPax: Number(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2 max-w-[200px]">
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Price amount (cents)
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min={0}
                      className="pl-10 h-11 rounded-lg border-input bg-background"
                      value={formTier.amount}
                      onChange={(e) =>
                        setFormTier({ ...formTier, amount: Number(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    e.g. 5000 = $50.00
                  </p>
                </div>
              </div>
              <DialogFooter showCloseButton={false} className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={cancelEdit} className="rounded-lg h-10 px-4">
                  Cancel
                </Button>
                <Button onClick={saveTier} className="rounded-lg h-10 px-4">
                  Save tier
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <button
        type="button"
        onClick={addTier}
        className={cn(
          "w-full mb-6 rounded-lg border-2 border-dashed border-border bg-muted/30 min-h-[100px]",
          "flex flex-col items-center justify-center gap-2 p-6",
          "hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer"
        )}
      >
        <Plus className="w-10 h-10 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Add pricing tier</span>
        <span className="text-xs text-muted-foreground">
          Add tiered pricing based on group size
        </span>
      </button>

      {tiers.length > 0 && (
        <>
          <div className="space-y-4 mb-6">
            <h4 className="text-base font-semibold text-foreground">Active pricing tiers</h4>
            <div className="space-y-3">
              {tiers.map((tier) => (
                <Card
                  key={tier.id}
                  className="border-border transition-colors hover:border-primary/20"
                >
                  <div className="flex items-center justify-between p-4 sm:p-5">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">
                        {tier.minPax}–{tier.maxPax}
                      </span>
                      <div>
                        <div className="text-xl font-semibold text-foreground">
                          ${(tier.amount / 100).toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">{tier.currency} · per person</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                        onClick={() => editTier(tier)}
                        aria-label="Edit tier"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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

          <div className="space-y-3">
            <h4 className="text-base font-semibold text-foreground">Pricing breakdown</h4>
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {tiers.map((tier) => (
                    <div
                      key={tier.id}
                      className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {tier.minPax}–{tier.maxPax} participants
                      </span>
                      <span className="text-base font-semibold text-foreground">
                        ${(tier.amount / 100).toFixed(2)} per person
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </FormStepLayout>
  );
}
