import HeroSection from '@/components/landing/HeroSection'
import MissionSection from '@/components/landing/MissionSection'
import PrivacyCommitment from '@/components/landing/PrivacyCommitment'
import StarConstellation from '@/components/landing/StarConstellation'
import CallToAction from '@/components/landing/CallToAction'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <MissionSection />
      <PrivacyCommitment />
      <StarConstellation />
      <CallToAction />
      <Footer />
    </main>
  )
}
