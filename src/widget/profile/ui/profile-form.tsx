import { Button } from 'shared/ui/button'

import { useProfileForm } from '../lib/use-profile-form'
import { ProfileNameField } from './profile-name-field'
import { ProfilePhoto } from './profile-photo'

export const ProfileForm = () => {
  const {
    control,
    handleSubmit,
    onSubmit,
    previewUrl,
    handlePhotoChange,
    isLoading,
    error,
  } = useProfileForm()

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='mx-auto flex h-full w-full max-w-md flex-1 flex-col justify-center gap-5'
    >
      <h1 className='mb-10 text-center text-2xl font-bold'>Profile Settings</h1>

      <ProfilePhoto
        control={control}
        previewUrl={previewUrl}
        onPhotoChange={handlePhotoChange}
      />

      <ProfileNameField control={control} />

      {error && (
        <div className='rounded-md bg-red-100 p-3 text-sm text-red-500'>
          {error}
        </div>
      )}

      <Button
        type='submit'
        className='w-full bg-blue-600 hover:bg-blue-700'
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}
