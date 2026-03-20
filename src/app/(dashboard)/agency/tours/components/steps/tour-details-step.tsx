"use client";

import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, type SelectOption } from "@/components/ui/select";
import { MapboxLocationPicker } from "@/components/shared/mapbox-location-picker";
import type { CreateTourPayload } from "@/features/tours/tour.validation";
import { COUNTRY_SELECT_OPTIONS } from "@/lib/geo/countries";

const TOUR_TYPE_OPTIONS: SelectOption<"on_demand" | "fixed_schedule">[] = [
  { value: "on_demand", label: "On Demand" },
  { value: "fixed_schedule", label: "Fixed Schedule" },
];

type TourDetailsStepProps = {
  data: CreateTourPayload;
  onUpdate: (updates: Partial<CreateTourPayload>) => void;
};

export function TourDetailsStep({ data, onUpdate }: TourDetailsStepProps) {
  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <div className="space-y-2">
        <Label htmlFor="tourTitle" className="text-sm font-medium">
          Tour Title
        </Label>
        <Input
          id="tourTitle"
          placeholder="Enter tour package name"
          className="h-11 rounded-lg"
          value={data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your tour experience…"
          className="min-h-[120px] rounded-lg resize-none"
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
        />
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-base font-semibold">Location Details</h3>
        <MapboxLocationPicker
          value={data.location}
          onChange={(location) => onUpdate({ location })}
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium">
              City
            </Label>
            <Input
              id="city"
              placeholder="City"
              className="h-11 rounded-lg"
              value={data.location?.city ?? ""}
              onChange={(e) =>
                onUpdate({
                  location: { ...data.location, city: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="province" className="text-sm font-medium">
              Province/State
            </Label>
            <Input
              id="province"
              placeholder="Province or State"
              className="h-11 rounded-lg"
              value={data.location?.provinceState ?? ""}
              onChange={(e) =>
                onUpdate({
                  location: { ...data.location, provinceState: e.target.value },
                })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Country</Label>
            <Select
              value={data.location?.countryCode}
              onValueChange={(v) =>
                onUpdate({
                  location: { ...data.location, countryCode: v },
                })
              }
              options={[...COUNTRY_SELECT_OPTIONS]}
              placeholder="Select country"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode" className="text-sm font-medium">
              Postal/Zip Code
            </Label>
            <Input
              id="postalCode"
              placeholder="Postal/Zip code"
              className="h-11 rounded-lg"
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

      <div className="space-y-4 pt-4">
        <h3 className="text-base font-semibold">Basic Settings</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium">
              Duration (days)
            </Label>
            <Input
              id="duration"
              type="number"
              placeholder="7"
              className="h-11 rounded-lg"
              value={data.durationDays ?? ""}
              onChange={(e) =>
                onUpdate({ durationDays: e.target.value ? Number(e.target.value) : undefined })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity" className="text-sm font-medium">
              Default Capacity (persons)
            </Label>
            <Input
              id="capacity"
              type="number"
              placeholder="15"
              className="h-11 rounded-lg"
              value={data.defaultCapacity ?? ""}
              onChange={(e) =>
                onUpdate({
                  defaultCapacity: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxBookings" className="text-sm font-medium">
              Max Simultaneous Bookings
            </Label>
            <Input
              id="maxBookings"
              type="number"
              placeholder="3"
              className="h-11 rounded-lg"
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
        <div className="space-y-2">
          <Label className="text-sm font-medium">Tour Type</Label>
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
    </div>
  );
}
