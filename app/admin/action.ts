'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { sendVerificationResult } from '@/utils/emails/send';

export async function updateVerificationStatus(
  verificationId: string, 
  action: 'verified' | 'rejected',
  reviewNotes: string
) {
  const supabase = createServerComponentClient({ cookies })
  const timestamp = new Date().toISOString()

  try {
    // Update verification record
    const { error: verificationError } = await supabase
      .from('mentor_verifications')
      .update({
        status: action,
        reviewer_notes: reviewNotes,
        reviewed_at: timestamp
      })
      .eq('id', verificationId)

    if (verificationError) throw verificationError

    // Get the user_id from the verification record
    const { data: verificationData, error: fetchError } = await supabase
      .from('mentor_verifications')
      .select('user_id')
      .eq('id', verificationId)
      .single()

    if (fetchError) throw fetchError
    if (!verificationData) throw new Error('Verification not found')

    // Update profile status
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        verification_status: action,
        verification_reviewed_at: timestamp,
        verification_reviewer_notes: reviewNotes
      })
      .eq('id', verificationData.user_id)

    if (profileError) throw profileError

    const { data: userProfile, error: userError } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', verificationData.user_id)
    .single();

    if (!userError && userProfile) {
    try {
        await sendVerificationResult({
        recipientEmail: userProfile.email,
        status: action,
        reviewerNotes: reviewNotes
        });
    } catch (error) {
        console.error('Error sending verification result email:', error);
    }
    }
    return { success: true }
  } catch (error) {
    console.error('Error in updateVerificationStatus:', error)
    throw error
  }
}