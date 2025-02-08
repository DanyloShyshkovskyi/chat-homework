import { useEffect, useState } from 'react'

import { User as AuthUser } from 'firebase/auth'
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

import { db } from 'shared/config/firebase'

import { ChatState, Message, User } from '../model/types'

export const useChatMessages = (
  chatId: string | undefined,
  currentUser: AuthUser | null
) => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    participants: [],
    users: {},
    unreadCount: 0,
    newMessage: '',
  })

  // Add user to chat if needed
  useEffect(() => {
    if (!chatId || !currentUser) return

    const addUserIfNeeded = async () => {
      try {
        const chatRef = doc(db, 'chats', chatId)
        const chatDoc = await getDoc(chatRef)

        if (!chatDoc.exists()) {
          await setDoc(chatRef, { participants: [currentUser.uid] })
          return
        }

        const participantIds = chatDoc.data().participants || []

        if (!participantIds.includes(currentUser.uid)) {
          await updateDoc(chatRef, {
            participants: arrayUnion(currentUser.uid),
          })
        }
      } catch (error) {
        console.error('Error adding user to participants:', error)
      }
    }
    addUserIfNeeded()
  }, [chatId, currentUser])

  // Subscribe to chat and messages
  useEffect(() => {
    if (!chatId || !currentUser) return

    const unsubscribeChat = onSnapshot(doc(db, 'chats', chatId), (doc) => {
      if (doc.exists()) {
        const participantIds = doc.data().participants || []
        setState((prev) => ({ ...prev, participants: participantIds }))
      }
    })

    const messagesRef = collection(db, 'chats', chatId, 'messages')
    const unsubscribeMessages = onSnapshot(messagesRef, (snapshot) => {
      const messageList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[]

      const sortedMessages = messageList.sort(
        (a, b) => a.timestamp - b.timestamp
      )

      const unreadMessages = messageList.filter(
        (msg) =>
          !msg.read_by.includes(currentUser.uid) &&
          msg.sender_id !== currentUser.uid
      )

      setState((prev) => ({
        ...prev,
        messages: sortedMessages,
        unreadCount: unreadMessages.length,
      }))

      // Mark own messages as read automatically
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
      const userDataPromises = state.participants.map(async (userId) => {
        const userDoc = await getDoc(doc(db, 'users', userId))
        if (userDoc.exists()) {
          return [userId, userDoc.data() as User]
        }
        return [userId, { name: 'Unknown User', avatar: '' }]
      })

      const userData = await Promise.all(userDataPromises)
      setState((prev) => ({ ...prev, users: Object.fromEntries(userData) }))
    }

    if (state.participants.length > 0) {
      fetchUsers()
    }
  }, [state.participants])

  const sendMessage = async (text: string) => {
    if (!text.trim() || !chatId || !currentUser) return

    try {
      const messageData = {
        text,
        sender_id: currentUser.uid,
        timestamp: Date.now(),
        read_by: [currentUser.uid],
      }

      await addDoc(collection(db, 'chats', chatId, 'messages'), messageData)
      setState((prev) => ({ ...prev, newMessage: '' }))
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const setNewMessage = (message: string) => {
    setState((prev) => ({ ...prev, newMessage: message }))
  }

  return {
    ...state,
    sendMessage,
    setNewMessage,
  }
}
