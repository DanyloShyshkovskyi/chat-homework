import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'

import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from 'shared/utils'

import { LoadingSpinner } from './loading-spinner'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-black text-white hover:bg-black/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-9 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

const ButtonLoading = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { animate?: boolean }
>(({ disabled, children, className, animate = true, ...props }, ref) => {
  const [parent] = useAutoAnimate()
  return (
    <Button
      ref={animate ? parent : null}
      disabled={disabled}
      className={cn('relative gap-3', className)}
      {...props}
    >
      <span>{children}</span>
      {disabled && <LoadingSpinner size={16} className='text-white' />}
    </Button>
  )
})

Button.displayName = 'Button'

export { Button, ButtonLoading, buttonVariants }
