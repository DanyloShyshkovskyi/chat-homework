import { ReactNode, createContext, useContext } from 'react'

import { useAuth } from 'widget/auth/hooks'

import { User } from 'firebase/auth'

interface FirebaseAuthContextType {
  user: User | null
  isLoading: boolean
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(
  undefined
)

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext)
  if (!context) {
    throw new Error(
      'useFirebaseAuth must be used within a FirebaseAuthProvider'
    )
  }
  return context
}

export const withFirebaseAuth = (component: () => ReactNode) => () => {
  const authProps = useAuth()

  return (
    <FirebaseAuthContext.Provider value={authProps}>
      {component()}
    </FirebaseAuthContext.Provider>
  )
}
