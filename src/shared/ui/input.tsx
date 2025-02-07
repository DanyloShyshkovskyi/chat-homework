import * as React from 'react'

import { cn } from 'shared/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  ring?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ring = true, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          {
            'focus-visible:ring-bue-700 ring-blue-700 focus-visible:ring-2 focus-visible:ring-offset-2':
              ring,
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
