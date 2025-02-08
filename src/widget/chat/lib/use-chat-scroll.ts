import { useEffect, useRef } from 'react'

import { User } from 'firebase/auth'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'

import { db } from 'shared/config/firebase'

import { Message } from '../model/types'

export const useChatScroll = (
  chatId: string | undefined,
  currentUser: User | null,
  messages: Message[]
) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    const scrollArea = scrollAreaRef.current
    if (scrollArea) {
      const { scrollTop, scrollHeight, clientHeight } = scrollArea
      const isNearBottom = scrollHeight - scrollTop <= clientHeight + 100

      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView()
      }
    }
  }

  // Set up intersection observer for read receipts
  useEffect(() => {
    if (!currentUser || !chatId) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute('data-message-id')
            if (messageId) {
              const message = messages.find((m) => m.id === messageId)
              if (message && !message.read_by.includes(currentUser.uid)) {
                updateDoc(doc(db, 'chats', chatId, 'messages', messageId), {
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

  return {
    messagesEndRef,
    messageRefs,
    scrollAreaRef,
    scrollToBottom,
  }
}
