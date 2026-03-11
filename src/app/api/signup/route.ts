import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { profileService } from "@/features/profile/profile.service"
import type { ActionResult } from "@/features/shared/types"
import { Profile, ProfileRoles } from "@/features/profile/profile.types"
import { SignupPayload, signupPayloadSchema } from "@/features/profile/profile.validation"

export async function POST(req: NextRequest) {
  let parsedBody: SignupPayload

  try {
    const json = await req.json()
    parsedBody = signupPayloadSchema.parse(json)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = z.flattenError(error).fieldErrors
      const result: ActionResult = {
        success: false,
        fieldErrors,
      }
      return NextResponse.json(result, { status: 400 })
    }

    const result: ActionResult = {
      success: false,
      message: "Invalid request payload",
    }
    return NextResponse.json(result, { status: 400 })
  }

  try {
    if (parsedBody.type === ProfileRoles.CUSTOMER) {
      const { payload } = parsedBody

      const { data, error } = await profileService.signUp({
        email: payload.email,
        password: payload.password,
        profile: {
          full_name: payload.fullName,
          role: ProfileRoles.CUSTOMER,
        },
      })

      if (error || !data) {
        const result: ActionResult<Profile> = {
          success: false,
          message: error instanceof Error ? error.message : "Signup failed. Please try again.",
        }
        return NextResponse.json(result, { status: 500 })
      }

      const result: ActionResult<Profile> = {
        success: true,
        data,
      }
      return NextResponse.json(result, { status: 200 })
    }

    const { payload } = parsedBody

    const { data, error } = await profileService.signUp({
      email: payload.email,
      password: payload.password,
      profile: {
        full_name: payload.contactPerson,
        role: ProfileRoles.BUSINESS_OWNER,
        phone: payload.phone ?? null,
      },
    })

    if (error || !data) {
      const result: ActionResult<Profile> = {
        success: false,
        message: error instanceof Error ? error.message : "Signup failed. Please try again.",
      }
      return NextResponse.json(result, { status: 500 })
    }

    const result: ActionResult<Profile> = {
      success: true,
      data,
    }
    return NextResponse.json(result, { status: 200 })
  } catch {
    const result: ActionResult = {
      success: false,
      message: "Unexpected error during signup. Please try again.",
    }
    return NextResponse.json(result, { status: 500 })
  }
}

