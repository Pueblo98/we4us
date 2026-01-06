import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <span className="font-heading text-xl text-white">We4Us</span>
            </div>
            <p className="text-slate-400 max-w-md">
              A patient-driven platform where GBM patients and caregivers share experiences,
              track treatment journeys, and support one another.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-white mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
              <li><Link to="/research" className="hover:text-white transition-colors">Research</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading text-white mb-4">Legal & Privacy</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/data-practices" className="hover:text-white transition-colors">Data Practices</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-slate-700 pt-8 mt-8">
          <p className="text-sm text-slate-500 mb-4">
            <strong>Medical Disclaimer:</strong> We4Us is a peer support platform, not a medical service.
            The information shared on this platform is from patient and caregiver experiences and should not
            replace professional medical advice. Always consult your healthcare team for medical decisions.
          </p>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} We4Us. Made with love for the GBM community.
          </p>
        </div>
      </div>
    </footer>
  )
}
