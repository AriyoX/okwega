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
  learning_goals: string[]
  education_level: string
  preferred_learning_style: string[]
  weekly_availability_hours: number
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
  learning_goals: [],
  education_level: '',
  preferred_learning_style: [],
  weekly_availability_hours: 0
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
        'learning_goals',
        'education_level',
        'preferred_learning_style',
        'weekly_availability_hours'
      ]

      const missingFields = requiredFields.filter(field => {
        const value = profile[field as keyof ProfileFormData]
        return Array.isArray(value) ? value.length === 0 : !value
      })

      if (missingFields.length > 0) {
        throw new Error(`Please fill in required fields: ${missingFields.join(', ')}`)
      }

      const result = await updateProfile('mentee', profile)
      if (result?.error) {
        setError(result.error)
      } else {
        window.location.href = `/mentee/dashboard`
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-profile py-8 sm:py-12">
      <ProfileHeader title="Complete Your Mentee Profile" />
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
                      <Label htmlFor="bio">Personal Bio *</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        required
                        className="min-h-[100px]"
                        placeholder="Tell us about your background and aspirations"
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
                      placeholder="Student, Junior Developer, etc."
                    />
                  </div>
                    <div>
                      <Label htmlFor="education_level">Education Level *</Label>
                      <Select
                        value={profile.education_level}
                        onValueChange={(value) => handleChange('education_level', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high_school">High School</SelectItem>
                          <SelectItem value="bachelors">Bachelor&apos;s Degree</SelectItem>
                          <SelectItem value="masters">Master&apos;s Degree</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                </div>
                 <div className="form-grid">
                      <div>
                        <Label htmlFor="timezone">Timezone *</Label>
                        <Input
                          id="timezone"
                          value={profile.timezone}
                          onChange={(e) => handleChange('timezone', e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="languages">Languages (comma separated)</Label>
                        <Input
                          id="languages"
                          value={profile.languages.join(', ')}
                          onChange={(e) => handleChange('languages', e.target.value.split(',').map(s => s.trim()))}
                        />
                      </div>
                    </div>
              </div>
            </div>

            {/* Learning Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Learning Preferences</h3>
                <div className="space-y-4">
                  <div>
                      <Label htmlFor="learning_goals">Learning Goals *</Label>
                      <Textarea
                        id="learning_goals"
                        value={profile.learning_goals.join(', ')}
                        onChange={(e) => handleChange('learning_goals', e.target.value.split(',').map(s => s.trim()))}
                        required
                        placeholder="What skills or knowledge do you want to acquire?"
                        className="min-h-[80px]"
                      />
                    </div>

                     <div className="form-grid">
                      <div>
                        <Label htmlFor="preferred_learning_style">Preferred Learning Styles *</Label>
                        <Input
                          id="preferred_learning_style"
                          value={profile.preferred_learning_style.join(', ')}
                          onChange={(e) => handleChange('preferred_learning_style', e.target.value.split(',').map(s => s.trim()))}
                          required
                          placeholder="Visual, Hands-on, Theoretical, etc."
                        />
                      </div>

                      <div>
                        <Label htmlFor="weekly_availability_hours">Weekly Availability (hours) *</Label>
                        <Input
                          id="weekly_availability_hours"
                          type="number"
                          min="1"
                          max="168"
                          value={profile.weekly_availability_hours}
                          onChange={(e) => handleChange('weekly_availability_hours', parseInt(e.target.value))}
                          required
                        />
                      </div>
                    </div>
                </div>
            </div>

            {/* Professional Development */}
             <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Development</h3>
                <div className="space-y-4">
                   <div className="form-grid">
                     <div>
                      <Label htmlFor="skills">Current Skills (comma separated)</Label>
                      <Input
                        id="skills"
                        value={profile.skills.join(', ')}
                        onChange={(e) => handleChange('skills', e.target.value.split(',').map(s => s.trim()))}
                        placeholder="JavaScript, React, Project Management, etc."
                      />
                    </div>

                    <div>
                        <Label htmlFor="experience_years">Years of Experience</Label>
                        <Input
                          id="experience_years"
                          type="number"
                          min="0"
                          value={profile.experience_years}
                          onChange={(e) => handleChange('experience_years', parseInt(e.target.value))}
                        />
                      </div>
                   </div>
                   
                     <div>
                      <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                      <Input
                        id="linkedin_url"
                        type="url"
                        value={profile.linkedin_url}
                        onChange={(e) => handleChange('linkedin_url', e.target.value)}
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

            {/* Update button styles */}
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