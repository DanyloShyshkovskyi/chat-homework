import { ChromeIcon } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'

import { useAuthMutation } from 'widget/auth/hooks'
import {
  confirmPasswordValidation,
  emailValidation,
  passwordValidation,
} from 'widget/auth/utils/auth-utils'

import { InputFormItem } from 'features/form-item/input'

import { Button } from 'shared/ui/button'
import { Separator } from 'shared/ui/separator'

interface IRegisterForm {
  email: string
  password: string
  confirmPassword: string
  name: string
}

export const Component = () => {
  const { control, handleSubmit, watch } = useForm<IRegisterForm>()
  const { register, loginWithGoogle, error, isMutating } = useAuthMutation()
  const password = watch('password')

  return (
    <form
      onSubmit={handleSubmit(register)}
      className='flex h-full w-full flex-1 flex-col justify-center gap-5'
    >
      <h1 className='mb-10 text-center text-2xl font-bold'>Register</h1>
      <Controller
        control={control}
        name='email'
        rules={emailValidation}
        render={(props) => (
          <InputFormItem
            {...props}
            label='Email'
            placeholder='Enter your email'
            type='email'
          />
        )}
      />
      <Controller
        control={control}
        name='name'
        render={(props) => (
          <InputFormItem
            {...props}
            label='Name'
            placeholder='Enter your name'
            type='text'
          />
        )}
      />
      <Controller
        control={control}
        name='password'
        rules={passwordValidation}
        render={(props) => (
          <InputFormItem
            {...props}
            label='Password'
            type='password'
            placeholder='Create your password'
          />
        )}
      />
      <Controller
        control={control}
        name='confirmPassword'
        rules={confirmPasswordValidation(password)}
        render={(props) => (
          <InputFormItem
            {...props}
            label='Confirm Password'
            type='password'
            placeholder='Confirm your password'
          />
        )}
      />
      {error && (
        <div className='rounded-md bg-red-100 p-3 text-sm text-red-500'>
          {error}
        </div>
      )}
      <Button
        type='submit'
        className='w-full bg-blue-600 hover:bg-blue-700'
        disabled={isMutating}
      >
        {isMutating ? 'Loading...' : 'Register'}
      </Button>

      <div className='my-6 flex w-auto flex-row items-center justify-center gap-5'>
        <Separator className='w-20' />
        <span className='text-nowrap text-xs text-muted-foreground'>
          or just simply
        </span>
        <Separator className='w-20' />
      </div>

      <Button
        variant='outline'
        type='button'
        className='flex w-full items-center gap-2'
        onClick={loginWithGoogle}
        disabled={isMutating}
      >
        <ChromeIcon size={16} />
        <span>{isMutating ? 'Loading...' : 'Login with Google'}</span>
      </Button>
    </form>
  )
}
