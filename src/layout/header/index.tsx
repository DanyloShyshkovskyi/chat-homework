import { DoorOpen, MessageSquareIcon, UserIcon } from 'lucide-react'
import { Link, NavLink, NavLinkRenderProps } from 'react-router-dom'

import { useAuthMutation } from 'widget/auth/hooks'

import { useFirebaseAuth } from 'app/providers/with-firebase-auth'

import { Avatar, AvatarFallback, AvatarImage } from 'shared/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'shared/ui/dropdown-menu'
import { Separator } from 'shared/ui/separator'
import { Skeleton } from 'shared/ui/skeleton'
import { cn, extractLetters } from 'shared/utils'

const navLinkClassName = ({ isActive }: NavLinkRenderProps) =>
  cn(
    'cursor-pointer hover:underline',
    isActive && 'pointer-events-none text-blue-600'
  )

const Header = () => {
  return (
    <header className={'flex h-24 items-center justify-between p-5'}>
      <Link to='/' className='cursor-pointer text-2xl font-bold'>
        <MessageSquareIcon size={32} />
      </Link>
      <HeaderContent />
    </header>
  )
}

const HeaderContent = () => {
  const { user, isLoading } = useFirebaseAuth()
  const { logout, isMutating } = useAuthMutation()
  console.log({ user, isLoading })

  if (isLoading) {
    return (
      <div className='flex gap-5'>
        <Skeleton className='h-10 w-24' />
        <Skeleton className='h-10 w-24' />
      </div>
    )
  }

  if (!user) {
    return (
      <div className='flex items-center gap-3 font-medium'>
        <NavLink to='/login' className={navLinkClassName}>
          Login
        </NavLink>
        <Separator orientation='vertical' className='h-5 ' />
        <NavLink to='/register' className={navLinkClassName}>
          Register
        </NavLink>
      </div>
    )
  }

  return (
    <div className='flex items-center gap-3'>
      <h1 className='max-w-64 truncate text-sm'>
        Welcome, <strong>{user.displayName}</strong>
      </h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className='cursor-pointer'>
            <AvatarImage src={user.photoURL || ''} />
            <AvatarFallback>{extractLetters(user.displayName)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='space-y-1'>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to='/profile'>
              <UserIcon size={16} />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={logout}
            className='flex items-center gap-0'
          >
            <DoorOpen size={16} />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default Header
