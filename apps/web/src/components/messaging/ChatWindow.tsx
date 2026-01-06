import { useState, useEffect, useRef } from 'react'
import { Send, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { MessageBubble } from './MessageBubble'
import { messagingApi, Message } from '@/services/api'

interface ChatWindowProps {
  userId: string
  userName: string
  onBack: () => void
}

export function ChatWindow({ userId, userName, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
  }, [userId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    setIsLoading(true)
    try {
      const data = await messagingApi.getMessages(userId)
      setMessages(data.messages)
    } catch (err) {
      console.error('Failed to load messages:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    try {
      const sentMessage = await messagingApi.sendMessage(userId, newMessage.trim())
      setMessages((prev) => [...prev, sentMessage])
      setNewMessage('')
    } catch (err) {
      console.error('Failed to send message:', err)
    } finally {
      setIsSending(false)
    }
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = []
    let currentDate = ''

    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })

      if (messageDate !== currentDate) {
        currentDate = messageDate
        groups.push({ date: messageDate, messages: [message] })
      } else {
        groups[groups.length - 1].messages.push(message)
      }
    })

    return groups
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-sand-200 dark:border-dark-100">
        <button
          onClick={onBack}
          className="p-2 hover:bg-sand-100 dark:hover:bg-dark-200 rounded-lg transition-colors md:hidden"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-cream-300" />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="font-medium text-slate-800 dark:text-cream-100">{userName}</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-slate-500 dark:text-cream-400">
                No messages yet. Start the conversation!
              </p>
            </div>
          </div>
        ) : (
          groupMessagesByDate(messages).map((group) => (
            <div key={group.date}>
              <div className="flex items-center justify-center my-4">
                <span className="text-xs text-slate-500 dark:text-cream-400 bg-sand-100 dark:bg-dark-200 px-3 py-1 rounded-full">
                  {group.date}
                </span>
              </div>
              <div className="space-y-2">
                {group.messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-sand-200 dark:border-dark-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-sand-300 dark:border-dark-50 rounded-full bg-white dark:bg-dark-200 text-slate-800 dark:text-cream-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="rounded-full w-12 h-12 p-0 flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}
