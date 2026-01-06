import { Conversation } from '@/services/api'

interface ConversationListProps {
  conversations: Conversation[]
  selectedUserId: string | null
  onSelectConversation: (userId: string) => void
  isLoading: boolean
}

export function ConversationList({
  conversations,
  selectedUserId,
  onSelectConversation,
  isLoading,
}: ConversationListProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex items-center gap-3">
            <div className="w-12 h-12 bg-sand-200 dark:bg-dark-100 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-sand-200 dark:bg-dark-100 rounded w-24 mb-2" />
              <div className="h-3 bg-sand-200 dark:bg-dark-100 rounded w-32" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500 dark:text-cream-400 text-sm">
          No conversations yet. Start a conversation with someone from Patient Matches!
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-sand-200 dark:divide-dark-100">
      {conversations.map((conversation) => (
        <button
          key={conversation.otherUserId}
          onClick={() => onSelectConversation(conversation.otherUserId)}
          className={`w-full p-4 flex items-center gap-3 hover:bg-sand-50 dark:hover:bg-dark-200 transition-colors text-left ${
            selectedUserId === conversation.otherUserId
              ? 'bg-primary-50 dark:bg-primary-900/20'
              : ''
          }`}
        >
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
            {conversation.otherUserName.charAt(0).toUpperCase()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-slate-800 dark:text-cream-100 truncate">
                {conversation.otherUserName}
              </h3>
              <span className="text-xs text-slate-500 dark:text-cream-400 flex-shrink-0 ml-2">
                {formatTime(conversation.lastMessageAt)}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-cream-400 truncate">
              {conversation.lastMessage}
            </p>
          </div>

          {/* Unread badge */}
          {conversation.unreadCount > 0 && (
            <span className="bg-primary-500 text-white text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0">
              {conversation.unreadCount}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
