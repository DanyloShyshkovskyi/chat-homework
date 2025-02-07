import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { handleUserAuth } from 'widget/auth/utils'

import { useFirebaseAuth } from 'app/providers/with-firebase-auth'
import { updateProfile } from 'firebase/auth'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { toast } from 'sonner'

import { storage } from 'shared/config/firebase'

import { IProfileForm } from '../model/types'

export const useProfileForm = () => {
  const { user } = useFirebaseAuth()
  const navigate = useNavigate()

  const { control, handleSubmit } = useForm<IProfileForm>({
    defaultValues: {
      name: user?.displayName || '',
      photo: null,
    },
  })

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user?.photoURL || null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePhotoChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0]
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const onSubmit = async (data: IProfileForm) => {
    setIsLoading(true)
    setError(null)

    try {
      if (!user) throw new Error('No user found')

      let photoURL = user.photoURL

      if (data.photo && data.photo[0]) {
        const file = data.photo[0]
        const storageRef = ref(storage, `profile-photos/${user.uid}`)
        const snapshot = await uploadBytes(storageRef, file)
        photoURL = await getDownloadURL(snapshot.ref)
      }

      await updateProfile(user, {
        displayName: data.name,
        photoURL: photoURL,
      })

      await user.reload().then(() => {
        handleUserAuth(user)
        navigate('/')
      })

      toast.success('Profile updated successfully')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update profile'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    control,
    handleSubmit,
    onSubmit,
    previewUrl,
    handlePhotoChange,
    isLoading,
    error,
  }
}
