import { MoveUpIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { IS_PRODUCTION } from 'shared/config/variables'
import { cn } from 'shared/utils'

import { Button } from './button'

export const ScrollToTop = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])
  return (
    <Button
      variant='ghost'
      aria-label='scroll-to-top'
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
      className={cn(
        'fixed right-3 z-[10] h-auto  w-9 px-4 py-1 shadow-xl transition-all',
        IS_PRODUCTION ? 'bottom-5 ' : 'bottom-16',
        'rounded-full bg-white p-2 text-gray-600',
        'border border-gray-200',
        'hover:text-blue-600',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      <span className='sr-only'>Scroll to top</span>
      <MoveUpIcon size={16} className='h-4' />
    </Button>
  )
}
