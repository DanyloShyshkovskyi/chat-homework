import { RouterProvider } from 'react-router'

import { withProviders } from 'app/providers'
import { router } from 'router'

import './index.css'

const App = () => <RouterProvider router={router} />

export default withProviders(App)
