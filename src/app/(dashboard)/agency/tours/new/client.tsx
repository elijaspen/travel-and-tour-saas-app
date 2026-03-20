"use client";

import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { PageSectionHeader } from "@/components/shared/page-section-header";
import { Button } from "@/components/ui/button";
import { ROUTE_PATHS } from "@/config/routes";
import { createTourSchema } from "@/features/tours/tour.validation";
import type { CreateTourPayload } from "@/features/tours/tour.validation";

import { getTextFromHtml } from "@/components/shared/rich-text-editor";
import { StepperProgress } from "@/components/shared/stepper-progress";
import { BasicsStep } from '@/app/(dashboard)/agency/tours/components/steps/basics-step';
import { LocationStep } from '@/app/(dashboard)/agency/tours/components/steps/location-step';
import { ItineraryStep } from '@/app/(dashboard)/agency/tours/components/steps/itinerary-step';
import { PricingStep } from '@/app/(dashboard)/agency/tours/components/steps/pricing-step';
import { PublishStep } from '@/app/(dashboard)/agency/tours/components/steps/publish-step';
import { useState, useCallback } from "react";
import { CREATE_TOUR_STEPS } from "./create-tour-steps";

const defaultFormData: CreateTourPayload = {
  title: "",
  shortDescription: undefined,
  description: "",
  location: {},
  durationDays: 3,
  defaultCapacity: 15,
  maxSimultaneousBookings: 2,
  tourType: "on_demand",
  photos: [],
  itineraryDays: [],
  pricingTiers: [],
  blackoutDates: [],
  isActive: true,
};

export function CreateTourWizardClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateTourPayload>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = CREATE_TOUR_STEPS.length;
  const completedCount = currentStep - 1;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const updateForm = useCallback((updates: Partial<CreateTourPayload>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleBack = () => {
    if (!isFirstStep) setCurrentStep((s) => s - 1);
  };

  const handleNext = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleStepClick = (step: number) => {
    if (step <= completedCount + 1) setCurrentStep(step);
  };

  const handleSubmit = () => {
    const result = createTourSchema.safeParse(formData);
    if (!result.success) {
      const first = result.error.issues[0];
      toast.error(first?.message ?? "Please fix the form errors.");
      return;
    }
    setIsSubmitting(true);
    console.log("Create tour payload:", formData);
    toast.success("Tour created successfully!");
    router.push(ROUTE_PATHS.AUTHED.AGENCY.TOURS);
  };

  const getStepValidation = () => {
    if (currentStep === 1) {
      const titleOk = (formData.title?.trim().length ?? 0) >= 2;
      const descText = getTextFromHtml(formData.description ?? "");
      const descOk = descText.trim().length >= 10;
      return {
        canProceed: titleOk && descOk,
        errors: {
          title: !titleOk && formData.title ? "Min 2 characters" : undefined,
          description:
            !descOk && formData.description ? "Min 10 characters" : undefined,
        },
      };
    }
    if (currentStep === 4) {
      const hasTier = (formData.pricingTiers?.length ?? 0) >= 1;
      return { canProceed: hasTier, errors: {} };
    }
    return { canProceed: true, errors: {} };
  };

  const { canProceed } = getStepValidation();

  return (
    <div className="flex flex-col">
      <div className="px-4 sm:px-6 flex flex-col">
        <div className="flex flex-col max-w-7xl mx-auto w-full pb-28">
          <PageSectionHeader
            className="shrink-0 pt-4 pb-2"
            back={{
              href: ROUTE_PATHS.AUTHED.AGENCY.TOURS,
              label: "Tours",
            }}
            centerTitle="Create Tour"
          />
          <div className="shrink-0 py-4">
            <StepperProgress
              steps={CREATE_TOUR_STEPS}
              currentStep={currentStep}
              completedCount={completedCount}
              onStepClick={handleStepClick}
            />
          </div>

          <div className="mt-4 px-5 pt-8 pb-5 sm:px-6 sm:pt-10 sm:pb-6">
            <div key={currentStep} className="flex flex-col">
              {currentStep === 1 && (
                <BasicsStep
                  data={formData}
                  onUpdate={updateForm}
                  errors={getStepValidation().errors as { title?: string; description?: string }}
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
