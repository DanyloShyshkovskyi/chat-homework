// field: ControllerRenderProps<ILoginForm, 'email'>
// fieldState: ControllerFieldState
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'
import { ControllerFieldState, ControllerRenderProps } from 'react-hook-form'

import { Input } from 'shared/ui/input'
import { Label } from 'shared/ui/label'
import { cn } from 'shared/utils'

interface IInputFormItemProps {
  field: ControllerRenderProps<any, any>
  fieldState: ControllerFieldState
  label?: string
  placeholder?: string
  type?: string
}

export const InputFormItem = ({
  field,
  fieldState,
  label,
  placeholder,
  type,
}: IInputFormItemProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordType = type === 'password'

  return (
    <div className='relative flex flex-col gap-2'>
      {label && (
        <Label
          htmlFor={`input-${field.name}`}
          className={cn(fieldState.error && 'text-red-500')}
        >
          {label}
        </Label>
      )}
      <div className='relative z-[1]'>
        <Input
          {...field}
          id={`input-${field.name}`}
          type={isPasswordType && showPassword ? 'text' : type}
          placeholder={placeholder}
          className={cn({
            'pr-10': isPasswordType,
            'border-red-500 text-red-500 ring-red-500 placeholder:text-red-500 focus-visible:ring-red-500':
              fieldState.error,
          })}
        />
        {isPasswordType && (
          <button
            type='button'
            tabIndex={-1}
            onClick={() => {
              setShowPassword((prev) => !prev)
            }}
            className={cn(
              `absolute right-3 top-0 flex h-full cursor-pointer items-center font-bold text-gray-300`,
              { ['text-red-500']: fieldState.error }
            )}
          >
            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </button>
        )}
      </div>

      {fieldState.error && (
        <p className='-mt-1.5 text-xs text-red-500'>
          {fieldState.error.message}
        </p>
      )}
    </div>
  )
}
