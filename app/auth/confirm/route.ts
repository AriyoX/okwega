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
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      const origin = request.headers.get("origin") || "";
      
      let baseUrl: string;
      if (isLocalEnv) {
        baseUrl = origin;
      } else if (forwardedHost) {
        baseUrl = `https://${forwardedHost}`;
      } else {
        baseUrl = origin;
      }
      
      // If it's a password reset, redirect to reset password page
      if (type === 'recovery') {
        return Response.redirect(`${baseUrl}/forgot-password/reset-password`);
      }
      
      // For other auth flows, use the next parameter
      return Response.redirect(`${baseUrl}${next}`);
    }
  }

  // Use the same origin handling for error redirect
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const origin = request.headers.get("origin") || "";
  
  let baseUrl: string;
  if (isLocalEnv) {
    baseUrl = origin;
  } else if (forwardedHost) {
    baseUrl = `https://${forwardedHost}`;
  } else {
    baseUrl = origin;
  }
  
  return Response.redirect(`${baseUrl}/error`);
}