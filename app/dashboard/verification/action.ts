'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface MentorVerificationData {
  education: string;
  workExperience: string;
  areasOfExpertise: string[];
  linkedinUrl: string;
  resumeUrl: string;
  additionalNotes?: string;
}

async function createServerSupabaseClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie error
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookie error
          }
        },
      },
    }
  )
}

export async function submitMentorVerification(formData: MentorVerificationData) {
  const supabase = await createServerSupabaseClient()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Convert education string to array
  const educationArray = formData.education.split(';').map(edu => edu.trim());
  
  // Convert work experience string to array
  const workExperienceArray = formData.workExperience.split(';').map(exp => exp.trim());
  
  // Ensure areas of expertise is properly formatted
  const expertiseArray = formData.areasOfExpertise.filter(area => area.trim() !== '');


  const { data, error } = await supabase
    .from('mentor_verifications')
    .insert({
      user_id: session.user.id,
      education: educationArray,
      work_experience: workExperienceArray,
      areas_of_expertise: expertiseArray,
      linkedin_url: formData.linkedinUrl,
      resume_url: formData.resumeUrl,
      additional_notes: formData.additionalNotes
    })

  if (error) {
    throw error
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ verification_status: 'pending' })
    .eq('id', session.user.id)

  if (profileError) {
    throw profileError
  }

  return data
}