import { createClient } from '@/utils/supabase/server'
import AdminDashboard from '../../components/admin/AdminDashboard'

interface RawVerification {
  id: string;
  submitted_at: string;
  status: 'pending' | 'verified' | 'rejected';
  education: string[];
  work_experience: string[];
  areas_of_expertise: string[];
  linkedin_url: string;
  resume_url: string;
  user_id: string;
  profile: {
    email: string;
  };
}

export default async function AdminPage() {
  const supabase = await createClient();
  
  const { data: rawVerifications, error } = await supabase
    .from('mentor_verifications')
    .select(`
      *,
      profile:profiles!mentor_verifications_user_id_fkey(
        email
      )
    `)
    .order('submitted_at', { ascending: false })
    .returns<RawVerification[]>();

  if (error) {
    console.error('Error fetching verifications:', error);
    return <div>Error loading verifications</div>;
  }

  const verifications = rawVerifications?.map(verification => ({
    id: verification.id,
    submitted_at: verification.submitted_at,
    status: verification.status,
    education: verification.education,
    work_experience: verification.work_experience,
    areas_of_expertise: verification.areas_of_expertise,
    linkedin_url: verification.linkedin_url,
    resume_url: verification.resume_url,
    user_id: verification.user_id,  // Added user_id
    user: {
      email: verification.profile?.email || '',
      id: verification.user_id     // Added id to user object
    }
  })) || [];

  return <AdminDashboard verifications={verifications} />;
}