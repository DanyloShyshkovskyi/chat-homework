import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'

import { useFirebaseAuth } from 'app/providers/with-firebase-auth'
import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore'

import { db } from 'shared/config/firebase'

interface ChatPreview {
  id: string
  title: string
}

interface ChatData {
  lastMessage?: {
    text: string
    senderName: string
  }
  read_by: string[]
  unreadCount: number
}

export const Component = () => {
  const [chatData, setChatData] = useState<Record<string, ChatData>>({})
  const { user } = useFirebaseAuth()

  // Hardcoded chat list
  const mockChats: ChatPreview[] = [
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

  // Function to mark messages as read
  const markAsRead = async (chatId: string) => {
    if (!user) return

    const chatRef = doc(db, 'chats', chatId)
    await updateDoc(chatRef, {
      read_by: arrayUnion(user.uid),
    })
  }

  useEffect(() => {
    if (!user) return

    const chatRefs = mockChats.map((chat) => doc(db, 'chats', chat.id))

    const unsubscribes = chatRefs.map((chatRef) =>
      onSnapshot(chatRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data()
          setChatData((prev) => ({
            ...prev,
            [doc.id]: {
              lastMessage: data.lastMessage || undefined,
              read_by: data.read_by || [],
              unreadCount: data.read_by?.includes(user.uid) ? 0 : 1,
            },
          }))
        }
      })
    )

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [user])

  return (
    <>
      <h1 className='mb-4 text-2xl font-bold'>Your Chats</h1>
      <div className='space-y-4'>
        {mockChats.map((chat) => {
          const data = chatData[chat.id]
          const isRead = data?.read_by?.includes(user?.uid ?? '')
          const { ref, inView } = useInView({
            threshold: 0.5,
            onChange: (inView) => {
              if (inView && !isRead) {
                markAsRead(chat.id)
              }
            },
          })

          return (
            <Link
              ref={ref}
              key={chat.id}
              to={`/chat/${chat.id}`}
              className='block rounded-lg border p-4 hover:bg-gray-50'
            >
              <div className='flex items-start justify-between'>
                <div>
                  <h2 className='font-semibold'>{chat.title}</h2>
                  {data?.lastMessage && (
                    <p className='text-gray-600'>
                      {data.lastMessage.senderName}: {data.lastMessage.text}
                      {data?.lastMessage.senderName === user?.displayName && (
                        <span className='ml-2'>{isRead ? '✓✓' : '✓'}</span>
                      )}
                    </p>
                  )}
                </div>
                {!isRead && !inView && (
                  <div className='flex flex-col items-center'>
                    <span className='text-blue-500'>↓</span>
                    <span className='rounded-full bg-blue-500 px-2 py-1 text-sm text-white'>
                      1
                    </span>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
