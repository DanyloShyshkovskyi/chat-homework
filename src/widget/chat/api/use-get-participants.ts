import { useEffect, useState } from 'react'

import { User } from 'widget/chat'

import { doc, getDoc } from 'firebase/firestore'

import { db } from 'shared/config/firebase'

function useGetParticipants(chatId: string | undefined) {
  const [participants, setParticipants] = useState<Record<User['id'], User>>({})

  useEffect(() => {
    if (!chatId) return

    const fetchParticipants = async () => {
      try {
        const chatDoc = await getDoc(doc(db, 'chats', chatId))

        if (!chatDoc.exists()) {
          console.error('Chat document not found')
          return
        }

        const participantIds = chatDoc.data().participants || []

        // Fetch all participant users in parallel
        const userPromises = participantIds.map(async (id: string) => {
          try {
            const userDoc = await getDoc(doc(db, 'users', id))
            if (userDoc.exists()) {
              const userData = userDoc.data() as User
              return { [id]: userData }
            }
            return null
          } catch (error) {
            console.error(`Error fetching user ${id}: `, error)
            return null
          }
        })

        const userResults = (await Promise.all(userPromises)).filter(Boolean)

        // Combine all user objects into a single record
        const usersRecord = Object.assign({}, ...userResults)
        setParticipants(usersRecord)
      } catch (error) {
        console.error('Error fetching participants: ', error)
      }
    }

    fetchParticipants()
  }, [chatId])

  return participants
}

export default useGetParticipants
