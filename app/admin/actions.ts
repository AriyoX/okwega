'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateVerificationStatus(
  verificationId: string,
  adminUserId: string,  // Renamed to be more explicit
  status: 'verified' | 'rejected',
  notes: string
) {
  const supabase = await createClient();

  // Check if user is admin
  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', adminUserId)
    .single()

  if (!adminProfile?.is_admin) {
    throw new Error('Unauthorized')
  }

  // First, get the mentor's user ID from the verification record
  const { data: verification } = await supabase
    .from('mentor_verifications')
    .select('user_id')
    .eq('id', verificationId)
    .single()

  if (!verification) {
    throw new Error('Verification record not found')
  }

  // Update verification status
  const { error: verificationError } = await supabase
    .from('mentor_verifications')
    .update({
      status,
      reviewer_notes: notes,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', verificationId)

  if (verificationError) {
    throw new Error(`Error updating verification: ${verificationError.message}`)
  }

  // Update mentor's profile status using the correct user_id
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      verification_status: status,
      verification_reviewed_at: new Date().toISOString(),
      verification_reviewer_notes: notes
    })
    .eq('id', verification.user_id)

  if (profileError) {
    throw new Error(`Error updating profile: ${profileError.message}`)
  }

  revalidatePath('/admin')
}