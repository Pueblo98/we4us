import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Users, Shield } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { ThemeToggle } from '@/components/common/ThemeToggle'

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Theme toggle in top right */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Soft organic shapes in background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200 dark:bg-primary-800/30 rounded-full opacity-40 dark:opacity-20 blur-3xl"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 -left-32 w-80 h-80 bg-plum-200 dark:bg-plum-800/30 rounded-full opacity-30 dark:opacity-20 blur-3xl"
          animate={{ scale: [1, 1.15, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 right-1/4 w-72 h-72 bg-amber-200 dark:bg-amber-800/30 rounded-full opacity-30 dark:opacity-20 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-heading text-hero md:text-5xl lg:text-6xl mb-6 leading-tight">
            You're Not Alone in{' '}
            <span className="text-primary-500 dark:text-primary-400">This Journey</span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          className="text-body-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A caring community where GBM patients and caregivers share experiences,
          track treatment journeys, and find strength in each other's stories.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button asChild size="xl" className="shadow-xl">
            <Link to="/signup">Join Our Community</Link>
          </Button>
          <Button asChild variant="outline" size="xl">
            <Link to="/login">I'm Already a Member</Link>
          </Button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-500 dark:text-primary-400" />
            </div>
            <span className="text-body font-medium">Patient-Led Community</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center">
              <Heart className="w-6 h-6 text-sage-500 dark:text-sage-400" />
            </div>
            <span className="text-body font-medium">Shared Experiences</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-plum-100 dark:bg-plum-900/30 flex items-center justify-center">
              <Shield className="w-6 h-6 text-plum-500 dark:text-plum-400" />
            </div>
            <span className="text-body font-medium">Your Privacy, Protected</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary-300 dark:border-primary-600 flex items-start justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary-400 dark:bg-primary-500 rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
