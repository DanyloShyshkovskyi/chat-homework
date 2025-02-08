import { useEffect, useState } from 'react'

import { Message } from 'widget/chat'

import { useFirebaseAuth } from 'app/providers/with-firebase-auth'
import { collection, onSnapshot } from 'firebase/firestore'

import { db } from 'shared/config/firebase'

export const useGetUnreadCount = (
  chatId: string | undefined,
  messages?: Message[] | undefined
) => {
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useFirebaseAuth()

  useEffect(() => {
    if (!chatId || !user?.uid) return

    // If messages are passed as props, filter them directly
    if (messages) {
      const unreadMessages = messages.filter(
        (message) => !message.read_by?.includes(user.uid) // Ensure read_by is not undefined
      )
      setUnreadCount(unreadMessages.length)
      return
    }

    // Firestore does not support "array does NOT contain" queries directly
    const messagesRef = collection(db, 'chats', chatId, 'messages')

    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const unreadMessages = snapshot.docs.filter(
        (doc) => !doc.data().read_by?.includes(user.uid) // Filter client-side
      )
      setUnreadCount(unreadMessages.length)
    })

    return () => unsubscribe()
  }, [chatId, user?.uid, messages])

  return unreadCount
}
