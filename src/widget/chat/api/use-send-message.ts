import { useState } from 'react'

import { useFirebaseAuth } from 'app/providers/with-firebase-auth'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

import { db } from 'shared/config/firebase'

export const useSendMessage = (chatId: string | undefined) => {
  const { user } = useFirebaseAuth()
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (message: string) => {
    if (!chatId) return

    setIsLoading(true)

    const messagesRef = collection(db, `chats/${chatId}/messages`)
    await addDoc(messagesRef, {
      text: message,
      read_by: [user?.uid],
      sender_id: user?.uid,
      timestamp: serverTimestamp(),
    })

    setIsLoading(false)
  }

  return { sendMessage, isLoading }
}
