import { Link } from 'react-router-dom'

import { useGetMessages, useGetUnreadCount } from 'widget/chat/api'
import { ChatInfo } from 'widget/chat/model/types'

export const ChatCard = ({ chat }: { chat: ChatInfo }) => {
  const unreadCount = useGetUnreadCount(chat.id)
  const { messages } = useGetMessages(chat.id)
  const lastMessage = messages[messages.length - 1]
  return (
    <Link
      key={chat.id}
      to={`/chat/${chat.id}`}
      className='block rounded-lg border p-4 hover:bg-gray-50'
    >
      <div className='flex items-start justify-between'>
        <div>
          <h2 className='font-semibold'>{chat.title}</h2>
          {lastMessage && (
            <p className='max-w-40 truncate text-gray-600'>
              <span className='text-xs'>Last message:</span> {lastMessage.text}
            </p>
          )}
        </div>
        {unreadCount !== 0 && (
          <div className='flex max-w-32 items-center gap-2 text-[10px]'>
            <span className='text-blue-500'>Unread messages</span>
            <span className='flex size-6 items-center justify-center truncate rounded-full bg-blue-500 px-2 py-1 text-white'>
              {unreadCount}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
