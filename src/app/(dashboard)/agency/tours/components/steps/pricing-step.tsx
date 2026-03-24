"use client";

import { useEffect } from "react";

import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { FormStepLayout } from "@/components/shared/form-step-layout";
import type { CreateTourWizardState } from "@/features/tours/tour.types";
import {
  CURRENCY_SELECT_OPTIONS,
  DEFAULT_PRICING_CURRENCY,
} from "@/lib/geo/currencies";
import {
  isContiguousPartition,
  normalizeToContiguousPartition,
  pricingScaleMaxPax,
  setAllTierCurrencies,
} from "@/features/tours/utils/pricing-tier-partition";
import { PricingTierScaleEditor } from "@/app/(dashboard)/agency/tours/components/pricing-tier-scale-editor";

type PricingStepProps = {
  data: CreateTourWizardState;
  onUpdate: (updates: Partial<CreateTourWizardState>) => void;
};

export function PricingStep({ data, onUpdate }: PricingStepProps) {
  const maxPax = pricingScaleMaxPax(data.default_capacity);
  const tiers = data.pricing_tiers ?? [];
  const sharedCurrency = tiers[0]?.currency ?? DEFAULT_PRICING_CURRENCY;

  useEffect(() => {
    const list = data.pricing_tiers ?? [];
    if (!isContiguousPartition(list, maxPax)) {
      onUpdate({
        pricing_tiers: normalizeToContiguousPartition(
          list,
          maxPax,
          list[0]?.currency ?? DEFAULT_PRICING_CURRENCY,
        ),
      });
    }
  }, [maxPax, data.pricing_tiers, onUpdate]);

  const handleCurrencyChange = (currency: string) => {
    if (tiers.length === 0) return;
    onUpdate({ pricing_tiers: setAllTierCurrencies(tiers, currency) });
  };

  return (
    <FormStepLayout
      title="Pricing"
      description="Set price per person for each group-size tier along the scale. Default capacity from the Location step sets how far the scale runs; tiers must cover every group size from 1 through that capacity with no gaps or overlaps."
    >
      <div className="flex min-w-0 flex-col gap-8">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Tiers run from <span className="font-medium text-foreground">1</span> through{" "}
          <span className="font-medium text-foreground">{maxPax}</span> participants (default
          capacity from Location). Change capacity in step 2 if needed—the editor below shows the
          same limit.
        </p>

        <div className="min-w-0 max-w-xl space-y-2">
          <Label className="text-sm font-medium" required>
            Currency (all tiers)
          </Label>
          <Select
            value={sharedCurrency}
            onValueChange={handleCurrencyChange}
            options={[...CURRENCY_SELECT_OPTIONS]}
            searchable
            searchPlaceholder="Search code or name…"
          />
        </div>

        {tiers.length > 0 ? (
          <PricingTierScaleEditor
            maxPax={maxPax}
            tiers={tiers}
            sharedCurrency={sharedCurrency}
            onTiersChange={(next) => onUpdate({ pricing_tiers: next })}
          />
        ) : (
          <p className="text-sm text-muted-foreground">Preparing pricing tiers…</p>
        )}
      </div>
    </FormStepLayout>
  );
}
