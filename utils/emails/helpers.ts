import { createClient } from '@/utils/supabase/server';
import { sendAdminNotification } from './send';

export async function getAdminEmails() {
  const supabase = await createClient();
  
  const { data: admins, error } = await supabase
    .from('profiles')
    .select('email')
    .eq('is_admin', true);
    
  if (error) throw error;
  
  return admins.map(admin => admin.email);
}

export async function notifyAllAdmins(type: 'new_user' | 'verification_request', userEmail: string) {
  const adminEmails = await getAdminEmails();
  
  return Promise.all(
    adminEmails.map(adminEmail =>
      sendAdminNotification({
        type,
        userEmail,
        recipientEmail: adminEmail
      })
    )
  );
}