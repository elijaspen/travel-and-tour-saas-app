"use client";

import { useState } from "react";
import { Plus, Calendar, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { FormStepLayout } from "@/components/shared/forms/form-step-layout";
import { cn } from "@/lib/utils";
import type { BlackoutDateForm, CreateTourWizardState } from "@/modules/tours/tour.types";

const SHOW_BLACKOUT_DATES_FORM = true;

type PublishStepProps = {
  data: CreateTourWizardState;
  onUpdate: (updates: Partial<CreateTourWizardState>) => void;
};

const defaultBlackout = (): BlackoutDateForm => ({
  id: crypto.randomUUID(),
  start_date: "",
  end_date: "",
  reason: "",
});

function BlackoutDatesFormSection({
  data,
  onUpdate,
}: {
  data: CreateTourWizardState;
  onUpdate: (updates: Partial<CreateTourWizardState>) => void;
}) {
  const blackouts = data.blackout_dates ?? [];
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const addBlackout = () => {
    const b: BlackoutDateForm = {
      ...defaultBlackout(),
      start_date,
      end_date,
      reason,
    };
    onUpdate({ blackout_dates: [...blackouts, b] });
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  const removeBlackout = (id: string) => {
    onUpdate({ blackout_dates: blackouts.filter((b) => b.id !== id) });
  };

  const canAddBlackout = Boolean(start_date && end_date && start_date <= end_date);

  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold text-foreground mb-2">Blackout dates</h3>
      <p className="text-[13px] text-muted-foreground mb-4">
        Optional: block dates when the tour is unavailable. Choose a start and end date, then add the
        period.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground mb-2 block">Start</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="date"
              className="pl-10 h-11 rounded-lg border-input bg-background"
              value={start_date}
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
              value={end_date}
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
        disabled={!canAddBlackout}
        onClick={addBlackout}
        className={cn(
          "w-full rounded-lg border-2 border-dashed border-border bg-muted/30 min-h-[80px]",
          "flex flex-col items-center justify-center gap-1 p-6",
          "hover:border-primary/50 hover:bg-muted/50 transition-colors",
          canAddBlackout ? "cursor-pointer" : "opacity-50 cursor-not-allowed",
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
                    {b.start_date} – {b.end_date}
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
  );
}

export function PublishStep({ data, onUpdate }: PublishStepProps) {
  return (
    <FormStepLayout
      title="Publish"
      description={
        SHOW_BLACKOUT_DATES_FORM
          ? "Set blackout dates and make your tour live."
          : "Make your tour live."
      }
    >
      {SHOW_BLACKOUT_DATES_FORM ? (
        <BlackoutDatesFormSection data={data} onUpdate={onUpdate} />
      ) : null}

      <div className={SHOW_BLACKOUT_DATES_FORM ? "pt-6 border-t border-border" : undefined}>
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
              checked={data.is_active ?? true}
              onCheckedChange={(v) => onUpdate({ is_active: v })}
            />
          </div>
        </Card>
        <Card className="border-border bg-accent/30">
          <CardContent className="p-4 sm:p-5">
            <p className="text-sm text-accent-foreground">
              Once published, your tour will be visible and available for booking. You can change
              this anytime from the tour dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    </FormStepLayout>
  );
}
