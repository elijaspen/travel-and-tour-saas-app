"use client";

import { useState, useCallback, useMemo, type DragEvent } from "react";
import { Check, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FormStepLayout } from "@/components/shared/form-step-layout";
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import { Select } from "@/components/ui/select";
import { TOUR_TYPE_SELECT_OPTIONS } from "@/features/tours/tour.constants";
import type { CreateTourWizardState, TourPhotoDraft, TourType } from "@/features/tours/tour.types";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const MAX_SIZE = 10 * 1024 * 1024;

function withSortOrder(photos: TourPhotoDraft[]): TourPhotoDraft[] {
  return photos.map((p, i) => ({ ...p, sort_order: i }));
}

type BasicsStepProps = {
  data: CreateTourWizardState;
  onUpdate: (updates: Partial<CreateTourWizardState>) => void;
  errors?: { title?: string; description?: string };
};

const REORDER_DATA_TYPE = "application/x-tour-photo-index";

export function BasicsStep({ data, onUpdate, errors }: BasicsStepProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const photos = useMemo<TourPhotoDraft[]>(
    () => data.photos ?? [],
    [data.photos],
  );

  const handleBlur = (field: string) => () => setTouched((t) => ({ ...t, [field]: true }));

  const titleValid = (data.title?.trim().length ?? 0) >= 2;

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) return "Only PNG and JPG files are allowed.";
    if (file.size > MAX_SIZE) return "File must be 10MB or smaller.";
    return null;
  };

  const photoKey = (p: TourPhotoDraft) => p.id ?? p.tempId ?? "";

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.length) return;
      const newPhotos: TourPhotoDraft[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const err = validateFile(file);
        if (err) {
          console.warn(err, file.name);
          continue;
        }
        newPhotos.push({
          tempId: crypto.randomUUID(),
          file_url: URL.createObjectURL(file),
          file,
          sort_order: photos.length + newPhotos.length,
        });
      }
      if (newPhotos.length > 0) {
        onUpdate({ photos: withSortOrder([...photos, ...newPhotos]) });
      }
    },
    [photos, onUpdate],
  );

  const removePhoto = (key: string) => {
    const item = photos.find((p) => photoKey(p) === key);
    if (item?.file_url?.startsWith("blob:")) URL.revokeObjectURL(item.file_url);
    onUpdate({ photos: withSortOrder(photos.filter((p) => photoKey(p) !== key)) });
  };

  const movePhoto = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const arr = [...photos];
    const [removed] = arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, removed);
    onUpdate({ photos: withSortOrder(arr) });
  };

  const handlePreviewDragStart = (e: DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(REORDER_DATA_TYPE, String(index));
    e.dataTransfer.setData("text/plain", String(index));
    setDraggingIndex(index);
  };

  const handlePreviewDragEnd = () => {
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  const handlePreviewDragOver = (e: DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (e.dataTransfer.types.includes(REORDER_DATA_TYPE)) {
      setDragOverIndex(index);
    }
  };

  const handlePreviewDrop = (e: DragEvent, toIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    setDraggingIndex(null);
    const fromIndex = parseInt(
      e.dataTransfer.getData(REORDER_DATA_TYPE) ??
        e.dataTransfer.getData("text/plain") ??
        "",
      10,
    );
    if (!Number.isNaN(fromIndex) && fromIndex !== toIndex) {
      movePhoto(fromIndex, toIndex);
    }
  };

  return (
    <FormStepLayout
      title="Tour details"
      description="Name, description, capacity, and photos for your tour."
    >
      <div className="mb-6">
        <Label
          htmlFor="tourTitle"
          className="text-sm font-medium text-foreground mb-2 block"
          required
        >
          Tour title
        </Label>
        <div className="relative">
          <Input
            id="tourTitle"
            placeholder="Enter tour title"
            className={cn(
              "h-11 rounded-lg border-input bg-background pr-10 transition-colors",
              touched.title && errors?.title && "border-destructive focus-visible:ring-destructive/20",
            )}
            value={data.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            onBlur={handleBlur("title")}
            aria-required
          />
          {touched.title && titleValid && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
              <Check className="w-5 h-5" />
            </div>
          )}
        </div>
        {touched.title && errors?.title && (
          <p className="text-xs text-destructive mt-1">{errors.title}</p>
        )}
      </div>

      <div className="mb-6">
        <Label
          htmlFor="short_description"
          className="text-sm font-medium text-foreground mb-2 block"
        >
          Short description (teaser, optional)
        </Label>
        <Textarea
          id="short_description"
          placeholder="Enter a brief description"
          className="min-h-[100px] rounded-lg border-input bg-background resize-none"
          value={data.short_description ?? ""}
          onChange={(e) => onUpdate({ short_description: e.target.value || undefined })}
        />
        <div className="text-xs text-muted-foreground mt-2 text-right">Max 160 characters</div>
      </div>

      <div className="mb-8">
        <Label
          htmlFor="description"
          className="text-sm font-medium text-foreground mb-2 block"
          required
        >
          Full description
        </Label>
        <RichTextEditor
          value={data.description || ""}
          onChange={(html) => onUpdate({ description: html })}
          onBlur={handleBlur("description")}
          placeholder="Describe the experience, highlights, what's included…"
          minLength={10}
          maxLength={10_000}
          aria-invalid={touched.description && !!errors?.description ? true : undefined}
          aria-required
        />
        {touched.description && errors?.description && (
          <p className="text-xs text-destructive mt-1">{errors.description}</p>
        )}
      </div>

      <div className="mb-8 pt-2">
        <h3 className="text-base font-semibold text-foreground mb-4">Capacity &amp; scheduling</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <Label
              htmlFor="duration"
              className="text-sm font-medium text-foreground mb-2 block"
              required
            >
              Duration (days)
            </Label>
            <Input
              id="duration"
              type="number"
              min={1}
              placeholder="1"
              className="h-11 rounded-lg border-input bg-background"
              value={data.duration_days ?? ""}
              onChange={(e) =>
                onUpdate({
                  duration_days: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              aria-required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="capacity"
              className="text-sm font-medium text-foreground mb-2 block"
              required
            >
              Default capacity (persons)
            </Label>
            <Input
              id="capacity"
              type="number"
              min={1}
              placeholder="5"
              className="h-11 rounded-lg border-input bg-background"
              value={data.default_capacity ?? ""}
              onChange={(e) =>
                onUpdate({
                  default_capacity: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              aria-required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="max_bookings"
              className="text-sm font-medium text-foreground mb-2 block"
              required
            >
              Max simultaneous bookings
            </Label>
            <Input
              id="max_bookings"
              type="number"
              min={1}
              placeholder="1"
              className="h-11 rounded-lg border-input bg-background"
              value={data.max_simultaneous_bookings ?? ""}
              onChange={(e) =>
                onUpdate({
                  max_simultaneous_bookings: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              aria-required
            />
          </div>
        </div>
        <div className="space-y-2 w-full">
          <Label className="text-sm font-medium text-foreground mb-2 block">Tour type</Label>
          <Select
            value={data.tour_type}
            onValueChange={(v) => onUpdate({ tour_type: v as TourType })}
            options={[...TOUR_TYPE_SELECT_OPTIONS]}
            placeholder="Select tour type"
          />
        </div>
      </div>

      <div className="mb-8 w-full">
        <h2 className="text-lg font-semibold text-foreground mb-2">Inclusions &amp; Exclusions</h2>
        <p className="text-sm text-muted-foreground mb-6">
          What&apos;s included and excluded in this tour.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Check
                className="w-4 h-4 shrink-0 text-green-600 dark:text-green-400"
                aria-hidden
              />
              <span className="text-sm font-medium text-foreground">Inclusions</span>
            </div>
            <div
              className={cn(
                "rounded-lg border border-border p-4 space-y-3",
                "bg-brand/5 dark:bg-brand/10",
              )}
            >
              {(data.inclusion_entries ?? []).map((entry) => (
                <div key={entry.tempId} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 shrink-0 rounded-full bg-green-500/15 flex items-center justify-center dark:bg-green-400/20"
                    aria-hidden
                  >
                    <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                  </div>
                  <Input
                    value={entry.text}
                    onChange={(e) =>
                      onUpdate({
                        inclusion_entries: (data.inclusion_entries ?? []).map((row) =>
                          row.tempId === entry.tempId ? { ...row, text: e.target.value } : row,
                        ),
                      })
                    }
                    className="h-9 flex-1 min-w-0 border-input bg-background"
                    placeholder="e.g., Professional tour guide"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() =>
                      onUpdate({
                        inclusion_entries: (data.inclusion_entries ?? []).filter(
                          (row) => row.tempId !== entry.tempId,
                        ),
                      })
                    }
                    aria-label="Remove inclusion"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <button
                type="button"
                className="w-full text-left text-sm font-medium text-foreground hover:text-foreground/80"
                onClick={() =>
                  onUpdate({
                    inclusion_entries: [
                      ...(data.inclusion_entries ?? []),
                      { tempId: crypto.randomUUID(), text: "" },
                    ],
                  })
                }
              >
                + Add inclusion
              </button>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <X className="w-4 h-4 text-destructive shrink-0" aria-hidden />
              <span className="text-sm font-medium text-foreground">Exclusions</span>
            </div>
            <div
              className={cn(
                "rounded-lg border border-border p-4 space-y-3",
                "bg-brand/5 dark:bg-brand/10",
              )}
            >
              {(data.exclusion_entries ?? []).map((entry) => (
                <div key={entry.tempId} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full bg-destructive/15 flex items-center justify-center shrink-0"
                    aria-hidden
                  >
                    <X className="w-3 h-3 text-destructive" />
                  </div>
                  <Input
                    value={entry.text}
                    onChange={(e) =>
                      onUpdate({
                        exclusion_entries: (data.exclusion_entries ?? []).map((row) =>
                          row.tempId === entry.tempId ? { ...row, text: e.target.value } : row,
                        ),
                      })
                    }
                    className="h-9 flex-1 min-w-0 border-input bg-background"
                    placeholder="e.g., Personal expenses"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() =>
                      onUpdate({
                        exclusion_entries: (data.exclusion_entries ?? []).filter(
                          (row) => row.tempId !== entry.tempId,
                        ),
                      })
                    }
                    aria-label="Remove exclusion"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <button
                type="button"
                className="w-full text-left text-sm font-medium text-foreground hover:text-foreground/80"
                onClick={() =>
                  onUpdate({
                    exclusion_entries: [
                      ...(data.exclusion_entries ?? []),
                      { tempId: crypto.randomUUID(), text: "" },
                    ],
                  })
                }
              >
                + Add exclusion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <h3 className="text-base font-semibold text-foreground mb-2">Photos</h3>
        <p className="text-[13px] text-muted-foreground mb-4">
          First photo is the cover. Drag to reorder.
        </p>
        <div
          className={cn(
            "w-full border-2 border-dashed border-border rounded-lg bg-muted/30 min-h-[280px] flex flex-col items-center justify-center gap-3 p-8",
            "hover:border-primary/50 transition-colors cursor-pointer",
          )}
          onDragOver={(e) => {
            e.preventDefault();
            if (e.dataTransfer.types.includes(REORDER_DATA_TYPE)) {
              e.dataTransfer.dropEffect = "none";
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (!e.dataTransfer.types.includes(REORDER_DATA_TYPE)) {
              addFiles(e.dataTransfer.files);
            }
          }}
          onClick={() => document.getElementById("details-gallery-upload")?.click()}
        >
          <input
            id="details-gallery-upload"
            type="file"
            accept={ALLOWED_TYPES.join(",")}
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
          <Upload className="w-12 h-12 text-muted-foreground" />
          <div className="text-sm font-medium text-foreground">Drop photos here or click to upload</div>
          <div className="text-xs text-muted-foreground">PNG, JPG up to 10MB</div>
        </div>

        {photos.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {photos.map((photo, index) => (
              <div
                key={photoKey(photo)}
                draggable
                onDragStart={(e) => handlePreviewDragStart(e, index)}
                onDragEnd={handlePreviewDragEnd}
                onDragOver={(e) => handlePreviewDragOver(e, index)}
                onDrop={(e) => handlePreviewDrop(e, index)}
                className={cn(
                  "relative rounded-lg overflow-hidden bg-muted/30 w-[140px] h-[105px] shrink-0 cursor-grab active:cursor-grabbing",
                  "transition-all duration-150",
                  draggingIndex === index && "opacity-50 scale-95",
                  dragOverIndex === index &&
                    draggingIndex !== index &&
                    "ring-2 ring-primary ring-offset-2",
                )}
              >
                <img
                  src={photo.file_url}
                  alt={`Tour photo ${index + 1}`}
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none select-none"
                />
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-foreground">{index + 1}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className={cn(
                    "absolute top-2 right-2 rounded-full shadow-sm",
                    "bg-background/90 backdrop-blur-sm dark:bg-background/80",
                    "text-destructive hover:bg-destructive/10 hover:text-destructive",
                  )}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto(photoKey(photo));
                  }}
                  aria-label="Remove photo"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </FormStepLayout>
  );
}
