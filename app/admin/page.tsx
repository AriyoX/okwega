import { createClient } from '@/utils/supabase/server'
import AdminDashboard from '../../components/admin/AdminDashboard'
import { MentorVerification, ProcessedVerification } from './types'

export default async function AdminPage() {
  const supabase = await createClient();
  
  const { data: rawVerifications, error } = await supabase
    .from('mentor_verifications')
    .select(`
      *,
      profile:profiles!user_id(
        id,
        email,
        role,
        verification_status,
        verification_submitted_at,
        verification_reviewed_at,
        verification_reviewer_notes
      )
    `)
    .order('submitted_at', { ascending: false })
    .returns<MentorVerification[]>();

  if (error) {
    console.error('Error fetching verifications:', error);
    return <div>Error loading verifications</div>;
  }

  const verifications: ProcessedVerification[] = rawVerifications?.map(verification => ({
    id: verification.id,
    submitted_at: verification.submitted_at,
    status: verification.status,
    education: verification.education,
    work_experience: verification.work_experience,
    areas_of_expertise: verification.areas_of_expertise,
    linkedin_url: verification.linkedin_url || '',
    resume_url: verification.resume_url || '',
    additional_notes: verification.additional_notes || '',
    user_id: verification.user_id,
    user: {
      email: verification.profile?.email || '',
      id: verification.user_id
    }
  })) || [];

  return <AdminDashboard verifications={verifications as ProcessedVerification[]}/>;
}
