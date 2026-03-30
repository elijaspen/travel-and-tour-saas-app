"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { FormStepLayout } from "@/components/shared/forms/form-step-layout";
import { MapboxLocationPicker } from "@/components/shared/maps/mapbox-location-picker";
import type { CreateTourWizardState } from "@/features/tours/tour.types";
import { COUNTRY_SELECT_OPTIONS } from "@/lib/geo/countries";

type LocationStepProps = {
  data: CreateTourWizardState;
  onUpdate: (updates: Partial<CreateTourWizardState>) => void;
};

export function LocationStep({ data, onUpdate }: LocationStepProps) {
  return (
    <FormStepLayout
      title="Location"
      description="Where your tour is based."
    >
      <div className="mb-6">
        <MapboxLocationPicker
          mapLayout="modal"
          value={{
            address_line: data.address_line,
            city: data.city,
            province_state: data.province_state,
            country_code: data.country_code,
            postal_code: data.postal_code,
            latitude: data.latitude,
            longitude: data.longitude,
            place_id: data.place_id,
          }}
          onChange={(loc) =>
            onUpdate({
              address_line: loc.address_line ?? undefined,
              city: loc.city ?? undefined,
              province_state: loc.province_state ?? undefined,
              country_code: loc.country_code ?? undefined,
              postal_code: loc.postal_code ?? undefined,
              latitude: loc.latitude ?? undefined,
              longitude: loc.longitude ?? undefined,
              place_id: loc.place_id ?? undefined,
            })
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="space-y-2">
            <Label
              htmlFor="city"
              className="text-sm font-medium text-foreground mb-2 block"
              required
            >
              City
            </Label>
            <Input
              id="city"
              placeholder="City"
              className="h-11 rounded-lg border-input bg-background"
              value={data.city ?? ""}
              onChange={(e) => onUpdate({ city: e.target.value || undefined })}
              aria-required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="province" className="text-sm font-medium text-foreground mb-2 block">
              Province/State
            </Label>
            <Input
              id="province"
              placeholder="Province or State"
              className="h-11 rounded-lg border-input bg-background"
              value={data.province_state ?? ""}
              onChange={(e) =>
                onUpdate({ province_state: e.target.value || undefined })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground mb-2 block" required>
              Country
            </Label>
            <Select
              value={data.country_code}
              onValueChange={(v) => onUpdate({ country_code: v || undefined })}
              options={[...COUNTRY_SELECT_OPTIONS]}
              placeholder="Select country"
              searchable
              searchPlaceholder="Search country…"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal_code" className="text-sm font-medium text-foreground mb-2 block">
              Postal/Zip Code
            </Label>
            <Input
              id="postal_code"
              placeholder="Postal/Zip code"
              className="h-11 rounded-lg border-input bg-background"
              value={data.postal_code ?? ""}
              onChange={(e) => onUpdate({ postal_code: e.target.value || undefined })}
            />
          </div>
        </div>
      </div>
    </FormStepLayout>
  );
}
