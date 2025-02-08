import { ChatInfo } from 'widget/chat/model/types'
import { ChatCard } from 'widget/chat/ui/chat-card'

import { PrivateRoute } from 'shared/controller'

export const Component = () => {
  // Hardcoded chat list
  const mockChats: ChatInfo[] = [
    {
      id: '1',
      title: 'Project Discussion',
    },
    {
      id: '2',
      title: 'Coffee Chat',
    },
    {
      id: '3',
      title: 'Team Hangout',
    },
  ]

  return (
    <PrivateRoute>
      <h1 className='mb-4 text-2xl font-bold'>Your Chats</h1>
      <div className='space-y-4'>
        {mockChats.map((chat) => (
          <ChatCard chat={chat} />
        ))}
      </div>
    </PrivateRoute>
  )
}
