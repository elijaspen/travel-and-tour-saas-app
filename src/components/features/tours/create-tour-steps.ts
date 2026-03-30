import { FileText, MapPin, CalendarDays, DollarSign, Send } from "lucide-react";
import type { StepConfig } from "@/components/shared/forms/stepper-progress";

export const CREATE_TOUR_STEPS: StepConfig[] = [
  { number: 1, label: "Details", icon: FileText },
  { number: 2, label: "Location", icon: MapPin },
  { number: 3, label: "Itinerary", icon: CalendarDays },
  { number: 4, label: "Pricing", icon: DollarSign },
  { number: 5, label: "Publish", icon: Send },
];
