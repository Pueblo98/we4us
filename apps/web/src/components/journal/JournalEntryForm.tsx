import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { journalApi, JournalEntry, CreateJournalEntryData } from '@/services/api'

type Mood = 'great' | 'good' | 'okay' | 'difficult' | 'rough'

interface JournalEntryFormProps {
  isOpen: boolean
  onClose: () => void
  onSaved: (entry: JournalEntry) => void
  editEntry?: JournalEntry | null
}

const moodOptions: { value: Mood; label: string; emoji: string }[] = [
  { value: 'great', label: 'Great', emoji: '😊' },
  { value: 'good', label: 'Good', emoji: '🙂' },
  { value: 'okay', label: 'Okay', emoji: '😐' },
  { value: 'difficult', label: 'Difficult', emoji: '😔' },
  { value: 'rough', label: 'Rough', emoji: '😢' },
]

export function JournalEntryForm({ isOpen, onClose, onSaved, editEntry }: JournalEntryFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState<Mood | undefined>(undefined)
  const [isPrivate, setIsPrivate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Reset form when opening or when editEntry changes
  useEffect(() => {
    if (isOpen) {
      setTitle(editEntry?.title || '')
      setContent(editEntry?.content || '')
      setMood(editEntry?.mood || undefined)
      setIsPrivate(editEntry?.isPrivate || false)
      setError('')
    }
  }, [isOpen, editEntry])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Please enter a title')
      return
    }

    if (!content.trim()) {
      setError('Please enter some content')
      return
    }

    setIsLoading(true)

    try {
      const data: CreateJournalEntryData = {
        title: title.trim(),
        content: content.trim(),
        mood,
        isPrivate,
      }

      let savedEntry: JournalEntry
      if (editEntry) {
        savedEntry = await journalApi.updateEntry(editEntry.id, data)
      } else {
        savedEntry = await journalApi.createEntry(data)
      }

      onSaved(savedEntry)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save entry')
    } finally {
      setIsLoading(false)
    }
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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-2xl bg-white dark:bg-dark-300 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-sand-200 dark:border-dark-100">
                <h2 className="font-heading text-xl text-slate-800 dark:text-cream-100">
                  {editEntry ? 'Edit Entry' : 'New Journal Entry'}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-sand-100 dark:hover:bg-dark-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {error && (
                  <div className="mb-4 p-3 bg-coral-50 dark:bg-coral-900/20 text-coral-600 dark:text-coral-400 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-cream-200 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="How are you feeling today?"
                      className="w-full px-4 py-3 border border-sand-300 dark:border-dark-50 rounded-lg bg-white dark:bg-dark-200 text-slate-800 dark:text-cream-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-cream-200 mb-2">
                      How are you feeling?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {moodOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setMood(option.value)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2 ${
                            mood === option.value
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                              : 'border-sand-200 dark:border-dark-50 hover:border-primary-300 text-slate-600 dark:text-cream-300'
                          }`}
                        >
                          <span>{option.emoji}</span>
                          <span className="text-sm">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-cream-200 mb-2">
                      Your thoughts
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write about your day, how you're feeling, any symptoms, or anything on your mind..."
                      rows={8}
                      className="w-full px-4 py-3 border border-sand-300 dark:border-dark-50 rounded-lg bg-white dark:bg-dark-200 text-slate-800 dark:text-cream-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="w-5 h-5 rounded border-sand-300 dark:border-dark-50 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-600 dark:text-cream-300">
                      Keep this entry private (only visible to you)
                    </span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-sand-200 dark:border-dark-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : editEntry ? 'Update Entry' : 'Save Entry'}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
