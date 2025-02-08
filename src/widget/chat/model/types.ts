export interface Message {
  id: string
  text: string
  sender_id: string
  timestamp: number
  read_by: string[]
  loading?: boolean
}

export interface User {
  id: string
  name: string
  avatar: string
}

export interface ChatState {
  messages: Message[]
  participants: string[]
  users: Record<string, User>
  unreadCount: number
  newMessage: string
}

export interface ChatInfo {
  id: string
  title: string
}
