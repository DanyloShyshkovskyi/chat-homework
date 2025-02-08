import { ArrowDownIcon } from 'lucide-react'

import { Button } from 'shared/ui/button'
import { cn } from 'shared/utils'

export const ScrollToBottom = ({
  unreadCount,
  onClick,
  isVisible,
}: {
  unreadCount: number
  onClick: () => void
  isVisible: boolean
}) => {
  return (
    <Button
      variant={'ghost'}
      onClick={onClick}
      className={cn(
        'duration-300 absolute bottom-5 right-5 rounded-full border border-blue-500 bg-white p-2 text-blue-500 transition-opacity hover:text-blue-600',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <ArrowDownIcon className='h-6 w-6' />
      {unreadCount !== 0 && (
        <span className='absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-blue-500 px-1 py-1 text-[8px] font-bold text-white'>
          {unreadCount}
        </span>
      )}
    </Button>
  )
}
