'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface ProfileFormData {
  avatar_url: string
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
  hourly_rate?: number
  expertise?: string[]
  teaching_style?: string[]
  mentor_bio?: string
  learning_goals?: string[]
  education_level?: string
  preferred_learning_style?: string[]
  weekly_availability_hours?: number
}

export async function updateProfile(role: string, formData: ProfileFormData) {
  const cookieStore = cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        }
      }
    }
  )

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('Not authenticated')

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        ...formData,
        skills: formData.skills.reduce((acc, skill) => ({ ...acc, [skill]: true }), {}),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) throw updateError

    // Refresh session to ensure middleware picks up changes
    await supabase.auth.refreshSession()
    
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function getProfile() {
  const cookieStore = cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        }
      }
    }
  )

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('Not authenticated')

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) throw profileError

    // Convert skills jsonb to array
    if (profile.skills) {
      profile.skills = Object.keys(profile.skills)
    }

    return { profile }
  } catch (error: any) {
    return { error: error.message }
  }
}