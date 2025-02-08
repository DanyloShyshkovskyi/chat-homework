import { useInView } from 'react-intersection-observer'

import { useFirebaseAuth } from 'app/providers/with-firebase-auth'

import { Message, User } from '../model/types'

interface MessageItemProps {
  message: Message
  sender: User
  isOwnMessage: boolean
  showAvatar: boolean
  showSenderName: boolean
  onView: () => void
}

export const MessageItem = ({
  message,
  sender,
  isOwnMessage,
  showAvatar,
  showSenderName,
  onView,
}: MessageItemProps) => {
  const { user } = useFirebaseAuth()
  const { ref } = useInView({
    skip: isOwnMessage || message.read_by.includes(user?.uid || ''),
    triggerOnce: true,
    onChange: (inView) => {
      if (inView) {
        onView()
      }
    },
  })
  return (
    <div
      ref={ref}
      data-message-id={message.id}
      className={`flex items-center gap-3 ${
        isOwnMessage ? 'flex-row-reverse' : ''
      }`}
    >
      {showAvatar ? (
        <img
          src={sender?.avatar}
          alt={sender?.name}
          className='h-8 w-8 rounded-full'
        />
      ) : (
        <div className='h-8 w-8 bg-transparent' />
      )}
      <div
        className={`flex max-w-[70%] flex-col ${
          isOwnMessage ? 'items-end' : ''
        }`}
      >
        {showSenderName && (
          <span className='text-sm text-gray-600'>{sender?.name}</span>
        )}
        <div
          className={`relative rounded-lg px-4 py-1.5 pb-2 ${
            isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
        >
          {message.text}

          <span className='absolute bottom-0.5 right-1 text-[8px] text-gray-400'>
            {message.read_by.length > 1 ? '✓✓' : '✓'}
          </span>
        </div>
      </div>
    </div>
  )
}
