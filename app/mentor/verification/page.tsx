import { createClient } from "@/utils/supabase/server"
import { redirect } from 'next/navigation'
import MentorVerificationForm from './form'

export default async function VerificationPage() {
  const supabase = await createClient();
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Fetch both profile and verification data
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, verification_status, verification_reviewer_notes')
    .eq('id', session.user.id)
    .single();

  // If user is not a mentor or already verified, redirect to dashboard
  if (profile?.role !== 'mentor' || profile?.verification_status === 'verified') {
    redirect('/mentor/dashboard')
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Mentor Verification</h1>
      <MentorVerificationForm 
        initialStatus={profile?.verification_status || ''}
        reviewerNotes={profile?.verification_reviewer_notes || ''}
      />
    </div>
  );
  
}