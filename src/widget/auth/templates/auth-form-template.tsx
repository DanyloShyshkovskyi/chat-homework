import { ChromeIcon } from 'lucide-react'
import { ReactNode } from 'react'

import { Button } from 'shared/ui/button'
import { Separator } from 'shared/ui/separator'

interface AuthFormTemplateProps {
  title: string
  onSubmit: (e: React.FormEvent) => void
  error?: string | null
  isMutating: boolean
  onGoogleClick: () => void
  submitButtonText: string
  children: ReactNode
}

export const AuthFormTemplate = ({
  title,
  onSubmit,
  error,
  isMutating,
  onGoogleClick,
  submitButtonText,
  children,
}: AuthFormTemplateProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className='flex h-full w-full flex-1 flex-col justify-center gap-5'
    >
      <h1 className='mb-10 text-center text-2xl font-bold'>{title}</h1>

      {children}

      {error && (
        <div className='rounded-md bg-red-100 p-3 text-sm text-red-500'>
          {error}
        </div>
      )}

      <Button
        type='submit'
        className='w-full bg-blue-600 hover:bg-blue-700'
        disabled={isMutating}
      >
        {isMutating ? 'Loading...' : submitButtonText}
      </Button>

      <div className='my-6 flex w-auto flex-row items-center justify-center gap-5'>
        <Separator className='w-20' />
        <span className='text-nowrap text-xs text-muted-foreground'>
          or just simply
        </span>
        <Separator className='w-20' />
      </div>

      <Button
        variant='outline'
        type='button'
        className='flex w-full items-center gap-2'
        onClick={onGoogleClick}
        disabled={isMutating}
      >
        <ChromeIcon size={16} />
        <span>{isMutating ? 'Loading...' : 'Login with Google'}</span>
      </Button>
    </form>
  )
}
