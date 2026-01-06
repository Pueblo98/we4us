import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle } from 'lucide-react'
import { ConversationList } from './ConversationList'
import { ChatWindow } from './ChatWindow'
import { messagingApi, Conversation } from '@/services/api'

interface MessagingCenterProps {
  isOpen: boolean
  onClose: () => void
  initialUserId?: string
  initialUserName?: string
}

export function MessagingCenter({
  isOpen,
  onClose,
  initialUserId,
  initialUserName,
}: MessagingCenterProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(initialUserId || null)
  const [selectedUserName, setSelectedUserName] = useState<string>(initialUserName || '')

  useEffect(() => {
    if (isOpen) {
      loadConversations()
    }
  }, [isOpen])

  useEffect(() => {
    if (initialUserId && initialUserName) {
      setSelectedUserId(initialUserId)
      setSelectedUserName(initialUserName)
    }
  }, [initialUserId, initialUserName])

  const loadConversations = async () => {
    setIsLoading(true)
    try {
      const data = await messagingApi.getConversations()
      setConversations(data.conversations)
    } catch (err) {
      console.error('Failed to load conversations:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectConversation = (userId: string) => {
    const conversation = conversations.find((c) => c.otherUserId === userId)
    if (conversation) {
      setSelectedUserId(userId)
      setSelectedUserName(conversation.otherUserName)
    }
  }

  const handleBack = () => {
    setSelectedUserId(null)
    setSelectedUserName('')
    loadConversations() // Refresh to update unread counts
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] bg-white dark:bg-dark-300 shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-sand-200 dark:border-dark-100">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-primary-500" />
                <h2 className="font-heading text-xl text-slate-800 dark:text-cream-100">
                  Messages
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-sand-100 dark:hover:bg-dark-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {selectedUserId ? (
                <ChatWindow
                  userId={selectedUserId}
                  userName={selectedUserName}
                  onBack={handleBack}
                />
              ) : (
                <ConversationList
                  conversations={conversations}
                  selectedUserId={selectedUserId}
                  onSelectConversation={handleSelectConversation}
                  isLoading={isLoading}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
