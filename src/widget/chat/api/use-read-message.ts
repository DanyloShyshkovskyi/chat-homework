import { useFirebaseAuth } from 'app/providers/with-firebase-auth'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'

import { db } from 'shared/config/firebase'

export const useReadMessage = (chatId: string | undefined) => {
  const { user } = useFirebaseAuth()
  return async (messageId: string) => {
    if (!chatId || !user?.uid) return

    const messageRef = doc(db, 'chats', chatId, 'messages', messageId)
    await updateDoc(messageRef, {
      read_by: arrayUnion(user?.uid),
    })
  }
}
