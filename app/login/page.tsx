export const dynamic = 'force-dynamic'

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import LoginForm from "./LoginForm"
import AuthLayout from "@/components/layout/AuthLayout"

export default async function LoginPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  
  if (data.user) {
    redirect("/dashboard")
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