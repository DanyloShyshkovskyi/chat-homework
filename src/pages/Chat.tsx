import { useParams } from 'react-router'

import { useGetChat } from 'widget/chat/api/use-get-chat'
import { MessageInput } from 'widget/chat/ui/message-input'
import { MessageList } from 'widget/chat/ui/message-list'

import { PrivateRoute } from 'shared/controller'

export const Component = () => {
  const { chatId } = useParams()
  const chat = useGetChat(chatId)
  return (
    <PrivateRoute>
      <div className='flex h-full flex-1 flex-col'>
        <div className='border-b px-4 py-2 text-xl font-bold'>
          {chat?.title}
        </div>
        <div className='flex h-full flex-1 flex-col'>
          <div className='flex h-full flex-1 flex-col gap-2'>
            <MessageList />
          </div>
          <MessageInput />
        </div>
      </div>
    </PrivateRoute>
  )
}
