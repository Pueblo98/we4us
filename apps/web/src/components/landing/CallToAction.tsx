import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/common/Button'

export default function CallToAction() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-50 via-cream-100 to-lavender-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Heart icon */}
          <div className="w-20 h-20 rounded-full bg-coral-100 flex items-center justify-center mx-auto mb-8">
            <Heart className="w-10 h-10 text-coral-500" fill="currentColor" />
          </div>

          <h2 className="font-heading text-title md:text-4xl lg:text-5xl text-slate-800 mb-6">
            Begin Your Journey With Us
          </h2>

          <p className="text-body-lg text-slate-600 max-w-2xl mx-auto mb-10">
            Whether you're a patient seeking connection or a caregiver looking for support,
            you'll find understanding here. Join a community that truly gets it.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="xl" variant="coral" className="group">
              <Link to="/signup" className="flex items-center gap-2">
                Join as a Patient
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="healing" className="group">
              <Link to="/signup?type=caregiver" className="flex items-center gap-2">
                Join as a Caregiver
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Reassurance text */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-healing-400" />
              Free to join
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-healing-400" />
              Takes 5 minutes
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-healing-400" />
              No medical records required
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
