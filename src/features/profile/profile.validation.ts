import { z } from "zod"
import { ProfileRoles } from "@/features/profile/profile.types"


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

export type SignupFormValues = z.infer<typeof signupFormSchema>
export type SignupPayload = z.infer<typeof signupPayloadSchema>
export type LoginPayload = z.infer<typeof profileLoginSchema>

