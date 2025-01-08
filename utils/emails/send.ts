import { Resend } from 'resend';
import { AdminNotificationProps, VerificationResultProps } from './types';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminNotification(props: AdminNotificationProps) {
  const subject = props.type === 'new_user' 
    ? 'New User Registration' 
    : 'New Mentor Verification Request';

  const content = props.type === 'new_user'
    ? `A new user (${props.userEmail}) has registered on the platform.`
    : `A new mentor verification request has been submitted by ${props.userEmail}.`;

  try {
    await resend.emails.send({
      from: 'Okwega <okwega@ahumuza.com>',
      to: props.recipientEmail,
      subject,
      text: content,
    });
  } catch (error) {
    console.error('Error sending admin notification:', error);
    throw error;
  }
}

export async function sendVerificationResult(props: VerificationResultProps) {
  const subject = `Your Mentor Verification Status: ${props.status.toUpperCase()}`;
  const content = `Your mentor verification request has been ${props.status}.${
    props.reviewerNotes ? `\n\nReviewer Notes: ${props.reviewerNotes}` : ''
  }`;

  try {
    await resend.emails.send({
      from: 'Okwega <okwega@ahumuza.com>',
      to: props.recipientEmail,
      subject,
      text: content,
    });
  } catch (error) {
    console.error('Error sending verification result:', error);
    throw error;
  }
}
