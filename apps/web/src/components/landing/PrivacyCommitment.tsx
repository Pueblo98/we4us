import { motion } from 'framer-motion'
import { Shield, Lock, Eye, UserCheck, Trash2, Settings } from 'lucide-react'

const privacyPrinciples = [
  {
    icon: Lock,
    title: "Your Data, Encrypted",
    description: "Industry-standard encryption protects your health information at rest and in transit.",
  },
  {
    icon: Eye,
    title: "You Control Visibility",
    description: "Choose exactly what to share and with whom. Stay anonymous or connect openly—your choice.",
  },
  {
    icon: UserCheck,
    title: "No Selling Your Data",
    description: "We never sell your personal information to third parties. Period.",
  },
  {
    icon: Settings,
    title: "Granular Consent",
    description: "Fine-tune your privacy settings anytime. Share with the community, research, or keep private.",
  },
  {
    icon: Trash2,
    title: "Right to Be Forgotten",
    description: "Request deletion of your data anytime. We honor your wishes, no questions asked.",
  },
  {
    icon: Shield,
    title: "HIPAA-Informed Design",
    description: "Built with healthcare privacy standards in mind, from day one.",
  },
]

export default function PrivacyCommitment() {
  return (
    <section className="py-24 bg-gradient-to-b from-lavender-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header with shield icon */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 rounded-full bg-lavender-100 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-lavender-500" />
          </div>
          <h2 className="font-heading text-title md:text-4xl text-slate-800 mb-4">
            Your Privacy is Sacred
          </h2>
          <p className="text-body-lg text-slate-600 max-w-2xl mx-auto">
            We understand the sensitivity of health data, especially for GBM patients and families.
            Your trust is the foundation of our community.
          </p>
        </motion.div>

        {/* Privacy principles grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {privacyPrinciples.map((principle, index) => (
            <motion.div
              key={principle.title}
              className="p-6 rounded-xl bg-white shadow-sm border border-lavender-100 hover:border-lavender-200 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <principle.icon className="w-8 h-8 text-lavender-500 mb-4" />
              <h3 className="font-heading text-lg text-slate-800 mb-2">
                {principle.title}
              </h3>
              <p className="text-slate-600">
                {principle.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust badge */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-slate-500 text-sm">
            Questions about privacy?{' '}
            <a href="/privacy" className="text-lavender-600 hover:text-lavender-700 underline">
              Read our full privacy policy
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
