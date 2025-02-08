import { useFirebaseAuth } from "app/providers/with-firebase-auth"
import { Navigate } from "react-router"
import { LoadingSpinner, LoadingSpinnerContainer } from "shared/ui/loading-spinner"

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, user } = useFirebaseAuth()

  if (isLoading) {
    return (
      <LoadingSpinnerContainer>
        <LoadingSpinner size={100} />
      </LoadingSpinnerContainer>
    )
  }

  if (!user) {
    return <Navigate to='/login' />
  }

  return children
}
