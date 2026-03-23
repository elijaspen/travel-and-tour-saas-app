"use client";

import type { ComponentType } from "react";
import { Fragment } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepConfig = {
  number: number;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

type StepperProgressProps = {
  steps: StepConfig[];
  currentStep: number;
  completedCount: number;
  onStepClick?: (step: number) => void;
};

export function StepperProgress({
  steps,
  currentStep,
  completedCount,
  onStepClick,
}: StepperProgressProps) {
  return (
    <>
      <div className="hidden sm:block">
        <div className="flex items-center justify-between max-w-[1100px] mx-auto">
          {steps.map((step, index) => {
            const isCompleted = completedCount >= step.number;
            const isActive = currentStep === step.number;
            const isClickable = step.number <= completedCount + 1;
            const nextStepCompleted = index < steps.length - 1 && completedCount >= steps[index + 1].number;
            const lineFilled = nextStepCompleted || isCompleted;

            return (
              <Fragment key={step.number}>
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => isClickable && onStepClick?.(step.number)}
                    disabled={!isClickable}
                    aria-current={isActive ? "step" : undefined}
                    aria-label={`${step.label}${isCompleted ? ", completed" : isActive ? ", current step" : ""}`}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium shrink-0",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      isCompleted && "bg-primary text-primary-foreground",
                      isActive && !isCompleted && "bg-primary text-primary-foreground",
                      !isCompleted && !isActive && "bg-muted text-muted-foreground",
                      isClickable && "cursor-pointer",
                      !isClickable && "cursor-default"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      step.number
                    )}
                  </button>
                  <span
                    className={cn(
                      "text-base font-medium whitespace-nowrap",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 mt-[-24px]" aria-hidden>
                    <div
                      className={cn(
                        "h-full",
                        lineFilled ? "bg-primary" : "bg-muted"
                      )}
                    />
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* Mobile: progress bar + current step label */}
      <div className="flex sm:hidden flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-foreground">
            {steps[currentStep - 1]?.label ?? "Step"}
          </span>
          <span className="text-muted-foreground tabular-nums">
            {currentStep} of {steps.length}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{
              width: `${(currentStep / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </>
  );
}
