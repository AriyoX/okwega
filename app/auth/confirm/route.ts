import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    // Get the base URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   process.env.NEXT_PUBLIC_VERCEL_URL || 
                   'http://localhost:3000'

    // Handle password reset flow specifically
    if (type === 'recovery' && !error) {
      // Redirect to the reset password page instead of default next path
      return Response.redirect(new URL('/forgot-password/reset-password', baseUrl))
    }

    if (!error) {
      // For other successful verifications (email, etc)
      const redirectUrl = new URL(next, baseUrl).toString()
      return Response.redirect(redirectUrl)
    }
  }

  // Handle errors
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                 process.env.NEXT_PUBLIC_VERCEL_URL || 
                 'http://localhost:3000'
  
  return Response.redirect(new URL('/error', baseUrl))
}