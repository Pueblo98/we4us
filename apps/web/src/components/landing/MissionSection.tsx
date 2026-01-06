import { motion } from 'framer-motion'
import { BookOpen, Users, TrendingUp, MessageCircleHeart } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: "Learn from Others' Journeys",
    description: "Discover what treatments and approaches have helped patients with similar profiles. Real experiences, real insights.",
    color: "primary",
  },
  {
    icon: Users,
    title: "Find Your People",
    description: "Connect with patients and caregivers who truly understand. No one should face this diagnosis alone.",
    color: "lavender",
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description: "Log symptoms, treatments, and milestones. Visualize your journey and share what works with your care team.",
    color: "healing",
  },
  {
    icon: MessageCircleHeart,
    title: "Give & Receive Support",
    description: "Your experience matters. By sharing, you help others—and find comfort in the community's embrace.",
    color: "coral",
  },
]

const colorVariants = {
  primary: "bg-primary-100 text-primary-600",
  lavender: "bg-lavender-100 text-lavender-600",
  healing: "bg-healing-100 text-healing-600",
  coral: "bg-coral-100 text-coral-600",
}

export default function MissionSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-title md:text-4xl text-slate-800 mb-4">
            Why We4Us Exists
          </h2>
          <p className="text-body-lg text-slate-600 max-w-2xl mx-auto">
            Because scattered information across support groups, waiting rooms, and online forums
            shouldn't be the norm. We're building something better, together.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="p-8 rounded-2xl bg-cream-50 border border-cream-200 hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={`w-14 h-14 rounded-xl ${colorVariants[feature.color as keyof typeof colorVariants]} flex items-center justify-center mb-5`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-heading text-slate-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-body text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <blockquote className="text-xl md:text-2xl text-slate-700 italic max-w-3xl mx-auto">
            "Because no one should navigate this diagnosis alone, and collective
            experience is too valuable to stay scattered."
          </blockquote>
        </motion.div>
      </div>
    </section>
  )
}
