import { Users, Star, Globe2 } from 'lucide-react';

const stats = [
  {
    icon: <Users className="h-6 w-6 text-blue-600" />,
    value: "2,500+",
    label: "Active Mentors",
    description: "Expert mentors from top companies"
  },
  {
    icon: <Star className="h-6 w-6 text-blue-600" />,
    value: "15,000+",
    label: "Successful Matches",
    description: "Happy mentees achieving their goals"
  },
  {
    icon: <Globe2 className="h-6 w-6 text-blue-600" />,
    value: "100+",
    label: "Countries",
    description: "Global mentorship community"
  }
];

export function Stats() {
  return (
    <div className="py-16 bg-gradient-to-b from-white to-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-blue-900 mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-blue-800 mb-1">{stat.label}</div>
              <div className="text-blue-600">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}