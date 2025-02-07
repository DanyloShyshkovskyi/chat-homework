import { Controller, useForm } from 'react-hook-form'

import { useAuthMutation } from 'widget/auth/hooks'
import { AuthFormTemplate } from 'widget/auth/templates'
import { emailValidation, passwordValidation } from 'widget/auth/utils'

import { InputFormItem } from 'features/form-item/input'

interface ILoginForm {
  email: string
  password: string
}

export const Login = () => {
  const { control, handleSubmit } = useForm<ILoginForm>()
  const { login, loginWithGoogle, error, isMutating } = useAuthMutation()

  return (
    <AuthFormTemplate
      title='Login'
      onSubmit={handleSubmit(login)}
      error={error}
      isMutating={isMutating}
      onGoogleClick={loginWithGoogle}
      submitButtonText='Login'
    >
      <Controller
        control={control}
        name='email'
        rules={emailValidation} // Type assertion to fix type error
        render={(props) => (
          <InputFormItem
            {...props}
            label='Email'
            placeholder='Provide your email'
            type='email'
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
            placeholder='Provide your password'
          />
        )}
      />
    </AuthFormTemplate>
  )
}
