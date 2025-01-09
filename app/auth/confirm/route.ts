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
    if (!error) {
      // Get the correct base URL based on environment
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                     process.env.NEXT_PUBLIC_VERCEL_URL || 
                     'http://localhost:3000'
      
      // Construct the redirect URL
      const redirectUrl = new URL(next, baseUrl).toString()
      return Response.redirect(redirectUrl)
    }
  }

  // Use the correct base URL for error redirect as well
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                 process.env.NEXT_PUBLIC_VERCEL_URL || 
                 'http://localhost:3000'
  return Response.redirect(new URL('/error', baseUrl))
}