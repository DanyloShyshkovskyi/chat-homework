import { useEffect, useRef, useState } from 'react'

import { Message } from 'widget/chat'

import { useFirebaseAuth } from 'app/providers/with-firebase-auth'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'

import { db } from 'shared/config/firebase'

export const useGetMessages = (
  chatId: string | undefined,
  scrollAreaRef?: React.RefObject<HTMLDivElement>
) => {
  const { user } = useFirebaseAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const firstLoadRef = useRef<{ firstLoad: boolean }>({ firstLoad: true })

  // Load all messages at once
  useEffect(() => {
    if (!chatId) return

    setIsLoading(true)
    const messagesRef = collection(db, `chats/${chatId}/messages`)
    // Remove limit() to get all messages
    const q = query(messagesRef, orderBy('timestamp', 'desc'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messageList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[]

        setMessages(messageList.reverse())
        setIsLoading(false)
      },
      (error) => {
        console.error('Error loading messages:', error)
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [chatId])

  // Handle scroll behavior
  useEffect(() => {
    if (!scrollAreaRef) return
    if (firstLoadRef.current.firstLoad && messages.length > 0) {
      firstLoadRef.current.firstLoad = false
      scrollAreaRef.current?.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
      })
      return
    }

    if (!firstLoadRef.current.firstLoad) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.sender_id === user?.uid) {
        scrollAreaRef.current?.scrollTo({
          top: scrollAreaRef.current.scrollHeight,
        })
      }
    }
  }, [messages])

  return {
    messages,
    isLoading,
  }
}
