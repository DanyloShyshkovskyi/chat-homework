import { PrivateRoute } from 'shared/controller'
import { ProfileForm } from 'widget/profile'

export const Component = () => {
  return (
    <PrivateRoute>
      <ProfileForm />
    </PrivateRoute>
  )
}
