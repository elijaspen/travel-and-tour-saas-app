"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, type SelectOption } from "@/components/ui/select";
import { FormStepLayout } from "@/components/shared/form-step-layout";
import { MapboxLocationPicker } from "@/components/shared/mapbox-location-picker";
import type { CreateTourWizardState, TourType } from "@/features/tours/tour.types";
import { COUNTRY_SELECT_OPTIONS } from "@/lib/geo/countries";

const TOUR_TYPE_OPTIONS: SelectOption<TourType>[] = [
  { value: "on_demand", label: "On Demand" },
  { value: "fixed_schedule", label: "Fixed Schedule" },
];

type LocationStepProps = {
  data: CreateTourWizardState;
  onUpdate: (updates: Partial<CreateTourWizardState>) => void;
};

export function LocationStep({ data, onUpdate }: LocationStepProps) {
  return (
    <FormStepLayout
      title="Where & when"
      description="Location details and operational settings for your tour."
    >
      <div className="mb-6">
        <h3 className="text-base font-semibold text-foreground mb-2">Location</h3>
        <p className="text-[13px] text-muted-foreground mb-4">
          Search and select the primary location for your tour.
        </p>
        <MapboxLocationPicker
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
            <Label htmlFor="city" className="text-sm font-medium text-foreground mb-2 block">
              City
            </Label>
            <Input
              id="city"
              placeholder="City"
              className="h-11 rounded-lg border-input bg-background"
              value={data.city ?? ""}
              onChange={(e) => onUpdate({ city: e.target.value || undefined })}
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
            <Label className="text-sm font-medium text-foreground mb-2 block">Country</Label>
            <Select
              value={data.country_code}
              onValueChange={(v) => onUpdate({ country_code: v || undefined })}
              options={[...COUNTRY_SELECT_OPTIONS]}
              placeholder="Select country"
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

      <div className="pt-6 border-t border-border">
        <h3 className="text-base font-semibold text-foreground mb-2">Operational settings</h3>
        <p className="text-[13px] text-muted-foreground mb-4">
          Duration, capacity, and tour type.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium text-foreground mb-2 block">
              Duration (days)
            </Label>
            <Input
              id="duration"
              type="number"
              min={1}
              placeholder="3"
              className="h-11 rounded-lg border-input bg-background"
              value={data.duration_days ?? ""}
              onChange={(e) =>
                onUpdate({
                  duration_days: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity" className="text-sm font-medium text-foreground mb-2 block">
              Default capacity (persons)
            </Label>
            <Input
              id="capacity"
              type="number"
              min={1}
              placeholder="15"
              className="h-11 rounded-lg border-input bg-background"
              value={data.default_capacity ?? ""}
              onChange={(e) =>
                onUpdate({
                  default_capacity: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max_bookings" className="text-sm font-medium text-foreground mb-2 block">
              Max simultaneous bookings
            </Label>
            <Input
              id="max_bookings"
              type="number"
              min={1}
              placeholder="2"
              className="h-11 rounded-lg border-input bg-background"
              value={data.max_simultaneous_bookings ?? ""}
              onChange={(e) =>
                onUpdate({
                  max_simultaneous_bookings: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
          </div>
        </div>
        <div className="space-y-2 w-full">
          <Label className="text-sm font-medium text-foreground mb-2 block">Tour type</Label>
          <Select
            value={data.tour_type}
            onValueChange={(v) => onUpdate({ tour_type: v as TourType })}
            options={TOUR_TYPE_OPTIONS}
            placeholder="Select tour type"
          />
        </div>
      </div>
    </FormStepLayout>
  );
}
