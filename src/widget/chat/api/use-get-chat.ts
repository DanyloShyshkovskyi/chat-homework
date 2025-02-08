import { useEffect, useState } from 'react'

import { ChatInfo } from 'widget/chat/model/types'

import { useFirebaseAuth } from 'app/providers/with-firebase-auth'
import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore'

import { db } from 'shared/config/firebase'

export const useGetChat = (chatId: string | undefined) => {
  const [chatData, setChatData] = useState<ChatInfo | null>(null)
  const { user } = useFirebaseAuth()

  useEffect(() => {
    if (!chatId) return

    const chatRef = doc(db, 'chats', chatId)
    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      setChatData(snapshot.data() as ChatInfo)
    })

    if (user) {
      // if user exist patch user id to participants firebase chats
      updateDoc(chatRef, {
        participants: arrayUnion(user?.uid),
      })
    }

    return () => unsubscribe()
  }, [chatId, user])

  return chatData
}
