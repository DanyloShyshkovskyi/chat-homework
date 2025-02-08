import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Suspense, lazy } from 'react'
import { Outlet } from 'react-router'

import { useFirebaseAuth } from 'app/providers/with-firebase-auth'

import {
  LoadingSpinner,
  LoadingSpinnerContainer,
} from 'shared/ui/loading-spinner'
import { ScrollToTop } from 'shared/ui/scroll-to-top'
import { Skeleton } from 'shared/ui/skeleton'
import { Toaster } from 'shared/ui/sonner'

const Header = lazy(() => import('./header'))

const Layout = () => {
  const [parent] = useAutoAnimate()
  const { isLoading } = useFirebaseAuth()

  return (
    <div
      className={
        'flex min-h-screen items-center justify-center bg-blue-50 py-20'
      }
    >
      <div
        ref={parent}
        className='flex h-[calc(100vh-10rem)] max-h-[780px] min-h-96 w-full max-w-xl flex-col rounded-xl bg-white shadow-xl transition-width'
      >
        <Suspense
          fallback={
            <div className='h-24 w-full p-5'>
              <Skeleton className='h-full w-full' />
            </div>
          }
        >
          <Header />
        </Suspense>
        <main ref={parent} className='flex-1 p-5 '>
          {isLoading ? (
            <LoadingSpinnerContainer>
              <LoadingSpinner size={100} />
            </LoadingSpinnerContainer>
          ) : (
            <Outlet />
          )}
          <ScrollToTop />
        </main>
      </div>
      <Toaster />
    </div>
  )
}

export default Layout
