import { FormEvent, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

import { auth, db } from 'shared/config/firebase'
import { ScrollArea } from 'shared/ui/scroll-area'

interface Message {
  id: string
  text: string
  sender_id: string
  timestamp: number
  read_by: string[]
}

interface User {
  name: string
  avatar: string
}

export const Component = () => {
  const { chatId } = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [participants, setParticipants] = useState<string[]>([])
  const [users, setUsers] = useState<Record<string, User>>({})
  const [newMessage, setNewMessage] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  const currentUser = auth.currentUser
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // Add scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Set up intersection observer
  useEffect(() => {
    if (!currentUser) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute('data-message-id')
            if (messageId) {
              const message = messages.find((m) => m.id === messageId)
              if (message && !message.read_by.includes(currentUser.uid)) {
                updateDoc(doc(db, 'chats', chatId!, 'messages', messageId), {
                  read_by: arrayUnion(currentUser.uid),
                })
              }
            }
          }
        })
      },
      { threshold: 0.5 }
    )

    return () => {
      observerRef.current?.disconnect()
    }
  }, [currentUser, chatId, messages])

  // Modify messages subscription to not automatically mark as read
  useEffect(() => {
    if (!chatId || !currentUser) return

    // First, check and add the user if needed (separate from listener)
    const addUserIfNeeded = async () => {
      if (!chatId || !currentUser) return

      try {
        const chatRef = doc(db, 'chats', chatId)
        const chatDoc = await getDoc(chatRef)

        if (!chatDoc.exists()) {
          console.log('Chat does not exist, creating it...')
          await setDoc(chatRef, { participants: [currentUser.uid] })
          return
        }

        const participantIds = chatDoc.data().participants || []

        if (!participantIds.includes(currentUser.uid)) {
          console.log(`Adding ${currentUser.uid} to participants...`)
          await updateDoc(chatRef, {
            participants: arrayUnion(currentUser.uid),
          })
        }
      } catch (error) {
        console.error('Error adding user to participants:', error)
      }
    }
    addUserIfNeeded()

    // Then set up the listener for future updates
    const unsubscribeChat = onSnapshot(doc(db, 'chats', chatId), (doc) => {
      if (doc.exists()) {
        const participantIds = doc.data().participants || []
        setParticipants(participantIds)
      }
    })

    // Subscribe to messages
    const messagesRef = collection(db, 'chats', chatId, 'messages')
    const unsubscribeMessages = onSnapshot(messagesRef, (snapshot) => {
      const messageList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[]

      setMessages(messageList.sort((a, b) => a.timestamp - b.timestamp))

      // Calculate unread messages (excluding own messages)
      const unreadMessages = messageList.filter(
        (msg) =>
          !msg.read_by.includes(currentUser.uid) &&
          msg.sender_id !== currentUser.uid
      )
      setUnreadCount(unreadMessages.length)

      // Only mark own messages as read automatically
      messageList.forEach((message) => {
        if (
          message.sender_id === currentUser.uid &&
          !message.read_by.includes(currentUser.uid)
        ) {
          updateDoc(doc(messagesRef, message.id), {
            read_by: arrayUnion(currentUser.uid),
          })
        }
      })
    })

    return () => {
      unsubscribeChat()
      unsubscribeMessages()
    }
  }, [chatId, currentUser])

  // Fetch user data for participants
  useEffect(() => {
    const fetchUsers = async () => {
      const userDataPromises = participants.map(async (userId) => {
        const userDoc = await getDoc(doc(db, 'users', userId))
        if (userDoc.exists()) {
          return [userId, userDoc.data() as User]
        }
        return [userId, { name: 'Unknown User', avatar: '' }]
      })

      const userData = await Promise.all(userDataPromises)
      setUsers(Object.fromEntries(userData))
    }

    if (participants.length > 0) {
      fetchUsers()
    }
  }, [participants])

  // Observe message elements
  useEffect(() => {
    messageRefs.current.forEach((element) => {
      observerRef.current?.observe(element)
    })

    return () => {
      messageRefs.current.forEach((element) => {
        observerRef.current?.unobserve(element)
      })
    }
  }, [messages])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !chatId || !currentUser) return

    try {
      const messageData = {
        text: newMessage,
        sender_id: currentUser.uid,
        timestamp: Date.now(),
        read_by: [currentUser.uid],
      }

      // Add new message
      await addDoc(collection(db, 'chats', chatId, 'messages'), messageData)
      setNewMessage('')
      // Scroll to bottom after sending
      scrollToBottom()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <section className='relative flex h-full flex-col' aria-label='Chat'>
      <ScrollArea className='-mx-2 max-h-[calc(100vh-350px)] flex-1 px-2'>
        <div className='h-full space-y-1 overflow-y-auto'>
          {messages.map((message, index) => {
            const sender = users[message.sender_id]
            const isOwnMessage = message.sender_id === currentUser?.uid

            return (
              <div
                key={message.id}
                ref={(el) => {
                  if (el) messageRefs.current.set(message.id, el)
                }}
                data-message-id={message.id}
                className={`flex items-center gap-3 ${
                  isOwnMessage ? 'flex-row-reverse' : ''
                }`}
              >
                {message.sender_id !== messages[index + 1]?.sender_id ? (
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
                  {messages[index - 1]?.sender_id !== message.sender_id && (
                    <span className='text-sm text-gray-600'>
                      {sender?.name}
                    </span>
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
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Scroll to bottom button with unread count */}
      {unreadCount > 0 && (
        <button
          onClick={scrollToBottom}
          className='absolute bottom-20 right-4 flex items-center gap-2 rounded-full bg-blue-500 px-3 py-1 text-white shadow-lg'
        >
          <span>{unreadCount}</span>
          <svg
            className='h-4 w-4'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path d='M19 14l-7 7m0 0l-7-7m7 7V3'></path>
          </svg>
        </button>
      )}

      {/* Message Input */}
      <form onSubmit={handleSubmit} className='mt-4 border-t p-4'>
        <div className='flex gap-2'>
          <input
            type='text'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder='Type a message...'
            className='flex-1 rounded-lg border p-2 focus:border-blue-500 focus:outline-none'
          />
          <button
            type='submit'
            className='rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
          >
            Send
          </button>
        </div>
      </form>
    </section>
  )
}
