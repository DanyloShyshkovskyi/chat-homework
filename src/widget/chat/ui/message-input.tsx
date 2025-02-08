import { FormEvent, useRef, useState } from 'react'
import { useParams } from 'react-router'

import { useSendMessage } from 'widget/chat/api'

import { Button } from 'shared/ui/button'
import { Input } from 'shared/ui/input'

export const MessageInput = () => {
  const { chatId } = useParams()
  const { sendMessage, isLoading } = useSendMessage(chatId)
  const [newMessage, setNewMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    sendMessage(newMessage).then(() => {
      setNewMessage('')
      inputRef.current?.focus()
    })
  }

  return (
    <form onSubmit={handleSubmit} className='mt-4 border-t p-4'>
      <div className='flex gap-2'>
        <Input
          ref={inputRef}
          type='text'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder='Type a message...'
          className='flex-1 rounded-lg border p-2 focus:border-blue-500 focus:outline-none'
        />
        <Button
          type='submit'
          disabled={isLoading || newMessage.trim() === ''}
          className='rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </form>
  )
}
