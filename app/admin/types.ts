export interface Profile {
    id: string;
    role: 'mentor' | 'mentee';
    email: string;
    verification_status: 'pending' | 'verified' | 'rejected';
    verification_submitted_at: string | null;
    verification_reviewed_at: string | null;
    verification_reviewer_notes: string | null;
    is_admin?: boolean;
  }
  
  export interface MentorVerification {
    id: string;
    user_id: string;
    submitted_at: string;
    education: string[];
    work_experience: string[];
    areas_of_expertise: string[];
    linkedin_url: string | null;
    resume_url: string | null;
    additional_notes: string | null;
    status: 'pending' | 'verified' | 'rejected';
    reviewer_notes: string | null;
    reviewed_at: string | null;
    profile?: Profile;
  }
  
  export interface ProcessedVerification {
    id: string;
    submitted_at: string;
    status: 'pending' | 'verified' | 'rejected';
    education: string[];
    work_experience: string[];
    areas_of_expertise: string[];
    linkedin_url: string | null;
    resume_url: string | null;
    additional_notes: string | null;
    user_id: string;
    user: {
      email: string;
      id: string;
    };
  }
  