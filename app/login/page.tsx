export const dynamic = 'force-dynamic'

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import LoginForm from "./LoginForm"
import AuthLayout from "@/components/layout/AuthLayout"

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (user) {
    // Fetch user profile to get role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Redirect based on role
    const redirectPath = profile?.role === 'mentor' 
      ? '/mentor/dashboard' 
      : '/mentee/dashboard'
    
    redirect(redirectPath)
  }

  return (
    <AuthLayout 
      title="Welcome Back"
      subtitle="Log in to your account to continue"
    >
      <LoginForm />
    </AuthLayout>
  );
}