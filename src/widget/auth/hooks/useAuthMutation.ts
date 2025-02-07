import { useState } from 'react'
import { useNavigate } from 'react-router'

import { handleUserAuth } from 'widget/auth/utils'

import {
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'

import { auth } from 'shared/config/firebase'
import { USER_PLACEHOLDER_IMAGE } from 'shared/config/variables'

interface LoginCredentials {
  email: string
  password: string
  name?: string
}

interface UseAuthReturn {
  login: (credentials: LoginCredentials) => Promise<UserCredential>
  loginWithGoogle: () => Promise<UserCredential>
  register: (credentials: LoginCredentials) => Promise<UserCredential>
  logout: () => Promise<void>
  error: string | null
  isMutating: boolean
}

export const useAuthMutation = (): UseAuthReturn => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      )
      await handleUserAuth(response.user)
      navigate('/')
      return response
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const provider = new GoogleAuthProvider()
      const response = await signInWithPopup(auth, provider)
      await handleUserAuth(response.user)
      navigate('/')
      return response
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      )
      await updateProfile(auth.currentUser!, {
        displayName: credentials.name || credentials.email.split('@')[0],
        photoURL: USER_PLACEHOLDER_IMAGE,
      })
      await handleUserAuth(response.user)
      navigate('/')
      return response
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await signOut(auth)
      navigate('/login')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    login,
    loginWithGoogle,
    register,
    logout,
    error,
    isMutating: isLoading,
  }
}
