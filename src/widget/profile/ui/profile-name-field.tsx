import { Control, Controller } from 'react-hook-form'

import { InputFormItem } from 'features/form-item/input'

import { IProfileForm } from '../model/types'

interface ProfileNameFieldProps {
  control: Control<IProfileForm>
}

export const ProfileNameField = ({ control }: ProfileNameFieldProps) => {
  return (
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
  )
}
