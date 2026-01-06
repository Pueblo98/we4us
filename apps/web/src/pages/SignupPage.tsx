import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Mail, ArrowRight, User, Users, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { useAuth } from '@/contexts/AuthContext'

export default function SignupPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { signup } = useAuth()
  const initialType = searchParams.get('type') === 'caregiver' ? 'caregiver' : null

  const [step, setStep] = useState<'type' | 'email'>(initialType ? 'email' : 'type')
  const [userType, setUserType] = useState<'patient' | 'caregiver' | null>(initialType as 'patient' | 'caregiver' | null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleTypeSelect = (type: 'patient' | 'caregiver') => {
    setUserType(type)
    setStep('email')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (!userType) {
      setError('Please select whether you are a patient or caregiver')
      return
    }

    setIsSubmitting(true)
    try {
      await signup(email, password, userType)
      // After successful signup, navigate to onboarding
      // AuthContext will have set the user, so we can navigate directly
      navigate('/onboarding', { state: { email, userType }, replace: true })
    } catch (err) {
      // Handle network errors and API errors
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Unable to connect to server. Please make sure the backend is running.')
      } else {
        setError(err instanceof Error ? err.message : 'Signup failed. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center px-6 py-12">
      {/* Theme toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" fill="currentColor" />
          </div>
          <span className="font-heading text-2xl">We4Us</span>
        </Link>

        {/* Card */}
        <div className="card p-8">
          {step === 'type' ? (
            <>
              <h1 className="font-heading text-heading text-center mb-2">
                Join Our Community
              </h1>
              <p className="text-center text-accessible-secondary mb-8">
                Tell us about yourself so we can personalize your experience
              </p>

              <div className="grid gap-4">
                <motion.button
                  onClick={() => handleTypeSelect('patient')}
                  className="p-6 rounded-xl border-2 border-sand-200 dark:border-dark-50 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-left group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/40 transition-colors">
                      <User className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg mb-1">
                        I'm a Patient
                      </h3>
                      <p className="text-accessible-secondary">
                        I've been diagnosed with GBM and want to connect with others on this journey.
                      </p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => handleTypeSelect('caregiver')}
                  className="p-6 rounded-xl border-2 border-sand-200 dark:border-dark-50 hover:border-sage-400 dark:hover:border-sage-600 hover:bg-sage-50 dark:hover:bg-sage-900/20 transition-all text-left group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-sage-200 dark:group-hover:bg-sage-800/40 transition-colors">
                      <Users className="w-7 h-7 text-sage-600 dark:text-sage-400" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg mb-1">
                        I'm a Caregiver
                      </h3>
                      <p className="text-accessible-secondary">
                        I'm supporting someone with GBM and looking for resources and community.
                      </p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep('type')}
                className="text-muted hover:text-accessible-secondary mb-4 flex items-center gap-1"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back
              </button>

              <h1 className="font-heading text-heading text-center mb-2">
                {userType === 'patient' ? 'Welcome, Warrior' : 'Welcome, Caregiver'}
              </h1>
              <p className="text-center text-accessible-secondary mb-8">
                Create your account to get started
              </p>

              {error && (
                <div className="mb-6 p-4 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800">
                  <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-sand-300 dark:border-dark-50 bg-surface dark:bg-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all text-body"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                      minLength={8}
                      className="w-full pl-12 pr-12 py-4 rounded-xl border border-sand-300 dark:border-dark-50 bg-surface dark:bg-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all text-body"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-accessible-secondary"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-sand-300 dark:border-dark-50 bg-surface dark:bg-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all text-body"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  variant={userType === 'patient' ? 'default' : 'secondary'}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Creating account...'
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Account
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>

              <p className="text-xs text-center text-muted mt-6">
                By signing up, you agree to our{' '}
                <Link to="/terms" className="underline hover:text-primary-600 dark:hover:text-primary-400">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="underline hover:text-primary-600 dark:hover:text-primary-400">Privacy Policy</Link>
              </p>
            </>
          )}
        </div>

        {/* Login link */}
        <p className="text-center text-accessible-secondary mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
