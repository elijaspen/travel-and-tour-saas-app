"use client"

import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type LabelProps = React.ComponentProps<typeof LabelPrimitive.Root> & {
  required?: boolean
}

function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-sm leading-snug font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
        <span className="min-w-0">{children}</span>
        {required ? (
          <span className="shrink-0 font-normal text-destructive" aria-hidden="true">
            *
          </span>
        ) : null}
      </span>
    </LabelPrimitive.Root>
  )
}

export { Label }
