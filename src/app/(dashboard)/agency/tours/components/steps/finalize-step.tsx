"use client";

import React from "react";
import { Calendar, Plus, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

import type {
  CreateTourPayload,
  BlackoutDatePayload,
} from "@/features/tours/tour.validation";

type FinalizeStepProps = {
  data: CreateTourPayload;
  onUpdate: (updates: Partial<CreateTourPayload>) => void;
};

const defaultBlackout = (): BlackoutDatePayload => ({
  id: crypto.randomUUID(),
  startDate: "",
  endDate: "",
  reason: "",
});

export function FinalizeStep({ data, onUpdate }: FinalizeStepProps) {
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
    <div className="max-w-[900px] mx-auto space-y-8">
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Manage Blackout Dates</h3>
          <p className="text-sm text-muted-foreground">
            Block dates when the tour is unavailable
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-10"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-10"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Reason (optional)</Label>
            <Textarea
              placeholder="e.g., Holiday season, maintenance"
              className="min-h-[80px] resize-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <Button variant="secondary" className="w-full" onClick={addBlackout}>
            <Plus className="w-4 h-4 mr-2" />
            Add Blackout Period
          </Button>
        </div>
        {blackouts.length > 0 && (
          <div className="space-y-2">
            {blackouts.map((b) => (
              <Card key={b.id} className="bg-background border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      {b.startDate} to {b.endDate}
                    </div>
                    {b.reason && (
                      <div className="text-sm text-muted-foreground">{b.reason}</div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-destructive"
                    onClick={() => removeBlackout(b.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Publish Tour</h3>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
          <div className="space-y-1">
            <div className="text-sm font-medium">
              Make tour active and visible to customers
            </div>
            <div className="text-xs text-muted-foreground">
              Active – Live and bookable
            </div>
          </div>
          <Switch
            checked={data.isActive ?? true}
            onCheckedChange={(v) => onUpdate({ isActive: v })}
            className="data-[state=checked]:bg-primary"
          />
        </div>
        <Card className="bg-accent border border-border rounded-lg p-4">
          <p className="text-sm text-accent-foreground">
            Once published, your tour will be immediately visible to customers and
            available for booking. You can change the status anytime from the tour
            management dashboard.
          </p>
        </Card>
      </div>
    </div>
  );
}
