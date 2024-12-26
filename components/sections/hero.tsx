import Button from '../ui/button';
import { ArrowRight } from 'lucide-react';
import CompanyLogos from './company-logos';

export function Hero() {
  return (
    <div className="pt-28 pb-20 bg-gradient-to-br from-blue-50 via-sky-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-900">
            Learn from Industry Leaders
            <span className="block text-blue-600">1-on-1 Mentorship</span>
          </h1>
          <p className="text-xl text-blue-700 max-w-2xl mx-auto">
            Connect with verified mentors from top companies. Get personalized guidance, 
            career advice, and structured learning paths.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="flex items-center gap-2">
              Browse Mentors <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg">
              Become a Mentor
            </Button>
          </div>
          <CompanyLogos />
        </div>
      </div>
    </div>
  );
}