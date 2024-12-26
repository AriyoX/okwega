import React from 'react';
import Card from '../ui/card';
import { Brain, Video, Calendar, MessageSquare, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: <Brain className="h-6 w-6 text-blue-600" />,
    title: "AI-Powered Matching",
    description: "Our smart algorithm finds the perfect mentor based on your goals, experience, and learning style."
  },
  {
    icon: <Video className="h-6 w-6 text-blue-600" />,
    title: "HD Video Sessions",
    description: "Crystal-clear video calls with screen sharing for effective remote learning."
  },
  {
    icon: <Calendar className="h-6 w-6 text-blue-600" />,
    title: "Flexible Scheduling",
    description: "Book sessions that fit your timeline with automatic timezone conversion."
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-blue-600" />,
    title: "Instant Chat",
    description: "Get quick answers and feedback through direct messaging with your mentor."
  },
  {
    icon: <Shield className="h-6 w-6 text-blue-600" />,
    title: "Verified Mentors",
    description: "All mentors are thoroughly vetted for their expertise and teaching ability."
  },
  {
    icon: <Zap className="h-6 w-6 text-blue-600" />,
    title: "Custom Learning Path",
    description: "Get a personalized roadmap tailored to your learning goals and pace."
  }
];

export function Features() {
  return (
    <div className="py-20 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-blue-600">
            Comprehensive tools and features for effective mentorship
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-blue-600">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}