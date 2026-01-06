import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, BookOpen, Users, Plus, TrendingUp, Calendar, Pill, MessageCircle, Send, Loader2, Mail, LogOut, User, Settings, X } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { JournalEntryForm } from '@/components/journal/JournalEntryForm'
import { MessagingCenter } from '@/components/messaging/MessagingCenter'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { journalApi, communityApi, messagingApi, JournalEntry, DailyCheckin, CommunityPost } from '@/services/api'

type Tab = 'journal' | 'community'
type FeatureModal = 'medications' | 'appointments' | null

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('journal')
  const [showMessaging, setShowMessaging] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [featureModal, setFeatureModal] = useState<FeatureModal>(null)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const displayName = user?.displayName || user?.firstName || 'warrior'
  const initials = displayName.slice(0, 2).toUpperCase()

  useEffect(() => {
    loadUnreadCount()
  }, [])

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadUnreadCount = async () => {
    try {
      const data = await messagingApi.getUnreadCount()
      setUnreadCount(data.unreadCount)
    } catch (err) {
      console.error('Failed to load unread count:', err)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-dark-500">
      {/* Header */}
      <header className="bg-white dark:bg-dark-300 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <span className="font-heading text-xl text-slate-800 dark:text-cream-100">We4Us</span>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-sand-100 dark:bg-dark-200 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('journal')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'journal'
                    ? 'bg-white dark:bg-dark-300 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-slate-600 dark:text-cream-300 hover:text-slate-800 dark:hover:text-cream-100'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                Journal
              </button>
              <button
                onClick={() => setActiveTab('community')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'community'
                    ? 'bg-white dark:bg-dark-300 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-slate-600 dark:text-cream-300 hover:text-slate-800 dark:hover:text-cream-100'
                }`}
              >
                <Users className="w-5 h-5" />
                Community
              </button>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMessaging(true)}
                className="relative w-10 h-10 rounded-full bg-sand-100 dark:bg-dark-200 flex items-center justify-center hover:bg-sand-200 dark:hover:bg-dark-100 transition-colors"
              >
                <Mail className="w-5 h-5 text-slate-600 dark:text-cream-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <ThemeToggle />
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-10 h-10 rounded-full bg-lavender-100 dark:bg-lavender-900/30 flex items-center justify-center hover:ring-2 hover:ring-lavender-300 dark:hover:ring-lavender-700 transition-all"
                >
                  <span className="text-lavender-600 dark:text-lavender-400 font-medium">{initials}</span>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-300 rounded-xl shadow-lg border border-sand-200 dark:border-dark-100 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-sand-200 dark:border-dark-100">
                        <p className="font-medium text-slate-800 dark:text-cream-100">{displayName}</p>
                        <p className="text-sm text-slate-500 dark:text-cream-400">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false)
                          navigate('/profile')
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-cream-200 hover:bg-sand-50 dark:hover:bg-dark-200 transition-colors"
                      >
                        <User className="w-5 h-5" />
                        View Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false)
                          navigate('/settings')
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-cream-200 hover:bg-sand-50 dark:hover:bg-dark-200 transition-colors"
                      >
                        <Settings className="w-5 h-5" />
                        Settings
                      </button>
                      <div className="border-t border-sand-200 dark:border-dark-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-coral-600 dark:text-coral-400 hover:bg-coral-50 dark:hover:bg-coral-900/20 transition-colors"
                        >
                          <LogOut className="w-5 h-5" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'journal' ? (
          <JournalSection displayName={displayName} onOpenFeature={setFeatureModal} />
        ) : (
          <CommunitySection />
        )}
      </main>

      {/* Messaging Center */}
      <MessagingCenter
        isOpen={showMessaging}
        onClose={() => {
          setShowMessaging(false)
          loadUnreadCount()
        }}
      />

      {/* Feature Coming Soon Modal */}
      <AnimatePresence>
        {featureModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setFeatureModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md bg-white dark:bg-dark-300 rounded-2xl shadow-xl z-50 p-6 mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {featureModal === 'medications' ? (
                    <div className="w-12 h-12 rounded-full bg-healing-100 dark:bg-healing-900/30 flex items-center justify-center">
                      <Pill className="w-6 h-6 text-healing-600 dark:text-healing-400" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-lavender-100 dark:bg-lavender-900/30 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-lavender-600 dark:text-lavender-400" />
                    </div>
                  )}
                  <h2 className="font-heading text-xl text-slate-800 dark:text-cream-100">
                    {featureModal === 'medications' ? 'Medications' : 'Appointments'}
                  </h2>
                </div>
                <button
                  onClick={() => setFeatureModal(null)}
                  className="p-2 hover:bg-sand-100 dark:hover:bg-dark-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="text-center py-8">
                <p className="text-slate-600 dark:text-cream-300 mb-2">
                  {featureModal === 'medications'
                    ? 'Track your medications, set reminders, and monitor your treatment schedule.'
                    : 'Manage your medical appointments and get reminders for upcoming visits.'}
                </p>
                <p className="text-primary-600 dark:text-primary-400 font-medium">
                  Coming Soon!
                </p>
              </div>
              <Button className="w-full" onClick={() => setFeatureModal(null)}>
                Got it
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function JournalSection({ displayName, onOpenFeature }: { displayName: string; onOpenFeature: (feature: FeatureModal) => void }) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isLoadingEntries, setIsLoadingEntries] = useState(true)
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [error, setError] = useState('')

  // Checkin state
  const [, setTodayCheckin] = useState<DailyCheckin | null>(null)
  const [checkinValues, setCheckinValues] = useState({
    energyLevel: 5,
    painLevel: 3,
    moodLevel: 5,
    cognitiveClarity: 5,
  })
  const [isSavingCheckin, setIsSavingCheckin] = useState(false)
  const [checkinSaved, setCheckinSaved] = useState(false)
  const [checkinError, setCheckinError] = useState('')

  useEffect(() => {
    loadEntries()
    loadTodayCheckin()
  }, [])

  const loadEntries = async () => {
    try {
      const data = await journalApi.getEntries(10, 0)
      setEntries(data.entries)
      setError('')
    } catch (err) {
      console.error('Failed to load entries:', err)
      setError('Unable to connect to server. Please make sure the backend is running.')
    } finally {
      setIsLoadingEntries(false)
    }
  }

  const loadTodayCheckin = async () => {
    try {
      const checkin = await journalApi.getTodayCheckin()
      if (checkin) {
        setTodayCheckin(checkin)
        setCheckinValues({
          energyLevel: checkin.energyLevel,
          painLevel: checkin.painLevel,
          moodLevel: checkin.moodLevel,
          cognitiveClarity: checkin.cognitiveClarity,
        })
        setCheckinSaved(true)
      }
    } catch (err) {
      console.error('Failed to load checkin:', err)
    }
  }

  const handleSaveCheckin = async () => {
    setIsSavingCheckin(true)
    setCheckinError('')
    try {
      const saved = await journalApi.saveCheckin(checkinValues)
      setTodayCheckin(saved)
      setCheckinSaved(true)
    } catch (err) {
      console.error('Failed to save checkin:', err)
      setCheckinError(err instanceof Error ? err.message : 'Failed to save check-in. Please try again.')
    } finally {
      setIsSavingCheckin(false)
    }
  }

  const handleEntrySaved = (entry: JournalEntry) => {
    if (editingEntry) {
      setEntries(entries.map(e => e.id === entry.id ? entry : e))
    } else {
      setEntries([entry, ...entries])
    }
    setEditingEntry(null)
    setShowEntryForm(false)
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 mb-8 text-white">
        <h1 className="font-heading text-2xl mb-2">{getGreeting()}, {displayName}!</h1>
        <p className="opacity-90">How are you feeling today? Take a moment to check in.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <QuickActionCard
          icon={TrendingUp}
          title="Log Symptoms"
          description="How are you feeling?"
          color="coral"
          onClick={() => document.getElementById('checkin-section')?.scrollIntoView({ behavior: 'smooth' })}
        />
        <QuickActionCard
          icon={Pill}
          title="Medications"
          description="Track your meds"
          color="healing"
          onClick={() => onOpenFeature('medications')}
        />
        <QuickActionCard
          icon={Calendar}
          title="Appointments"
          description="Upcoming visits"
          color="lavender"
          onClick={() => onOpenFeature('appointments')}
        />
        <QuickActionCard
          icon={BookOpen}
          title="Journal Entry"
          description="Write your thoughts"
          color="primary"
          onClick={() => setShowEntryForm(true)}
        />
      </div>

      {/* Today's Check-in */}
      <div id="checkin-section" className="bg-white dark:bg-dark-300 rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl text-slate-800 dark:text-cream-100">Today's Check-in</h2>
          {checkinSaved && (
            <span className="text-sm text-primary-600 dark:text-primary-400">Saved</span>
          )}
        </div>

        <div className="space-y-6">
          <SymptomSlider
            label="Energy Level"
            emoji="⚡"
            value={checkinValues.energyLevel}
            onChange={(v) => {
              setCheckinValues({ ...checkinValues, energyLevel: v })
              setCheckinSaved(false)
            }}
          />
          <SymptomSlider
            label="Pain Level"
            emoji="😣"
            value={checkinValues.painLevel}
            onChange={(v) => {
              setCheckinValues({ ...checkinValues, painLevel: v })
              setCheckinSaved(false)
            }}
          />
          <SymptomSlider
            label="Mood"
            emoji="😊"
            value={checkinValues.moodLevel}
            onChange={(v) => {
              setCheckinValues({ ...checkinValues, moodLevel: v })
              setCheckinSaved(false)
            }}
          />
          <SymptomSlider
            label="Cognitive Clarity"
            emoji="🧠"
            value={checkinValues.cognitiveClarity}
            onChange={(v) => {
              setCheckinValues({ ...checkinValues, cognitiveClarity: v })
              setCheckinSaved(false)
            }}
          />
        </div>

        <div className="mt-6 pt-6 border-t border-sand-200 dark:border-dark-100">
          {checkinError && (
            <div className="mb-4 p-3 bg-coral-50 dark:bg-coral-900/20 text-coral-600 dark:text-coral-400 rounded-lg text-sm">
              {checkinError}
            </div>
          )}
          <Button
            className="w-full"
            onClick={handleSaveCheckin}
            disabled={isSavingCheckin || checkinSaved}
          >
            {isSavingCheckin ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : checkinSaved ? (
              'Check-in Saved'
            ) : (
              'Save Check-in'
            )}
          </Button>
        </div>
      </div>

      {/* Recent Journal Entries */}
      <div className="bg-white dark:bg-dark-300 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl text-slate-800 dark:text-cream-100">Recent Entries</h2>
          <Button variant="ghost" size="sm" onClick={() => setShowEntryForm(true)}>
            <Plus className="w-4 h-4 mr-1" />
            New Entry
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-coral-50 dark:bg-coral-900/20 text-coral-600 dark:text-coral-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {isLoadingEntries ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
          </div>
        ) : entries.length === 0 && !error ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300 dark:text-dark-50 mb-4" />
            <p className="text-slate-500 dark:text-cream-400 mb-4">No journal entries yet</p>
            <Button onClick={() => setShowEntryForm(true)}>
              Write your first entry
            </Button>
          </div>
        ) : entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map((entry) => (
              <JournalEntryCard
                key={entry.id}
                entry={entry}
                onClick={() => {
                  setEditingEntry(entry)
                  setShowEntryForm(true)
                }}
              />
            ))}
          </div>
        ) : null}
      </div>

      {/* Journal Entry Form Modal */}
      <JournalEntryForm
        isOpen={showEntryForm}
        onClose={() => {
          setShowEntryForm(false)
          setEditingEntry(null)
        }}
        onSaved={handleEntrySaved}
        editEntry={editingEntry}
      />
    </motion.div>
  )
}

function CommunitySection() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newPostContent, setNewPostContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [error, setError] = useState('')

  const initials = (user?.displayName || user?.firstName || 'U').slice(0, 2).toUpperCase()

  useEffect(() => {
    loadFeed()
  }, [])

  const loadFeed = async () => {
    try {
      const data = await communityApi.getFeed()
      setPosts(data.posts)
      setError('')
    } catch (err) {
      console.error('Failed to load feed:', err)
      setError('Unable to connect to server. Please make sure the backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return

    setIsPosting(true)
    setError('')
    try {
      const post = await communityApi.createPost(newPostContent.trim())
      setPosts([post, ...posts])
      setNewPostContent('')
    } catch (err) {
      console.error('Failed to create post:', err)
      setError(err instanceof Error ? err.message : 'Failed to create post. Please try again.')
    } finally {
      setIsPosting(false)
    }
  }

  const handleToggleLike = async (postId: string) => {
    try {
      const result = await communityApi.toggleLike(postId)
      setPosts(posts.map(p =>
        p.id === postId
          ? { ...p, isLiked: result.liked, likesCount: result.likesCount }
          : p
      ))
    } catch (err) {
      console.error('Failed to toggle like:', err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <div className="bg-white dark:bg-dark-300 rounded-2xl p-6 shadow-sm">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-lavender-100 dark:bg-lavender-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-lavender-600 dark:text-lavender-400 font-medium">{initials}</span>
              </div>
              <div className="flex-1">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share something with the community..."
                  className="w-full px-4 py-3 bg-sand-100 dark:bg-dark-200 rounded-xl text-slate-700 dark:text-cream-200 placeholder:text-slate-400 dark:placeholder:text-cream-500 resize-none border-0 focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
                {error && (
                  <div className="mb-3 p-3 bg-coral-50 dark:bg-coral-900/20 text-coral-600 dark:text-coral-400 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <div className="flex justify-end mt-3">
                  <Button
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() || isPosting}
                    size="sm"
                  >
                    {isPosting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-1" />
                        Post
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white dark:bg-dark-300 rounded-2xl p-12 shadow-sm text-center">
              <Users className="w-12 h-12 mx-auto text-slate-300 dark:text-dark-50 mb-4" />
              <p className="text-slate-500 dark:text-cream-400 mb-2">No posts yet</p>
              <p className="text-sm text-slate-400 dark:text-cream-500">Be the first to share something with the community!</p>
            </div>
          ) : (
            posts.map((post) => (
              <CommunityPostCard
                key={post.id}
                post={post}
                onToggleLike={() => handleToggleLike(post.id)}
              />
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Patients Like Me */}
          <div className="bg-white dark:bg-dark-300 rounded-2xl p-6 shadow-sm">
            <h3 className="font-heading text-lg text-slate-800 dark:text-cream-100 mb-4">Patients Like You</h3>
            <p className="text-sm text-slate-500 dark:text-cream-400 mb-4">Based on your profile and treatment</p>

            <div className="text-center py-6 text-slate-400 dark:text-cream-500 text-sm">
              Patient matching coming soon
            </div>

            <Button variant="ghost" className="w-full mt-4" disabled>View All Matches</Button>
          </div>

          {/* Discussion Forums */}
          <div className="bg-white dark:bg-dark-300 rounded-2xl p-6 shadow-sm">
            <h3 className="font-heading text-lg text-slate-800 dark:text-cream-100 mb-4">Forums</h3>
            <div className="space-y-2">
              <ForumLink name="Treatment Experiences" count={0} />
              <ForumLink name="Side Effect Management" count={0} />
              <ForumLink name="Caregiver Support" count={0} />
              <ForumLink name="Complementary Approaches" count={0} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Helper Components
function QuickActionCard({
  icon: Icon,
  title,
  description,
  color,
  onClick,
}: {
  icon: React.ElementType
  title: string
  description: string
  color: 'coral' | 'healing' | 'lavender' | 'primary'
  onClick?: () => void
}) {
  const colorClasses = {
    coral: 'bg-coral-50 dark:bg-coral-900/20 text-coral-600 dark:text-coral-400 hover:bg-coral-100 dark:hover:bg-coral-900/30',
    healing: 'bg-healing-50 dark:bg-healing-900/20 text-healing-600 dark:text-healing-400 hover:bg-healing-100 dark:hover:bg-healing-900/30',
    lavender: 'bg-lavender-50 dark:bg-lavender-900/20 text-lavender-600 dark:text-lavender-400 hover:bg-lavender-100 dark:hover:bg-lavender-900/30',
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30',
  }

  return (
    <button
      onClick={onClick}
      className={`p-5 rounded-xl ${colorClasses[color]} transition-colors text-left`}
    >
      <Icon className="w-6 h-6 mb-3" />
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm opacity-80">{description}</p>
    </button>
  )
}

function SymptomSlider({
  label,
  emoji,
  value,
  onChange,
}: {
  label: string
  emoji: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-slate-700 dark:text-cream-200">{emoji} {label}</span>
        <span className="text-2xl font-heading text-primary-600 dark:text-primary-400">{value}</span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-3 bg-sand-200 dark:bg-dark-100 rounded-full appearance-none cursor-pointer accent-primary-500"
      />
      <div className="flex justify-between text-xs text-slate-400 dark:text-cream-500 mt-1">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  )
}

function JournalEntryCard({
  entry,
  onClick,
}: {
  entry: JournalEntry
  onClick: () => void
}) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const moodColors: Record<string, string> = {
    great: 'bg-healing-100 dark:bg-healing-900/30 text-healing-600 dark:text-healing-400',
    good: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    okay: 'bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400',
    difficult: 'bg-coral-100 dark:bg-coral-900/30 text-coral-600 dark:text-coral-400',
    rough: 'bg-lavender-100 dark:bg-lavender-900/30 text-lavender-600 dark:text-lavender-400',
  }

  return (
    <div
      onClick={onClick}
      className="p-4 rounded-xl border border-sand-200 dark:border-dark-100 hover:border-primary-200 dark:hover:border-primary-700 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-slate-500 dark:text-cream-400">{formatDate(entry.createdAt)}</span>
        {entry.mood && (
          <span className={`px-2 py-0.5 text-xs rounded-full ${moodColors[entry.mood] || 'bg-sand-100 text-slate-600'}`}>
            {entry.mood}
          </span>
        )}
      </div>
      <h3 className="font-medium text-slate-800 dark:text-cream-100 mb-1">{entry.title}</h3>
      <p className="text-sm text-slate-600 dark:text-cream-300 line-clamp-2">{entry.content}</p>
    </div>
  )
}

function CommunityPostCard({
  post,
  onToggleLike,
}: {
  post: CommunityPost
  onToggleLike: () => void
}) {
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffHours < 48) return 'Yesterday'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const initials = post.author.displayName.split(' ').map(n => n[0]).join('').slice(0, 2)

  const getBadge = () => {
    if (post.author.userType === 'caregiver') return 'Caregiver'
    if (post.author.diagnosisTimeline === '1_year_plus') return '1+ year'
    return null
  }

  const badge = getBadge()

  return (
    <div className="bg-white dark:bg-dark-300 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-coral-100 dark:bg-coral-900/30 flex items-center justify-center flex-shrink-0">
          <span className="text-coral-600 dark:text-coral-400 font-medium">{initials}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-800 dark:text-cream-100">{post.author.displayName}</span>
            {badge && (
              <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded-full">
                {badge}
              </span>
            )}
          </div>
          <span className="text-sm text-slate-500 dark:text-cream-400">{formatTime(post.createdAt)}</span>
        </div>
      </div>
      <p className="text-slate-700 dark:text-cream-200 mb-4">{post.content}</p>
      <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-cream-400">
        <button
          onClick={onToggleLike}
          className={`flex items-center gap-1 transition-colors ${
            post.isLiked ? 'text-coral-500' : 'hover:text-coral-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
          {post.likesCount}
        </button>
        <button className="flex items-center gap-1 hover:text-primary-500 transition-colors">
          <MessageCircle className="w-4 h-4" />
          {post.commentsCount}
        </button>
      </div>
    </div>
  )
}

function ForumLink({ name, count }: { name: string; count: number }) {
  return (
    <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-sand-50 dark:hover:bg-dark-200 transition-colors text-left">
      <span className="text-slate-700 dark:text-cream-200">{name}</span>
      <span className="text-xs text-slate-400 dark:text-cream-500">{count} posts</span>
    </button>
  )
}
