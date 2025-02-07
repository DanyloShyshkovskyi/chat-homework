import { useEffect, useState } from 'react'

import { User, onAuthStateChanged } from 'firebase/auth'

import { auth } from 'shared/config/firebase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Handle auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setIsLoading(false)
    })

    return () => unsubscribeAuth()
  }, [user?.uid])

  return { user, isLoading }
}
