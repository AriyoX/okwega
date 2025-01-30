'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card } from '@/components/ui/card-default'
import Button from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, Search, Star, Briefcase, Globe, Github, Linkedin, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const mockMentors = [
  {
    id: 'mock1',
    full_name: 'Ariyo Ahumuza',
    avatar_url: 'https://brmeiuhdtfsmgriaqmxj.supabase.co/storage/v1/object/public/avatars/me.jpg',
    job_title: 'Full Stack Developer',
    company: 'Open Source Contributor',
    expertise: ['React', 'Node.js', 'Cloud Architecture'],
    experience_years: 3,
    hourly_rate: 90,
    bio: 'Open source enthusiast passionate about developer education and building scalable applications.',
    github_url: 'https://github.com/AriyoX',
    linkedin_url: 'https://linkedin.com/in/ariyo-ahumuza/',
    portfolio_url: 'https://ahumuza.com',
    skills: ['TypeScript', 'AWS', 'GraphQL'],
    availability_status: 'Available',
    languages: ['English', 'Japanese', 'Runyankole']
  },
  {
    id: 'mock2',
    full_name: 'Sarah Chen',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    job_title: 'Lead UX Engineer',
    company: 'TechCorp',
    expertise: ['Design Systems', 'Figma', 'Accessibility'],
    experience_years: 8,
    hourly_rate: 120,
    bio: 'Specializing in creating inclusive design systems for enterprise applications.',
    github_url: 'https://github.com/sarahchen',
    linkedin_url: 'https://linkedin.com/in/sarahchen',
    portfolio_url: 'https://sarahchen.design',
    skills: ['UI/UX', 'Frontend Development', 'Prototyping'],
    availability_status: 'Available',
    languages: ['English', 'Mandarin']
  },
    {
    id: 'mock3',
    full_name: 'Michael Rodriguez',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    job_title: 'DevOps Specialist',
    company: 'CloudNative Inc',
    expertise: ['AWS', 'Kubernetes', 'CI/CD'],
    experience_years: 6,
    hourly_rate: 150,
    bio: 'Cloud infrastructure expert focused on optimizing development workflows.',
    github_url: 'https://github.com/mikerod',
    linkedin_url: 'https://linkedin.com/in/mikerod',
    skills: ['Terraform', 'Docker', 'Serverless'],
     availability_status: 'Available',
    languages: ['English', 'Spanish']
  },
  {
    id: 'mock4',
    full_name: 'Emma Wilson',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    job_title: 'Mobile Lead',
    company: 'AppMasters',
    expertise: ['React Native', 'Swift', 'Android'],
    experience_years: 7,
    hourly_rate: 110,
    bio: 'Cross-platform mobile expert with focus on performance optimization.',
    portfolio_url: 'https://emmawilson.app',
    skills: ['Mobile Architecture', 'CI/CD', 'Testing'],
     availability_status: 'Available',
    languages: ['English', 'Portuguese']
  },
  {
    id: 'mock5',
    full_name: 'James Thompson',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    job_title: 'Security Engineer',
    company: 'SecureTech',
    expertise: ['Pen Testing', 'Cloud Security', 'Cryptography'],
    experience_years: 9,
    hourly_rate: 180,
    bio: 'Cybersecurity specialist focused on enterprise-level protection strategies.',
    linkedin_url: 'https://linkedin.com/in/jamesthompson',
    skills: ['Network Security', 'Ethical Hacking', 'Compliance'],
    availability_status: 'Available',
     languages: ['English']
  },
  {
    id: 'mock6',
    full_name: 'Lila Patel',
    avatar_url: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e',
    job_title: 'Data Science Lead',
    company: 'AI Innovations',
    expertise: ['Machine Learning', 'Python', 'Big Data'],
    experience_years: 6,
    hourly_rate: 130,
    bio: 'Building intelligent systems and mentoring data professionals.',
    github_url: 'https://github.com/lilapatel',
    skills: ['TensorFlow', 'PyTorch', 'Data Visualization'],
     availability_status: 'Available',
    languages: ['English', 'Hindi', 'Gujarati']
  },
  {
    id: 'mock7',
    full_name: 'Daniel Kim',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    job_title: 'CTO',
    company: 'StartupHub',
    expertise: ['Tech Strategy', 'Fundraising', 'Scaling Teams'],
    experience_years: 12,
    hourly_rate: 200,
    bio: 'Helping startups build technical foundations and scale effectively.',
    linkedin_url: 'https://linkedin.com/in/danielkim',
    skills: ['Leadership', 'System Design', 'Product Management'],
    availability_status: 'Available',
     languages: ['English', 'Korean']
  },
  {
    id: 'mock8',
    full_name: 'Sophia Martinez',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    job_title: 'Frontend Architect',
    company: 'WebScale',
    expertise: ['React', 'Performance', 'TypeScript'],
    experience_years: 8,
    hourly_rate: 140,
    bio: 'Specializing in large-scale web applications and performance optimization.',
    github_url: 'https://github.com/sophiamart',
    portfolio_url: 'https://sophiamartinez.dev',
    skills: ['Webpack', 'Testing', 'Code Quality'],
    availability_status: 'Available',
     languages: ['English', 'Spanish', 'German']
  }
];

export default function BrowseMentors() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [mentors, setMentors] = useState<any[]>([]);

  useEffect(() => {
    async function loadMentors() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'mentor')
          .eq('verification_status', 'verified');
        
        if (error) throw error;

        const verifiedMentors = data || [];
        const neededMock = Math.max(8 - verifiedMentors.length, 0);
        const combinedMentors = [
          ...verifiedMentors,
          ...mockMentors.slice(0, neededMock)
        ];
        
        setMentors(combinedMentors);
      } catch (error) {
        console.error('Error loading mentors:', error);
        setMentors(mockMentors);
      } finally {
        setLoading(false);
      }
    }

    loadMentors();
  }, [supabase]);

  const filteredMentors = mentors.filter(mentor => {
    const searchMatches = mentor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise?.join(' ').toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.company?.toLowerCase().includes(searchQuery.toLowerCase());

    const expertiseMatches = selectedExpertise === 'all' ||
      mentor.expertise?.includes(selectedExpertise);

    const experienceMatches = selectedExperience === 'all' ||
      (selectedExperience === '0-5' && mentor.experience_years <= 5) ||
      (selectedExperience === '6-10' && mentor.experience_years > 5 && mentor.experience_years <= 10) ||
      (selectedExperience === '10+' && mentor.experience_years > 10);

    return searchMatches && expertiseMatches && experienceMatches;
  });

  const sortedMentors = [...filteredMentors].sort((a, b) => {
    switch (sortBy) {
      case 'rating': return b.hourly_rate - a.hourly_rate;
      case 'experience': return b.experience_years - a.experience_years;
      case 'price-low': return a.hourly_rate - b.hourly_rate;
      case 'price-high': return b.hourly_rate - a.hourly_rate;
      default: return 0;
    }
  });

  const totalPages = Math.ceil(sortedMentors.length / itemsPerPage);
  const paginatedMentors = sortedMentors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleContact = async (mentorId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login?redirect=/browse-mentors');
      return;
    }
    router.push(`/mentor/${mentorId}/contact`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Button
        variant="ghost"
        className="text-gray-600 hover:text-gray-900"
        onClick={() => router.push('/')}
        >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to Home
        </Button>
      </div>
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Connect with Expert Mentors
        </h1>
        <p className="text-xl text-gray-600">
          Learn from industry professionals across various tech disciplines
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search mentors by name, skills, or company..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Recommended</SelectItem>
            <SelectItem value="experience">Experience</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedExperience} onValueChange={setSelectedExperience}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Experience</SelectItem>
            <SelectItem value="0-5">0-5 years</SelectItem>
            <SelectItem value="6-10">6-10 years</SelectItem>
            <SelectItem value="10+">10+ years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mentor Grid */}
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedMentors.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative h-16 w-16 flex-shrink-0">
                    <Image
                      src={mentor.avatar_url || '/default-avatar.png'}
                      alt={mentor.full_name}
                      fill
                      className="rounded-full object-cover border-2 border-blue-100"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{mentor.full_name}</h3>
                    <p className="text-sm text-gray-600">
                      {mentor.job_title} {mentor.company && `@ ${mentor.company}`}
                    </p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium text-gray-900">
                        {mentor.experience_years}+ years
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expertise Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.expertise?.slice(0, 4).map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                  {/* Languages */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.languages?.map((lang: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
                

                {/* Social Links */}
                <div className="flex gap-3 mb-4">
                  {mentor.github_url && (
                    <a
                      href={mentor.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {mentor.linkedin_url && (
                    <a
                      href={mentor.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-blue-600"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {mentor.portfolio_url && (
                    <a
                      href={mentor.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-purple-600"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center border-t pt-4">
                  <div>
                    <p className="text-sm text-gray-600">Hourly Rate</p>
                    <p className="text-lg font-semibold text-blue-600">
                      ${mentor.hourly_rate}
                    </p>
                  </div>
                  <Button onClick={() => handleContact(mentor.id)}>
                    Connect
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination Controls */}
        {sortedMentors.length > 0 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </>

      {sortedMentors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No mentors found matching your criteria</p>
        </div>
      )}
    </div>
  );
}