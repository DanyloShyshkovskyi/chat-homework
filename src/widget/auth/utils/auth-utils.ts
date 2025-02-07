import { User } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

import { db } from 'shared/config/firebase'

export const emailValidation = {
  required: 'Email is required',
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Invalid email address',
  },
}

export const passwordValidation = {
  required: 'Password is required',
  minLength: {
    value: 8,
    message: 'Password must be at least 8 characters',
  },
}

export const confirmPasswordValidation = (password: string) => ({
  required: 'Please confirm your password',
  validate: (value: string) => value === password || 'Passwords do not match',
})

export const handleUserAuth = async (user: User | null) => {
  if (!user) return

  const userRef = doc(db, 'users', user.uid)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    // Create new user document if it doesn't exist
    await setDoc(userRef, {
      name: user.displayName || 'Anonymous',
      avatar: user.photoURL || '',
      email: user.email,
      createdAt: Date.now(),
    })
  } else {
    // Optionally update existing user data
    // For example, if they changed their profile picture
    await setDoc(
      userRef,
      {
        name: user.displayName || 'Anonymous',
        avatar: user.photoURL || '',
        email: user.email,
      },
      { merge: true }
    )
  }
}
