import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'

// Mock memorial data - will be replaced with API data
const memorialData = [
  { id: 1, name: "Sarah M.", dates: "1975 - 2024", x: 15, y: 25 },
  { id: 2, name: "Michael T.", dates: "1968 - 2023", x: 35, y: 45 },
  { id: 3, name: "Jennifer L.", dates: "1982 - 2024", x: 55, y: 20 },
  { id: 4, name: "Robert K.", dates: "1955 - 2023", x: 75, y: 55 },
  { id: 5, name: "Patricia W.", dates: "1971 - 2024", x: 25, y: 65 },
  { id: 6, name: "David H.", dates: "1963 - 2023", x: 45, y: 75 },
  { id: 7, name: "Linda S.", dates: "1978 - 2024", x: 65, y: 35 },
  { id: 8, name: "James B.", dates: "1950 - 2023", x: 85, y: 25 },
  { id: 9, name: "Mary C.", dates: "1966 - 2024", x: 20, y: 85 },
  { id: 10, name: "William D.", dates: "1973 - 2023", x: 50, y: 50 },
  { id: 11, name: "Elizabeth R.", dates: "1980 - 2024", x: 70, y: 70 },
  { id: 12, name: "Thomas F.", dates: "1958 - 2023", x: 40, y: 15 },
]

interface StarProps {
  star: typeof memorialData[0]
  onHover: (id: number | null) => void
  isHovered: boolean
}

function MemorialStar({ star, onHover, isHovered }: StarProps) {
  // Random twinkle delay for each star
  const delay = useMemo(() => Math.random() * 3, [])
  const size = useMemo(() => 8 + Math.random() * 8, [])

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: `${star.x}%`, top: `${star.y}%` }}
      onMouseEnter={() => onHover(star.id)}
      onMouseLeave={() => onHover(null)}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: star.id * 0.1 }}
    >
      {/* Star glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-white blur-md"
        style={{ width: size * 2, height: size * 2, marginLeft: -size / 2, marginTop: -size / 2 }}
        animate={{
          opacity: isHovered ? [0.8, 1, 0.8] : [0.3, 0.6, 0.3],
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{
          duration: isHovered ? 0.3 : 3,
          repeat: isHovered ? 0 : Infinity,
          delay: isHovered ? 0 : delay,
        }}
      />

      {/* Star core */}
      <motion.div
        className="relative rounded-full bg-white shadow-lg"
        style={{ width: size, height: size }}
        animate={{
          opacity: [0.7, 1, 0.7],
          boxShadow: isHovered
            ? '0 0 20px 8px rgba(255, 255, 255, 0.6)'
            : '0 0 10px 2px rgba(255, 255, 255, 0.4)',
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: delay,
        }}
      />

      {/* Tooltip on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute z-10 -translate-x-1/2 left-1/2 whitespace-nowrap"
            style={{ bottom: size + 12 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-lavender-100">
              <p className="font-heading text-slate-800 text-center">{star.name}</p>
              <p className="text-sm text-slate-500 text-center">{star.dates}</p>
            </div>
            {/* Arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/95" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function StarConstellation() {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null)

  return (
    <section className="py-20 bg-gradient-night relative overflow-hidden">
      {/* Subtle star field background */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 rounded-full bg-lavender-900/50 flex items-center justify-center mx-auto mb-6">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-heading text-title md:text-4xl text-white mb-4">
            Forever in Our Hearts
          </h2>
          <p className="text-body-lg text-slate-300 max-w-2xl mx-auto">
            Each star represents a member of our community who has passed.
            Their stories and contributions continue to light the way for others.
          </p>
        </motion.div>

        {/* Star constellation */}
        <motion.div
          className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Constellation lines (connecting some stars) */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <line x1="15%" y1="25%" x2="35%" y2="45%" stroke="white" strokeWidth="1" />
            <line x1="35%" y1="45%" x2="50%" y2="50%" stroke="white" strokeWidth="1" />
            <line x1="50%" y1="50%" x2="65%" y2="35%" stroke="white" strokeWidth="1" />
            <line x1="65%" y1="35%" x2="75%" y2="55%" stroke="white" strokeWidth="1" />
            <line x1="25%" y1="65%" x2="45%" y2="75%" stroke="white" strokeWidth="1" />
            <line x1="45%" y1="75%" x2="70%" y2="70%" stroke="white" strokeWidth="1" />
          </svg>

          {/* Memorial stars */}
          {memorialData.map((star) => (
            <MemorialStar
              key={star.id}
              star={star}
              onHover={setHoveredStar}
              isHovered={hoveredStar === star.id}
            />
          ))}
        </motion.div>

        {/* View all tributes link */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a
            href="/memorial"
            className="inline-flex items-center gap-2 text-lavender-300 hover:text-white transition-colors text-body"
          >
            <span>View All Tributes</span>
            <span aria-hidden="true">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
