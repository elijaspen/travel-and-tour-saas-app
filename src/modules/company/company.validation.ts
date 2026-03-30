import { z } from "zod"

export const companyOnboardingSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  description: z.string().max(500, "Description must be 500 characters or less").optional().or(z.literal("")),
  contact_email: z.email("Please enter a valid email address").optional().or(z.literal("")),
  contact_phone: z
    .string()
    .min(7, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  location: z.string().min(2, "Location must be at least 2 characters").optional().or(z.literal("")),
})

export type CompanyOnboardingPayload = z.infer<typeof companyOnboardingSchema>
