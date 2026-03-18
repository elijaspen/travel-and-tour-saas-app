import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
  rightElement?: React.ReactNode
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ id, label, error, rightElement, className, ...props }, ref) => {
    const errorId = error ? `${id}-error` : undefined
    const ariaDescribedBy = [
      errorId,
      props["aria-describedby" as keyof typeof props] as string | undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={id}>{label}</Label>
          {rightElement && <div>{rightElement}</div>}
        </div>
        
        <Input 
          id={id} 
          ref={ref} 
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          className={cn(error && "border-destructive focus-visible:ring-destructive", className)} 
          {...props} 
        />
        
        {error && (
          <p id={errorId} className="text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)

FormInput.displayName = "FormInput"