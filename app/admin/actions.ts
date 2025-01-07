'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

interface UpdateVerificationParams {
  verificationId: string;
  adminUserId: string;
  status: 'verified' | 'rejected';
  notes: string;
}

export async function updateVerificationStatus({
  verificationId,
  adminUserId,
  status,
  notes
}: UpdateVerificationParams) {
  const supabase = await createClient();

  // Check if user is admin
  const { data: adminProfile, error: adminError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', adminUserId)
    .single();

  if (adminError) {
    throw new Error(`Error checking admin status: ${adminError.message}`);
  }

  if (!adminProfile?.is_admin) {
    throw new Error('Unauthorized: User is not an admin');
  }

  // Get the verification record and associated user_id
  const { data: verification, error: verificationFetchError } = await supabase
    .from('mentor_verifications')
    .select('user_id')
    .eq('id', verificationId)
    .single();

  if (verificationFetchError || !verification) {
    throw new Error('Verification record not found');
  }

  // Begin transaction-like updates
  const timestamp = new Date().toISOString();

  // Update verification status
  const { error: verificationUpdateError } = await supabase
    .from('mentor_verifications')
    .update({
      status,
      reviewer_notes: notes,
      reviewed_at: timestamp
    })
    .eq('id', verificationId);

  if (verificationUpdateError) {
    throw new Error(`Error updating verification: ${verificationUpdateError.message}`);
  }

  // Update profile status
  const { error: profileUpdateError } = await supabase
    .from('profiles')
    .update({
      verification_status: status,
      verification_reviewed_at: timestamp,
      verification_reviewer_notes: notes
    })
    .eq('id', verification.user_id);

  if (profileUpdateError) {
    // In a real transaction, we would rollback here
    throw new Error(`Error updating profile: ${profileUpdateError.message}`);
  }

  revalidatePath('/admin');
  return { success: true };
}