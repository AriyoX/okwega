import { ComponentProps } from "react";

export interface EmailTemplateProps {
  recipientEmail: string;
}

export interface AdminNotificationProps extends EmailTemplateProps {
  type: 'new_user' | 'verification_request';
  userEmail: string;
}

export interface VerificationResultProps extends EmailTemplateProps {
  status: 'verified' | 'rejected';
  reviewerNotes?: string;
}