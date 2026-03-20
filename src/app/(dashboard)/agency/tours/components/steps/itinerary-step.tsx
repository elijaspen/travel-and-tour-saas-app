"use client";

import React from "react";
import { ImageIcon, Plus, Pencil, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FormStepLayout } from "@/components/shared/form-step-layout";
import { cn } from "@/lib/utils";

import type {
  CreateTourPayload,
  ItineraryDayPayload,
} from "@/features/tours/tour.validation";

type ItineraryStepProps = {
  data: CreateTourPayload;
  onUpdate: (updates: Partial<CreateTourPayload>) => void;
};

const defaultDay = (dayNumber: number): ItineraryDayPayload => ({
  id: crypto.randomUUID(),
  dayNumber,
  title: "",
  startTime: "",
  description: "",
  imageUrl: "",
});

export function ItineraryStep({ data, onUpdate }: ItineraryStepProps) {
  const days = data.itineraryDays ?? [];
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formDay, setFormDay] = React.useState<ItineraryDayPayload | null>(null);

  const addDay = () => {
    const nextNum = days.length === 0 ? 1 : Math.max(...days.map((d) => d.dayNumber)) + 1;
    const newDay = defaultDay(nextNum);
    setFormDay(newDay);
    setEditingId(newDay.id);
  };

  const editDay = (day: ItineraryDayPayload) => {
    setFormDay({ ...day });
    setEditingId(day.id);
  };

  const saveDay = () => {
    if (!formDay) return;
    const idx = days.findIndex((d) => d.id === formDay.id);
    const next =
      idx >= 0
        ? days.map((d) => (d.id === formDay.id ? formDay : d))
        : [...days, formDay];
    onUpdate({ itineraryDays: next });
    setFormDay(null);
    setEditingId(null);
  };

  const isOpen = !!formDay && !!editingId;

  const removeDay = (id: string) => {
    onUpdate({ itineraryDays: days.filter((d) => d.id !== id) });
    if (editingId === id) {
      setFormDay(null);
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setFormDay(null);
    setEditingId(null);
  };

  return (
    <FormStepLayout
      title="Itinerary"
      description="Add daily activities and schedules."
    >
      <Dialog open={isOpen} onOpenChange={(open) => !open && cancelEdit()}>
        <DialogContent
          className="sm:max-w-[520px]"
          showCloseButton={true}
        >
          {formDay && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {days.some((d) => d.id === formDay.id) ? "Edit" : "Add"} day
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      Day number
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      className="h-11 rounded-lg border-input bg-background"
                      value={formDay.dayNumber}
                      onChange={(e) =>
                        setFormDay({ ...formDay, dayNumber: Number(e.target.value) || 1 })
                      }
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      Day title
                    </Label>
                    <Input
                      placeholder="e.g., Arrival & City Orientation"
                      className="h-11 rounded-lg border-input bg-background"
                      value={formDay.title}
                      onChange={(e) => setFormDay({ ...formDay, title: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2 max-w-[200px]">
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Start time
                  </Label>
                  <Input
                    type="time"
                    className="h-11 rounded-lg border-input bg-background"
                    value={formDay.startTime ?? ""}
                    onChange={(e) => setFormDay({ ...formDay, startTime: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Activities & description
                  </Label>
                  <Textarea
                    placeholder="Describe the day's activities, highlights, and schedule…"
                    className="min-h-[100px] rounded-lg border-input bg-background resize-none"
                    value={formDay.description ?? ""}
                    onChange={(e) => setFormDay({ ...formDay, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Optional day image
                  </Label>
                  <div
                    className={cn(
                      "min-h-[100px] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 bg-muted/30 py-4",
                      "hover:border-primary/50 transition-colors cursor-pointer"
                    )}
                  >
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload day image (optional)
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter showCloseButton={false} className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={cancelEdit} className="rounded-lg h-10 px-4">
                  Cancel
                </Button>
                <Button onClick={saveDay} className="rounded-lg h-10 px-4">
                  Save day
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <button
        type="button"
        onClick={addDay}
        className={cn(
          "w-full mb-6 rounded-lg border-2 border-dashed border-border bg-muted/30 min-h-[100px]",
          "flex flex-col items-center justify-center gap-2 p-6",
          "hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer"
        )}
      >
        <Plus className="w-10 h-10 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Add day</span>
        <span className="text-xs text-muted-foreground">Add another day to your itinerary</span>
      </button>

      {days.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-base font-semibold text-foreground">Added days</h4>
          <div className="space-y-3">
            {days.map((day) => (
              <Card
                key={day.id}
                className="overflow-hidden border-border transition-colors hover:border-primary/20"
              >
                <div className="flex items-stretch gap-4 p-4 sm:p-5">
                  {day.imageUrl ? (
                    <img
                      src={day.imageUrl}
                      alt={day.title || "Day"}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover shrink-0 border border-border"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-muted/50 border border-border shrink-0 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-medium shrink-0">
                        {day.dayNumber}
                      </span>
                      <h5 className="text-base font-medium text-foreground truncate">
                        {day.title || "(Untitled)"}
                      </h5>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {day.description || "No description"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                      onClick={() => editDay(day)}
                      aria-label="Edit day"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeDay(day.id)}
                      aria-label="Remove day"
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
    </FormStepLayout>
  );
}
