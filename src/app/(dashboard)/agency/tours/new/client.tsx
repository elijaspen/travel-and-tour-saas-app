"use client";

import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { PageSectionHeader } from "@/components/shared/page-section-header";
import { Button } from "@/components/ui/button";
import { ROUTE_PATHS } from "@/config/routes";
import { BasicsStep } from "@/app/(dashboard)/agency/tours/components/steps/basics-step";
import { ItineraryStep } from "@/app/(dashboard)/agency/tours/components/steps/itinerary-step";
import { LocationStep } from "@/app/(dashboard)/agency/tours/components/steps/location-step";
import { PricingStep } from "@/app/(dashboard)/agency/tours/components/steps/pricing-step";
import { PublishStep } from "@/app/(dashboard)/agency/tours/components/steps/publish-step";
import { getTextFromHtml } from "@/components/shared/rich-text-editor";
import { StepperProgress } from "@/components/shared/stepper-progress";
import { createTourAction } from "@/features/tours/tour.actions";
import {
  type CreateTourWizardState,
  defaultCreateTourWizardState,
} from "@/features/tours/tour.types";
import { createTourSchema } from "@/features/tours/tour.validation";
import {
  isContiguousPartition,
  pricingScaleMaxPax,
} from "@/features/tours/utils/pricing-tier-partition";
import { CREATE_TOUR_STEPS } from "./create-tour-steps";
import { isValidCountryCode } from "@/lib/geo/countries";

function wizardToJsonPayload(state: CreateTourWizardState) {
  const { inclusion_entries, exclusion_entries, photos, ...apiFields } = state;
  const orderedPhotos = [...(photos ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  return {
    ...apiFields,
    photos: orderedPhotos.map((p) => ({ id: p.id })),
    inclusions: (inclusion_entries ?? [])
      .map((e) => e.text.trim())
      .filter((s) => s.length > 0),
    exclusions: (exclusion_entries ?? [])
      .map((e) => e.text.trim())
      .filter((s) => s.length > 0),
  };
}

export function CreateTourWizardClient() {
  const router = useRouter();
  const wizardTopAnchorRef = useRef<HTMLDivElement>(null);
  const skipInitialScrollRef = useRef(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateTourWizardState>(defaultCreateTourWizardState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (skipInitialScrollRef.current) {
      skipInitialScrollRef.current = false;
      return;
    }
    wizardTopAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentStep]);

  const totalSteps = CREATE_TOUR_STEPS.length;
  const completedCount = currentStep - 1;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const updateForm = useCallback((updates: Partial<CreateTourWizardState>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleBack = () => {
    if (!isFirstStep) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    const orderedPhotos = [...(formData.photos ?? [])].sort((a, b) => a.sort_order - b.sort_order);
    if (orderedPhotos.length > 0) {
      for (const p of orderedPhotos) {
        if (!p.file) {
          toast.error("Each photo must have a file. Re-upload images if needed.");
          return;
        }
      }
    }

    const jsonPayload = wizardToJsonPayload({ ...formData, photos: orderedPhotos });
    const parsed = createTourSchema.safeParse(jsonPayload);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      toast.error(first?.message ?? "Please fix the form errors.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.set("payload", JSON.stringify(jsonPayload));
      for (const p of orderedPhotos) {
        if (p.file) fd.append("photo", p.file);
      }
      const result = await createTourAction(fd);
      if (!result.success) {
        const msg =
          result.message ??
          (result.fieldErrors
            ? Object.values(result.fieldErrors).flat().join(" ")
            : "Could not create tour.");
        toast.error(msg);
        return;
      }
      toast.success("Tour created successfully!");
      router.push(ROUTE_PATHS.AUTHED.AGENCY.TOURS);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      void handleSubmit();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleStepClick = (step: number) => {
    if (step <= completedCount + 1) setCurrentStep(step);
  };

  const getStepValidation = () => {
    if (currentStep === 1) {
      const titleOk = (formData.title?.trim().length ?? 0) >= 2;
      const descText = getTextFromHtml(formData.description ?? "");
      const descOk = descText.trim().length >= 10;
      const durationOk = (formData.duration_days ?? 0) >= 1;
      const capacityOk = (formData.default_capacity ?? 0) >= 1;
      const maxBookingsOk = (formData.max_simultaneous_bookings ?? 0) >= 1;
      return {
        canProceed:
          titleOk && descOk && durationOk && capacityOk && maxBookingsOk,
        errors: {
          title: !titleOk && formData.title ? "Min 2 characters" : undefined,
          description:
            !descOk && formData.description ? "Min 10 characters" : undefined,
        },
      };
    }
    if (currentStep === 2) {
      const cityOk = (formData.city?.trim().length ?? 0) >= 1;
      const countryOk =
        Boolean(formData.country_code) && isValidCountryCode(formData.country_code);
      return {
        canProceed: cityOk && countryOk,
        errors: {},
      };
    }
    if (currentStep === 4) {
      const maxPax = pricingScaleMaxPax(formData.default_capacity);
      const tiers = formData.pricing_tiers ?? [];
      const canProceed = isContiguousPartition(tiers, maxPax);
      return { canProceed, errors: {} };
    }
    return { canProceed: true, errors: {} };
  };

  const { canProceed } = getStepValidation();

  return (
    <div className="flex flex-col">
      <div className="px-4 sm:px-6 flex flex-col">
        <div className="flex flex-col max-w-7xl mx-auto w-full pb-28">
          <div
            ref={wizardTopAnchorRef}
            className="shrink-0 scroll-mt-4 pt-2 sm:scroll-mt-8 sm:pt-0"
          >
            <PageSectionHeader
              className="shrink-0 pt-4 pb-2"
              back={{
                href: ROUTE_PATHS.AUTHED.AGENCY.TOURS,
                label: "Tours",
              }}
              centerTitle="Create Tour"
            />
            <div className="shrink-0 py-2 sm:py-3">
              <StepperProgress
                steps={CREATE_TOUR_STEPS}
                currentStep={currentStep}
                completedCount={completedCount}
                onStepClick={handleStepClick}
              />
            </div>
          </div>

          <div className="mt-3 px-5 pt-6 pb-5 sm:px-6 sm:pt-8 sm:pb-6">
            <div key={currentStep} className="flex flex-col">
              {currentStep === 1 && (
                <BasicsStep
                  data={formData}
                  onUpdate={updateForm}
                  errors={
                    getStepValidation().errors as {
                      title?: string;
                      description?: string;
                    }
                  }
                />
              )}
              {currentStep === 2 && (
                <LocationStep data={formData} onUpdate={updateForm} />
              )}
              {currentStep === 3 && (
                <ItineraryStep data={formData} onUpdate={updateForm} />
              )}
              {currentStep === 4 && (
                <PricingStep data={formData} onUpdate={updateForm} />
              )}
              {currentStep === 5 && (
                <PublishStep data={formData} onUpdate={updateForm} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-56 right-0 z-10 px-4 sm:px-6 pb-6 pt-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <Button
            variant="outline"
            size="lg"
            disabled={isFirstStep}
            onClick={handleBack}
            className="h-10 min-w-[120px] border-zinc-800 dark:border-zinc-400"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            size="lg"
            disabled={!canProceed || isSubmitting}
            onClick={handleNext}
            className="h-10 min-w-[120px] bg-brand text-brand-foreground hover:bg-brand/90"
          >
            {isLastStep ? (
              <>
                <Check className="w-4 h-4" />
                Create Tour
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
