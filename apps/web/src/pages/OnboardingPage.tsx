import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ChevronRight, ChevronLeft, Check, User } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { ThemeToggle } from '@/components/common/ThemeToggle'

// Onboarding step types
type UserType = 'patient' | 'caregiver'
type DiagnosisTimeline = 'newly_diagnosed' | '1_month' | '3_months' | '6_months' | '1_year_plus'
type Archetype = 'information_seeker' | 'connection_seeker' | 'action_oriented' | 'newly_diagnosed'
type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say'

interface OnboardingData {
  userType: UserType
  // Personal info
  firstName?: string
  lastName?: string
  displayName?: string
  username?: string
  age?: number
  gender?: Gender
  // Medical/journey info
  diagnosisTimeline?: DiagnosisTimeline
  archetype?: Archetype
  mgmtStatus?: 'methylated' | 'unmethylated' | 'unknown'
  treatmentPhase?: string
  caregiverRelationship?: string
  supportNeeds?: string[]
  // Privacy
  shareWithCommunity?: boolean
  shareForResearch?: boolean
}

const TOTAL_STEPS = 5

export default function OnboardingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialData = location.state as { email?: string; userType?: UserType } | null

  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    userType: initialData?.userType || 'patient',
  })

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Complete onboarding - save data and navigate
      console.log('Onboarding complete:', data)
      navigate('/dashboard')
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const progress = (currentStep / TOTAL_STEPS) * 100

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="py-6 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="font-heading text-xl">We4Us</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">Step {currentStep} of {TOTAL_STEPS}</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="max-w-2xl mx-auto px-6 mb-8">
        <div className="h-2 bg-sand-200 dark:bg-dark-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-6 pb-12">
        <div className="card p-8 min-h-[450px]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <Step1PersonalInfo
                key="step1"
                data={data}
                updateData={updateData}
                onNext={nextStep}
              />
            )}
            {currentStep === 2 && (
              <Step2DiagnosisTimeline
                key="step2"
                data={data}
                updateData={updateData}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            {currentStep === 3 && (
              <Step3ArchetypeQuestions
                key="step3"
                data={data}
                updateData={updateData}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            {currentStep === 4 && (
              <Step4MedicalInfo
                key="step4"
                data={data}
                updateData={updateData}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            {currentStep === 5 && (
              <Step5Privacy
                key="step5"
                data={data}
                updateData={updateData}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

// Step 1: Personal Info
function Step1PersonalInfo({
  data,
  updateData,
  onNext,
}: {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
}) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateAndContinue = () => {
    const newErrors: Record<string, string> = {}

    if (!data.firstName?.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!data.username?.trim()) {
      newErrors.username = 'Username is required'
    } else if (data.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Auto-generate display name if not provided
    if (!data.displayName) {
      updateData({ displayName: data.firstName })
    }

    onNext()
  }

  const genderOptions: { value: Gender; label: string }[] = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'non-binary', label: 'Non-binary' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-primary-500 dark:text-primary-400" />
        </div>
        <h2 className="font-heading text-heading mb-2">
          Let's get to know you
        </h2>
        <p className="text-accessible-secondary">
          Tell us a bit about yourself to personalize your experience
        </p>
      </div>

      <div className="space-y-5 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              First Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={data.firstName || ''}
              onChange={(e) => {
                updateData({ firstName: e.target.value })
                setErrors({ ...errors, firstName: '' })
              }}
              className={`w-full px-4 py-3 rounded-lg border bg-surface dark:bg-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.firstName
                  ? 'border-rose-500'
                  : 'border-sand-300 dark:border-dark-50'
              }`}
              placeholder="Your first name"
            />
            {errors.firstName && (
              <p className="text-sm text-rose-500 mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <input
              type="text"
              value={data.lastName || ''}
              onChange={(e) => updateData({ lastName: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-sand-300 dark:border-dark-50 bg-surface dark:bg-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Optional"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Username <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">@</span>
            <input
              type="text"
              value={data.username || ''}
              onChange={(e) => {
                const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
                updateData({ username: value })
                setErrors({ ...errors, username: '' })
              }}
              className={`w-full pl-9 pr-4 py-3 rounded-lg border bg-surface dark:bg-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.username
                  ? 'border-rose-500'
                  : 'border-sand-300 dark:border-dark-50'
              }`}
              placeholder="your_username"
            />
          </div>
          {errors.username && (
            <p className="text-sm text-rose-500 mt-1">{errors.username}</p>
          )}
          <p className="text-sm text-muted mt-1">
            This is how others will find you in the community
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Display Name</label>
          <input
            type="text"
            value={data.displayName || ''}
            onChange={(e) => updateData({ displayName: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-sand-300 dark:border-dark-50 bg-surface dark:bg-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={data.firstName || 'How you want to be called'}
          />
          <p className="text-sm text-muted mt-1">
            Shown on your posts and profile (can be different from your real name)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Age</label>
            <input
              type="number"
              value={data.age || ''}
              onChange={(e) => updateData({ age: parseInt(e.target.value) || undefined })}
              className="w-full px-4 py-3 rounded-lg border border-sand-300 dark:border-dark-50 bg-surface dark:bg-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Optional"
              min={1}
              max={120}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Gender</label>
            <select
              value={data.gender || ''}
              onChange={(e) => updateData({ gender: e.target.value as Gender })}
              className="w-full px-4 py-3 rounded-lg border border-sand-300 dark:border-dark-50 bg-surface dark:bg-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select (optional)</option>
              {genderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Button onClick={validateAndContinue} className="w-full">
        Continue
        <ChevronRight className="w-5 h-5 ml-1" />
      </Button>
    </motion.div>
  )
}

// Step 2: Diagnosis Timeline
function Step2DiagnosisTimeline({
  data,
  updateData,
  onNext,
  onBack,
}: {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}) {
  const options: { value: DiagnosisTimeline; label: string; description: string }[] = [
    { value: 'newly_diagnosed', label: 'Just diagnosed', description: 'Within the last few weeks' },
    { value: '1_month', label: 'About 1 month', description: 'Starting to navigate treatment' },
    { value: '3_months', label: '3+ months', description: 'Established in treatment routine' },
    { value: '6_months', label: '6+ months', description: 'Experienced with the journey' },
    { value: '1_year_plus', label: '1+ year', description: 'Long-term survivor' },
  ]

  const handleSelect = (value: DiagnosisTimeline) => {
    updateData({ diagnosisTimeline: value })
    setTimeout(onNext, 300)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="font-heading text-heading text-center mb-2">
        How long since the diagnosis?
      </h2>
      <p className="text-center text-accessible-secondary mb-8">
        This helps us connect you with others at a similar stage
      </p>

      <div className="space-y-3">
        {options.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
              data.diagnosisTimeline === option.value
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-sand-200 dark:border-dark-50 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-sand-50 dark:hover:bg-dark-100'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">{option.label}</span>
                <p className="text-sm text-muted">{option.description}</p>
              </div>
              {data.diagnosisTimeline === option.value && (
                <Check className="w-5 h-5 text-primary-500" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-8">
        <Button variant="ghost" onClick={onBack} className="w-full">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </Button>
      </div>
    </motion.div>
  )
}

// Step 3: Archetype Questions
function Step3ArchetypeQuestions({
  data,
  updateData,
  onNext,
  onBack,
}: {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}) {
  const [selectedOption, setSelectedOption] = useState<Archetype | null>(data.archetype || null)

  const options: { value: Archetype; label: string; description: string; emoji: string }[] = [
    {
      value: 'information_seeker',
      label: 'Research everything',
      description: 'I want data, statistics, and detailed treatment information',
      emoji: '📚',
    },
    {
      value: 'connection_seeker',
      label: 'Find my people',
      description: 'I want emotional support and connection with others who understand',
      emoji: '🤝',
    },
    {
      value: 'action_oriented',
      label: 'Take action',
      description: 'I want to track, optimize, and try everything that might help',
      emoji: '🎯',
    },
    {
      value: 'newly_diagnosed',
      label: 'Just getting by',
      description: "I'm overwhelmed and just need to take it one day at a time",
      emoji: '🌱',
    },
  ]

  const handleContinue = () => {
    if (selectedOption) {
      updateData({ archetype: selectedOption })
      onNext()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="font-heading text-heading text-center mb-2">
        What matters most to you right now?
      </h2>
      <p className="text-center text-accessible-secondary mb-8">
        This helps us personalize your experience
      </p>

      <div className="space-y-3 mb-8">
        {options.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => setSelectedOption(option.value)}
            className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
              selectedOption === option.value
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-sand-200 dark:border-dark-50 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-sand-50 dark:hover:bg-dark-100'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{option.emoji}</span>
                <div>
                  <span className="font-medium">{option.label}</span>
                  <p className="text-sm text-muted">{option.description}</p>
                </div>
              </div>
              {selectedOption === option.value && (
                <Check className="w-5 h-5 text-primary-500" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </Button>
        <Button onClick={handleContinue} disabled={!selectedOption} className="flex-1">
          Continue
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </motion.div>
  )
}

// Step 4: Medical Info (Optional)
function Step4MedicalInfo({
  data,
  updateData,
  onNext,
  onBack,
}: {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}) {
  const mgmtOptions = [
    { value: 'methylated', label: 'Methylated', description: 'May respond better to temozolomide' },
    { value: 'unmethylated', label: 'Unmethylated', description: 'Different treatment considerations' },
    { value: 'unknown', label: "I don't know", description: 'That\'s okay - you can add this later' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="font-heading text-heading text-center mb-2">
        Do you know your MGMT status?
      </h2>
      <p className="text-center text-accessible-secondary mb-2">
        This helps match you with similar patients
      </p>
      <p className="text-center text-sm text-muted mb-8">
        (Optional - you can skip or update later)
      </p>

      <div className="space-y-3 mb-8">
        {mgmtOptions.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => updateData({ mgmtStatus: option.value as 'methylated' | 'unmethylated' | 'unknown' })}
            className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
              data.mgmtStatus === option.value
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-sand-200 dark:border-dark-50 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-sand-50 dark:hover:bg-dark-100'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">{option.label}</span>
                <p className="text-sm text-muted">{option.description}</p>
              </div>
              {data.mgmtStatus === option.value && (
                <Check className="w-5 h-5 text-primary-500" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </Button>
        <Button onClick={onNext} className="flex-1">
          Continue
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </motion.div>
  )
}

// Step 5: Privacy Preferences
function Step5Privacy({
  data,
  updateData,
  onNext,
  onBack,
}: {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}) {
  const [shareWithCommunity, setShareWithCommunity] = useState(data.shareWithCommunity ?? true)
  const [shareForResearch, setShareForResearch] = useState(data.shareForResearch ?? false)

  const handleFinish = () => {
    updateData({ shareWithCommunity, shareForResearch })
    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="font-heading text-heading text-center mb-2">
        Your Privacy Settings
      </h2>
      <p className="text-center text-accessible-secondary mb-8">
        You're in control - change these anytime
      </p>

      <div className="space-y-4 mb-8">
        <label className="flex items-start gap-4 p-5 rounded-xl border-2 border-sand-200 dark:border-dark-50 cursor-pointer hover:bg-sand-50 dark:hover:bg-dark-100 transition-colors">
          <input
            type="checkbox"
            checked={shareWithCommunity}
            onChange={(e) => setShareWithCommunity(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-sand-300 dark:border-dark-50 text-primary-500 focus:ring-primary-500"
          />
          <div>
            <span className="font-medium block">Share with community</span>
            <p className="text-sm text-muted">
              Allow other members to see your profile and treatment timeline (your name can stay anonymous)
            </p>
          </div>
        </label>

        <label className="flex items-start gap-4 p-5 rounded-xl border-2 border-sand-200 dark:border-dark-50 cursor-pointer hover:bg-sand-50 dark:hover:bg-dark-100 transition-colors">
          <input
            type="checkbox"
            checked={shareForResearch}
            onChange={(e) => setShareForResearch(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-sand-300 dark:border-dark-50 text-primary-500 focus:ring-primary-500"
          />
          <div>
            <span className="font-medium block">Contribute to research</span>
            <p className="text-sm text-muted">
              Allow anonymized data to help improve GBM treatment understanding (we'll ask before specific studies)
            </p>
          </div>
        </label>
      </div>

      <div className="bg-sage-50 dark:bg-sage-900/20 rounded-xl p-4 mb-8">
        <p className="text-sm text-sage-700 dark:text-sage-300">
          <strong>Your privacy matters.</strong> You can always adjust these settings and we never sell your personal information.
          <a href="/privacy" className="text-primary-600 dark:text-primary-400 ml-1 underline">Learn more</a>
        </p>
      </div>

      <div className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </Button>
        <Button onClick={handleFinish} variant="secondary" className="flex-1">
          Enter Community
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </motion.div>
  )
}
