import { createClient } from "@/utils/supabase/server";
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Get user role and admin status
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, role')
    .eq('id', session.user.id)
    .single()

  if (!profile?.is_admin) {
    // Redirect to role-specific dashboard
    const redirectPath = profile?.role === 'mentor' 
      ? '/mentor/dashboard' 
      : '/mentee/dashboard'
    redirect(redirectPath)
  }

  return <div className="container mx-auto py-8">{children}</div>
}