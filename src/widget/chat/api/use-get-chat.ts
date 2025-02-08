import { useEffect, useState } from 'react'

import { ChatInfo } from 'widget/chat/model/types'

import { doc, onSnapshot } from 'firebase/firestore'

import { db } from 'shared/config/firebase'

export const useGetChat = (chatId: string | undefined) => {
  const [chatData, setChatData] = useState<ChatInfo | null>(null)

  useEffect(() => {
    if (!chatId) return
    const chatRef = doc(db, 'chats', chatId)
    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      setChatData(snapshot.data() as ChatInfo)
    })
    return () => unsubscribe()
  }, [chatId])

  return chatData
}
