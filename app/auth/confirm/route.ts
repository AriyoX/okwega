// app/auth/confirm/route.ts
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                 process.env.NEXT_PUBLIC_VERCEL_URL || 
                 'http://localhost:3000'

  if (token_hash && type) {
    const supabase = await createClient()

    if (type === 'recovery') {
      // For password recovery flow
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      })

      if (!error) {
        // Clear the session cookies
        await supabase.auth.signOut();
        const cookieStore = cookies()
        cookieStore.delete('sb-access-token')
        cookieStore.delete('sb-refresh-token')
        
        // Redirect to reset password page
        return Response.redirect(
          new URL('/forgot-password/reset-password', baseUrl)
        )
      }
    } else {
      // For other types (email verification etc)
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      })

      if (!error) {
        const redirectUrl = new URL(next, baseUrl).toString()
        return Response.redirect(redirectUrl)
      }
    }
  }

  return Response.redirect(new URL('/error', baseUrl))
}