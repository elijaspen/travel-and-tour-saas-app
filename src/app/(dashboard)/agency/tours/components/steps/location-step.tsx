"use client";

import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, type SelectOption } from "@/components/ui/select";
import { FormStepLayout } from "@/components/shared/form-step-layout";
import { MapboxLocationPicker } from "@/components/shared/mapbox-location-picker";
import type { CreateTourPayload } from "@/features/tours/tour.validation";

const TOUR_TYPE_OPTIONS: SelectOption<"on_demand" | "fixed_schedule">[] = [
  { value: "on_demand", label: "On Demand" },
  { value: "fixed_schedule", label: "Fixed Schedule" },
];

const COUNTRY_OPTIONS: SelectOption[] = [
  { value: "PH", label: "Philippines" },
  { value: "US", label: "United States" },
  { value: "JP", label: "Japan" },
  { value: "TH", label: "Thailand" },
  { value: "ID", label: "Indonesia" },
];

type LocationStepProps = {
  data: CreateTourPayload;
  onUpdate: (updates: Partial<CreateTourPayload>) => void;
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
          value={data.location}
          onChange={(location) => onUpdate({ location })}
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
              value={data.location?.city ?? ""}
              onChange={(e) =>
                onUpdate({ location: { ...data.location, city: e.target.value } })
              }
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
              value={data.location?.provinceState ?? ""}
              onChange={(e) =>
                onUpdate({
                  location: { ...data.location, provinceState: e.target.value },
                })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground mb-2 block">Country</Label>
            <Select
              value={data.location?.countryCode}
              onValueChange={(v) =>
                onUpdate({ location: { ...data.location, countryCode: v } })
              }
              options={COUNTRY_OPTIONS}
              placeholder="Select country"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode" className="text-sm font-medium text-foreground mb-2 block">
              Postal/Zip Code
            </Label>
            <Input
              id="postalCode"
              placeholder="Postal/Zip code"
              className="h-11 rounded-lg border-input bg-background"
              value={data.location?.postalCode ?? ""}
              onChange={(e) =>
                onUpdate({
                  location: { ...data.location, postalCode: e.target.value },
                })
              }
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
              value={data.durationDays ?? ""}
              onChange={(e) =>
                onUpdate({
                  durationDays: e.target.value ? Number(e.target.value) : undefined,
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
              value={data.defaultCapacity ?? ""}
              onChange={(e) =>
                onUpdate({
                  defaultCapacity: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxBookings" className="text-sm font-medium text-foreground mb-2 block">
              Max simultaneous bookings
            </Label>
            <Input
              id="maxBookings"
              type="number"
              min={1}
              placeholder="2"
              className="h-11 rounded-lg border-input bg-background"
              value={data.maxSimultaneousBookings ?? ""}
              onChange={(e) =>
                onUpdate({
                  maxSimultaneousBookings: e.target.value
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
            value={data.tourType}
            onValueChange={(v) =>
              onUpdate({ tourType: v as "on_demand" | "fixed_schedule" })
            }
            options={TOUR_TYPE_OPTIONS}
            placeholder="Select tour type"
          />
        </div>
      </div>
    </FormStepLayout>
  );
}
