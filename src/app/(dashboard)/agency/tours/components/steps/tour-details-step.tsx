"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, type SelectOption } from "@/components/ui/select";
import { MapboxLocationPicker } from "@/components/shared/mapbox-location-picker";
import type { CreateTourWizardState, TourType } from "@/features/tours/tour.types";
import { COUNTRY_SELECT_OPTIONS } from "@/lib/geo/countries";

const TOUR_TYPE_OPTIONS: SelectOption<TourType>[] = [
  { value: "on_demand", label: "On Demand" },
  { value: "fixed_schedule", label: "Fixed Schedule" },
];

type TourDetailsStepProps = {
  data: CreateTourWizardState;
  onUpdate: (updates: Partial<CreateTourWizardState>) => void;
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium">
              City
            </Label>
            <Input
              id="city"
              placeholder="City"
              className="h-11 rounded-lg"
              value={data.city ?? ""}
              onChange={(e) => onUpdate({ city: e.target.value || undefined })}
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
              value={data.province_state ?? ""}
              onChange={(e) => onUpdate({ province_state: e.target.value || undefined })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Country</Label>
            <Select
              value={data.country_code}
              onValueChange={(v) => onUpdate({ country_code: v || undefined })}
              options={[...COUNTRY_SELECT_OPTIONS]}
              placeholder="Select country"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal_code" className="text-sm font-medium">
              Postal/Zip Code
            </Label>
            <Input
              id="postal_code"
              placeholder="Postal/Zip code"
              className="h-11 rounded-lg"
              value={data.postal_code ?? ""}
              onChange={(e) => onUpdate({ postal_code: e.target.value || undefined })}
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
              value={data.duration_days ?? ""}
              onChange={(e) =>
                onUpdate({
                  duration_days: e.target.value ? Number(e.target.value) : undefined,
                })
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
              value={data.default_capacity ?? ""}
              onChange={(e) =>
                onUpdate({
                  default_capacity: e.target.value ? Number(e.target.value) : undefined,
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
        <div className="space-y-2">
          <Label className="text-sm font-medium">Tour Type</Label>
          <Select
            value={data.tour_type}
            onValueChange={(v) => onUpdate({ tour_type: v as TourType })}
            options={TOUR_TYPE_OPTIONS}
            placeholder="Select tour type"
          />
        </div>
      </div>
    </div>
  );
}
