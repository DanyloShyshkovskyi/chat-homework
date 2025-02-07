import { ImageIcon } from 'lucide-react'
import { Control, Controller } from 'react-hook-form'

import { Button } from 'shared/ui/button'

import { IProfileForm } from '../model/types'

interface ProfilePhotoProps {
  control: Control<IProfileForm>
  previewUrl: string | null
  onPhotoChange: (files: FileList | null) => void
}

export const ProfilePhoto = ({
  control,
  previewUrl,
  onPhotoChange,
}: ProfilePhotoProps) => {
  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='relative h-32 w-32 overflow-hidden rounded-full bg-gray-100'>
        {previewUrl ? (
          <img
            src={previewUrl}
            alt='Profile preview'
            className='h-full w-full object-cover'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center'>
            <ImageIcon className='h-12 w-12 text-gray-400' />
          </div>
        )}
      </div>
      <Controller
        control={control}
        name='photo'
        render={({ field: { onChange, value, ...field } }) => (
          <input
            {...field}
            type='file'
            accept='image/*'
            onChange={(e) => {
              onChange(e.target.files)
              onPhotoChange(e.target.files)
            }}
            className='sr-only'
            id='photo-upload'
          />
        )}
      />
      <Button
        type='button'
        variant='outline'
        className='cursor-pointer'
        asChild
      >
        <label htmlFor='photo-upload'>Upload Photo</label>
      </Button>
    </div>
  )
}
