"use client";

import React from "react";
import { Plus, Calendar, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { FormStepLayout } from "@/components/shared/form-step-layout";
import { cn } from "@/lib/utils";

import type {
  CreateTourPayload,
  BlackoutDatePayload,
} from "@/features/tours/tour.validation";

type PublishStepProps = {
  data: CreateTourPayload;
  onUpdate: (updates: Partial<CreateTourPayload>) => void;
};

const defaultBlackout = (): BlackoutDatePayload => ({
  id: crypto.randomUUID(),
  startDate: "",
  endDate: "",
  reason: "",
});

export function PublishStep({ data, onUpdate }: PublishStepProps) {
  const blackouts = data.blackoutDates ?? [];
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [reason, setReason] = React.useState("");

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
    <FormStepLayout
      title="Publish"
      description="Set blackout dates and make your tour live."
    >
      <div className="mb-8">
        <h3 className="text-base font-semibold text-foreground mb-2">Blackout dates</h3>
        <p className="text-[13px] text-muted-foreground mb-4">
          Block dates when the tour is unavailable.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground mb-2 block">Start</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="date"
                className="pl-10 h-11 rounded-lg border-input bg-background"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground mb-2 block">End</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="date"
                className="pl-10 h-11 rounded-lg border-input bg-background"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="space-y-2 mb-6">
          <Label className="text-sm font-medium text-foreground mb-2 block">
            Reason (optional)
          </Label>
          <Textarea
            placeholder="e.g., Holiday season, maintenance"
            className="min-h-[80px] rounded-lg border-input bg-background resize-none"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={addBlackout}
          className={cn(
            "w-full rounded-lg border-2 border-dashed border-border bg-muted/30 min-h-[80px]",
            "flex flex-col items-center justify-center gap-1 p-6",
            "hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer"
          )}
        >
          <Plus className="w-8 h-8 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Add blackout period</span>
        </button>
        {blackouts.length > 0 && (
          <div className="space-y-3 mt-6">
            {blackouts.map((b) => (
              <Card
                key={b.id}
                className="border-border transition-colors hover:border-primary/20"
              >
                <div className="flex items-center justify-between p-4 sm:p-5">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {b.startDate} – {b.endDate}
                    </div>
                    {b.reason && (
                      <div className="text-sm text-muted-foreground mt-0.5">{b.reason}</div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => removeBlackout(b.id)}
                    aria-label="Remove blackout period"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-border">
        <h3 className="text-base font-semibold text-foreground mb-2">Visibility</h3>
        <p className="text-[13px] text-muted-foreground mb-4">
          Control whether your tour is visible and bookable.
        </p>
        <Card className="mb-4 border-border">
          <div className="flex items-center justify-between p-4 sm:p-5">
            <div>
              <div className="text-sm font-medium text-foreground">Make tour active</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Visible and bookable by customers
              </div>
            </div>
            <Switch
              checked={data.isActive ?? true}
              onCheckedChange={(v) => onUpdate({ isActive: v })}
            />
          </div>
        </Card>
        <Card className="border-border bg-accent/30">
          <CardContent className="p-4 sm:p-5">
            <p className="text-sm text-accent-foreground">
              Once published, your tour will be visible and available for booking. You can
              change this anytime from the tour dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    </FormStepLayout>
  );
}
