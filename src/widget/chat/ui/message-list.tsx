import { useRef, useState } from 'react'
import { useParams } from 'react-router'

import { useGetMessages } from 'widget/chat/api/use-get-messages'
import useGetParticipants from 'widget/chat/api/use-get-participants'
import { useGetUnreadCount } from 'widget/chat/api/use-get-unread-count'
import { useReadMessage } from 'widget/chat/api/use-read-message'
import { ScrollToBottom } from 'widget/chat/ui/scroll-to-bottom'

import { useFirebaseAuth } from 'app/providers/with-firebase-auth'

import {
  LoadingSpinner,
  LoadingSpinnerContainer,
} from 'shared/ui/loading-spinner'
import { ScrollArea } from 'shared/ui/scroll-area'

import { MessageItem } from './message-item'

export const MessageList = () => {
  const { user } = useFirebaseAuth()
  const { chatId } = useParams()

  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { messages, isLoading } = useGetMessages(chatId, scrollAreaRef)
  const participants = useGetParticipants(chatId)

  const readMessage = useReadMessage(chatId)
  const unreadCount = useGetUnreadCount(chatId, messages)

  const [isScrollToBottomVisible, setIsScrollToBottomVisible] = useState(false)

  const handleScrollToBottom = () => {
    scrollAreaRef.current?.scrollTo({
      top: scrollAreaRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }

  const handleScroll = () => {
    if (!scrollAreaRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current
    const isNotAtBottom = scrollHeight - scrollTop - clientHeight > 10 // 10px threshold

    setIsScrollToBottomVisible(isNotAtBottom)
  }

  if (isLoading) {
    return (
      <LoadingSpinnerContainer>
        <LoadingSpinner size={100} />
      </LoadingSpinnerContainer>
    )
  }

  return (
    <div className='relative'>
      <ScrollArea
        onScroll={handleScroll}
        ref={scrollAreaRef}
        className='max-h-[500px] overflow-auto'
      >
        <div className='flex flex-col gap-1'>
          {/* {hasMore && <Button onClick={loadMoreMessages}>Load more</Button>} */}
          {messages.map((message, index) => (
            <MessageItem
              key={message.id}
              message={message}
              sender={participants?.[message.sender_id]}
              isOwnMessage={user?.uid === message.sender_id}
              showAvatar={messages[index + 1]?.sender_id !== message.sender_id}
              showSenderName={
                messages[index - 1]?.sender_id !== message.sender_id
              }
              onView={() => readMessage(message.id)}
            />
          ))}
        </div>
      </ScrollArea>
      <ScrollToBottom
        unreadCount={unreadCount}
        isVisible={isScrollToBottomVisible || unreadCount > 0}
        onClick={handleScrollToBottom}
      />
    </div>
  )
}
