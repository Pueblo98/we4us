import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Mail, ArrowRight, Sparkles, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { useAuth } from '@/contexts/AuthContext'

type LoginMethod = 'magic-link' | 'password'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, requestMagicLink } = useAuth()

  const [loginMethod, setLoginMethod] = useState<LoginMethod>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [error, setError] = useState('')

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMagicLinkRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await requestMagicLink(email)
      setMagicLinkSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send magic link.')
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
        className="w-full max-w-md"
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
          {!magicLinkSent ? (
            <>
              <h1 className="font-heading text-heading text-center mb-2">
                Welcome Back
              </h1>
              <p className="text-center text-accessible-secondary mb-8">
                {loginMethod === 'magic-link'
                  ? 'Enter your email to receive a secure login link'
                  : 'Sign in to continue your journey'}
              </p>

              {/* Login method toggle */}
              <div className="flex rounded-lg bg-sand-100 dark:bg-dark-100 p-1 mb-6">
                <button
                  onClick={() => setLoginMethod('password')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    loginMethod === 'password'
                      ? 'bg-white dark:bg-dark-300 shadow-sm text-primary-600 dark:text-primary-400'
                      : 'text-muted hover:text-accessible-secondary'
                  }`}
                >
                  Password
                </button>
                <button
                  onClick={() => setLoginMethod('magic-link')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    loginMethod === 'magic-link'
                      ? 'bg-white dark:bg-dark-300 shadow-sm text-primary-600 dark:text-primary-400'
                      : 'text-muted hover:text-accessible-secondary'
                  }`}
                >
                  Magic Link
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800">
                  <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
                </div>
              )}

              <form
                onSubmit={loginMethod === 'password' ? handlePasswordLogin : handleMagicLinkRequest}
                className="space-y-5"
              >
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

                {loginMethod === 'password' && (
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
                        placeholder="Enter your password"
                        required
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
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                      {loginMethod === 'magic-link' ? 'Sending...' : 'Signing in...'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {loginMethod === 'magic-link' ? 'Send Magic Link' : 'Sign In'}
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>

              {loginMethod === 'password' && (
                <button
                  onClick={() => setLoginMethod('magic-link')}
                  className="w-full mt-4 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Forgot password? Use magic link instead
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-sage-500 dark:text-sage-400" />
              </div>
              <h2 className="font-heading text-heading mb-2">
                Check Your Email
              </h2>
              <p className="text-accessible-secondary mb-6">
                We've sent a secure login link to <strong className="text-accessible">{email}</strong>
              </p>
              <p className="text-sm text-muted">
                Didn't receive it?{' '}
                <button
                  onClick={() => setMagicLinkSent(false)}
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Try again
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Signup link */}
        <p className="text-center text-accessible-secondary mt-6">
          New to We4Us?{' '}
          <Link to="/signup" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
