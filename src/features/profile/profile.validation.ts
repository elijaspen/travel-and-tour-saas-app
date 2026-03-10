import { z } from "zod"
import { ProfileRoles } from "@/features/profile/profile.types"


export const profileLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const customerSignupFormSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const agencySignupFormSchema = z
  .object({
    agencyName: z.string().min(1, "Agency name is required"),
    contactPerson: z.string().min(1, "Contact person is required"),
    email: z.email(),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const signupPayloadSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(ProfileRoles.CUSTOMER),
    payload: customerSignupFormSchema,
  }),
  z.object({
    type: z.literal(ProfileRoles.BUSINESS_OWNER),
    payload: agencySignupFormSchema,
  }),
])

export type CustomerSignupFormValues = z.infer<typeof customerSignupFormSchema>
export type AgencySignupFormValues = z.infer<typeof agencySignupFormSchema>
export type SignupPayload = z.infer<typeof signupPayloadSchema>
export type LoginPayload = z.infer<typeof profileLoginSchema>

