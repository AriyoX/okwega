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
    throw new Error('Not authenticated')
  }

  /*
  TODO: Add an archiving mechanism here to keep track of previous verification requests
  */

  try {
    // First delete any existing verification request
    await supabase
      .from('mentor_verifications')
      .delete()
      .eq('user_id', session.user.id);

    // Then insert the new verification request
    const [verificationResult, profileResult] = await Promise.all([
      supabase
        .from('mentor_verifications')
        .insert({
          user_id: session.user.id,
          education: formData.education.split(';').map(edu => edu.trim()),
          work_experience: formData.workExperience.split(';').map(exp => exp.trim()),
          areas_of_expertise: formData.areasOfExpertise.filter(area => area.trim() !== ''),
          linkedin_url: formData.linkedinUrl,
          resume_url: formData.resumeUrl,
          additional_notes: formData.additionalNotes
        }),
      
      supabase
        .from('profiles')
        .update({ verification_status: 'pending' })
        .eq('id', session.user.id)
    ]);

    if (verificationResult.error) throw verificationResult.error;
    if (profileResult.error) throw profileResult.error;

    return verificationResult.data;
  } catch (error) {
    console.error('Error submitting verification:', error);
    throw error;
  }
}