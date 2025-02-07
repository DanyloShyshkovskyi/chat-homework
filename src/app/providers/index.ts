import compose from 'compose-function'

import { withFirebaseAuth } from './with-firebase-auth'

export const withProviders = compose(withFirebaseAuth)
