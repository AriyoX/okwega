'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card-default'
import { Input } from '@/components/ui/input'
import Button from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { updateProfile, getProfile } from './action'
import ProfileHeader from '@/components/complete-profile/ProfileHeader';

interface ProfileFormData {
  full_name: string
  bio: string
  languages: string[]
  timezone: string
  job_title: string
  company: string
  experience_years: number
  github_url: string
  linkedin_url: string
  portfolio_url: string
  skills: string[]
  hourly_rate: number
  expertise: string[]
  teaching_style: string[]
  mentor_bio: string
  availability_status: string
}

const initialProfile: ProfileFormData = {
  full_name: '',
  bio: '',
  languages: [],
  timezone: '',
  job_title: '',
  company: '',
  experience_years: 0,
  github_url: '',
  linkedin_url: '',
  portfolio_url: '',
  skills: [],
  hourly_rate: 0,
  expertise: [],
  teaching_style: [],
  mentor_bio: '',
  availability_status: 'available'
}

export default function CompleteProfile() {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileFormData>(initialProfile)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      const { profile: loadedProfile, error } = await getProfile()
      if (error) {
        setError(error)
        return
      }
      if (loadedProfile) {
        setProfile(loadedProfile)
      }
    }
    loadProfile()
  }, [])

  const handleChange = useCallback((field: keyof ProfileFormData, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const requiredFields = [
        'full_name',
        'bio',
        'job_title',
        'mentor_bio',
        'expertise',
        'teaching_style',
        'hourly_rate'
      ]

      const missingFields = requiredFields.filter(field => {
        const value = profile[field as keyof ProfileFormData]
        return Array.isArray(value) ? value.length === 0 : !value
      })

      if (missingFields.length > 0) {
        throw new Error(`Please fill in required fields: ${missingFields.join(', ')}`)
      }

      const result = await updateProfile('mentor', profile)
      if (result?.error) {
        setError(result.error)
      } else {
        window.location.href = `/mentor/dashboard`
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-profile py-8 sm:py-12">
      <ProfileHeader title="Complete Your Mentor Profile" />
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="border-b border-border/50 px-4 py-4 sm:px-6 sm:py-5">
          <CardTitle className="text-xl sm:text-2xl">Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="space-y-4">
                  {/* Single column inputs */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input
                        id="full_name"
                        value={profile.full_name}
                        onChange={(e) => handleChange('full_name', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Professional Bio *</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        required
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>

                {/* Two column grid */}
                  <div className="form-grid">
                     <div>
                        <Label htmlFor="job_title">Current Role *</Label>
                        <Input
                          id="job_title"
                          value={profile.job_title}
                          onChange={(e) => handleChange('job_title', e.target.value)}
                          required
                        />
                      </div>

                    <div>
                       <Label htmlFor="company">Company</Label>
                       <Input
                          id="company"
                          value={profile.company}
                          onChange={(e) => handleChange('company', e.target.value)}
                        />
                      </div>
                  </div>

                  <div className="form-grid">
                     <div>
                        <Label htmlFor="languages">Languages (comma separated)</Label>
                        <Input
                          id="languages"
                          value={profile.languages.join(', ')}
                          onChange={(e) => handleChange('languages', e.target.value.split(',').map(s => s.trim()))}
                        />
                      </div>
                     <div>
                       <Label htmlFor="timezone">Timezone *</Label>
                       <Input
                         id="timezone"
                         value={profile.timezone}
                         onChange={(e) => handleChange('timezone', e.target.value)}
                         required
                       />
                     </div>
                   </div>

                  <div className="form-grid">
                     <div>
                       <Label htmlFor="experience_years">Years of Experience *</Label>
                       <Input
                         id="experience_years"
                         type="number"
                         min="0"
                         value={profile.experience_years}
                         onChange={(e) => handleChange('experience_years', parseInt(e.target.value))}
                         required
                       />
                     </div>

                     <div>
                       <Label htmlFor="skills">Technical Skills (comma separated) *</Label>
                       <Input
                         id="skills"
                         value={profile.skills.join(', ')}
                         onChange={(e) => handleChange('skills', e.target.value.split(',').map(s => s.trim()))}
                         required
                       />
                      </div>
                  </div>
                </div>
            </div>

           {/* Professional Links */}
           <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Links</h3>
               <div className="space-y-4">
                 <div>
                     <Label htmlFor="linkedin_url">LinkedIn Profile *</Label>
                      <Input
                        id="linkedin_url"
                        type="url"
                        value={profile.linkedin_url}
                        onChange={(e) => handleChange('linkedin_url', e.target.value)}
                        required
                      />
                    </div>

                   <div>
                      <Label htmlFor="github_url">GitHub Profile</Label>
                      <Input
                        id="github_url"
                        type="url"
                        value={profile.github_url}
                        onChange={(e) => handleChange('github_url', e.target.value)}
                      />
                  </div>

                 <div>
                     <Label htmlFor="portfolio_url">Portfolio Website</Label>
                      <Input
                        id="portfolio_url"
                        type="url"
                        value={profile.portfolio_url}
                        onChange={(e) => handleChange('portfolio_url', e.target.value)}
                      />
                    </div>
               </div>
            </div>

           {/* Mentor Specific Fields */}
           <div className="space-y-4">
             <h3 className="text-lg font-medium">Mentorship Details</h3>
             <div className="space-y-4">
               <div className="form-grid">
                  <div>
                      <Label htmlFor="hourly_rate">Hourly Rate ($) *</Label>
                      <Input
                        id="hourly_rate"
                        type="number"
                        min="0"
                        step="0.01"
                        value={profile.hourly_rate}
                        onChange={(e) => handleChange('hourly_rate', parseFloat(e.target.value))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="availability_status">Availability Status *</Label>
                      <Select
                        value={profile.availability_status}
                        onValueChange={(value) => handleChange('availability_status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="busy">Busy</SelectItem>
                          <SelectItem value="unavailable">Unavailable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                </div>

               <div>
                 <Label htmlFor="expertise">Areas of Expertise (comma separated) *</Label>
                 <Input
                   id="expertise"
                   placeholder="Frontend Development, UX Design, etc."
                   value={profile.expertise.join(', ')}
                   onChange={(e) => handleChange('expertise', e.target.value.split(',').map(s => s.trim()))}
                   required
                 />
               </div>

                <div>
                  <Label htmlFor="teaching_style">Teaching Style (comma separated) *</Label>
                  <Input
                    id="teaching_style"
                    placeholder="Hands-on, Lecture-based, etc."
                    value={profile.teaching_style.join(', ')}
                    onChange={(e) => handleChange('teaching_style', e.target.value.split(',').map(s => s.trim()))}
                    required
                  />
                </div>

              <div>
                  <Label htmlFor="mentor_bio">Mentorship Philosophy *</Label>
                  <Textarea
                    id="mentor_bio"
                    value={profile.mentor_bio}
                    onChange={(e) => handleChange('mentor_bio', e.target.value)}
                    required
                    className="min-h-[120px]"
                    placeholder="Describe your approach to mentorship and what mentees can expect"
                  />
                </div>
             </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto sm:min-w-[200px] sm:mx-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Complete Profile'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}