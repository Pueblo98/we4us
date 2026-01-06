import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  Settings,
  Edit3,
  Save,
  X,
  LogOut,
  ChevronLeft,
  Calendar,
  Mail,
  Heart,
  Shield
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { ThemeSelector } from '@/components/common/ThemeToggle'

// Mock user data - will be replaced with real data from backend
const mockUser = {
  id: '1',
  email: 'user@example.com',
  displayName: 'Sarah M.',
  username: 'sarah_gbm_warrior',
  firstName: 'Sarah',
  lastName: 'Mitchell',
  age: 45,
  gender: 'female',
  userType: 'patient' as const,
  archetype: 'connection_seeker' as const,
  diagnosisDate: '2024-06-15',
  mgmtStatus: 'methylated' as const,
  treatmentPhase: 'maintenance' as const,
  avatarUrl: null,
  createdAt: '2024-06-20',
}

const archetypeLabels = {
  information_seeker: 'Information Seeker',
  connection_seeker: 'Connection Seeker',
  action_oriented: 'Action-Oriented',
  newly_diagnosed: 'Newly Diagnosed',
}

const mgmtLabels = {
  methylated: 'MGMT Methylated',
  unmethylated: 'MGMT Unmethylated',
  unknown: 'Unknown',
}

const treatmentPhaseLabels = {
  newly_diagnosed: 'Newly Diagnosed',
  active_treatment: 'Active Treatment',
  maintenance: 'Maintenance',
  watchful_waiting: 'Watchful Waiting',
  recurrence: 'Recurrence',
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState(mockUser)
  const [editForm, setEditForm] = useState(mockUser)

  const handleSave = () => {
    // TODO: Save to backend
    setUser(editForm)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm(user)
    setIsEditing(false)
  }

  const handleLogout = () => {
    // TODO: Clear auth state
    localStorage.removeItem('token')
    navigate('/')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="bg-surface-elevated border-b border-sand-200 dark:border-dark-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="p-2 rounded-lg hover:bg-sand-200 dark:hover:bg-dark-50 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="font-heading text-xl font-semibold">Profile</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Card */}
        <motion.div
          className="card p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-3xl font-semibold text-primary-600 dark:text-primary-400">
                  {getInitials(user.displayName)}
                </span>
              )}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-heading font-semibold mb-1">
                {user.displayName}
              </h2>
              <p className="text-accessible-secondary">@{user.username}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                <span className="px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  {user.userType === 'patient' ? 'Patient' : 'Caregiver'}
                </span>
                <span className="px-3 py-1 rounded-full text-sm bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300">
                  {archetypeLabels[user.archetype]}
                </span>
              </div>
            </div>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          {/* Edit Mode */}
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, firstName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-sand-300 dark:border-dark-50 bg-surface dark:bg-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, lastName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-sand-300 dark:border-dark-50 bg-surface dark:bg-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) =>
                      setEditForm({ ...editForm, username: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-sand-300 dark:border-dark-50 bg-surface dark:bg-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Display Name</label>
                  <input
                    type="text"
                    value={editForm.displayName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, displayName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-sand-300 dark:border-dark-50 bg-surface dark:bg-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <input
                    type="number"
                    value={editForm.age}
                    onChange={(e) =>
                      setEditForm({ ...editForm, age: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-sand-300 dark:border-dark-50 bg-surface dark:bg-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Gender</label>
                  <select
                    value={editForm.gender}
                    onChange={(e) =>
                      setEditForm({ ...editForm, gender: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-sand-300 dark:border-dark-50 bg-surface dark:bg-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-4">
                <Button variant="ghost" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </motion.div>
          ) : (
            /* View Mode */
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sand-200 dark:bg-dark-50 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-sand-600 dark:text-sand-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sand-200 dark:bg-dark-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-sand-600 dark:text-sand-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted">Member Since</p>
                    <p className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Medical Info (for patients) */}
              {user.userType === 'patient' && (
                <div className="pt-6 border-t border-sand-200 dark:border-dark-50">
                  <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500" />
                    Medical Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-sand-100 dark:bg-dark-100">
                      <p className="text-sm text-muted mb-1">Diagnosis Date</p>
                      <p className="font-medium">
                        {new Date(user.diagnosisDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-sand-100 dark:bg-dark-100">
                      <p className="text-sm text-muted mb-1">MGMT Status</p>
                      <p className="font-medium">{mgmtLabels[user.mgmtStatus]}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-sand-100 dark:bg-dark-100">
                      <p className="text-sm text-muted mb-1">Treatment Phase</p>
                      <p className="font-medium">
                        {treatmentPhaseLabels[user.treatmentPhase]}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Settings Card */}
        <motion.div
          className="card p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-heading font-semibold mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </h3>

          <div className="space-y-6">
            {/* Theme Selection */}
            <ThemeSelector />

            {/* Privacy Settings */}
            <div className="pt-6 border-t border-sand-200 dark:border-dark-50">
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Privacy
              </h4>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-accessible-secondary">
                    Show my profile to other members
                  </span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded border-sand-300 dark:border-dark-50 text-primary-500 focus:ring-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-accessible-secondary">
                    Allow patient matching suggestions
                  </span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded border-sand-300 dark:border-dark-50 text-primary-500 focus:ring-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-accessible-secondary">
                    Contribute anonymized data to research
                  </span>
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-sand-300 dark:border-dark-50 text-primary-500 focus:ring-primary-500"
                  />
                </label>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Logout Button (mobile) */}
        <div className="mt-8 sm:hidden">
          <Button
            variant="outline"
            className="w-full border-rose-300 text-rose-600 hover:bg-rose-50"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Log Out
          </Button>
        </div>
      </main>
    </div>
  )
}
