import { z } from "zod"
import { ProfileRoles } from "@/modules/profile/profile.types"

export const profileLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const signupFormSchema = z
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

export const signupPayloadSchema = z.object({
  type: z.union([
    z.literal(ProfileRoles.CUSTOMER),
    z.literal(ProfileRoles.BUSINESS_OWNER),
  ]),
  payload: signupFormSchema,
})

export const forgotPasswordSchema = z.object({
  email: z.email(),
})

export const profileUpdateSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(3, "Please enter a valid contact number").optional().or(z.literal("")),
  emergencyContact: z
    .string()
    .min(3, "Please enter a valid emergency contact")
    .optional()
    .or(z.literal("")),
})

export type SignupFormValues = z.infer<typeof signupFormSchema>
export type SignupPayload = z.infer<typeof signupPayloadSchema>
export type LoginPayload = z.infer<typeof profileLoginSchema>
export type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>
export type ProfileUpdatePayload = z.infer<typeof profileUpdateSchema>

