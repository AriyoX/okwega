import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define routes
  const authRoutes = ['/login', '/register', '/forgot-password']
  const publicRoutes = ['/', ...authRoutes, '/auth']
  
  // Check if this is a password reset flow with valid token
  const isPasswordResetFlow = request.nextUrl.pathname.startsWith('/auth/confirm') && 
    request.nextUrl.searchParams.get('type') === 'recovery' &&
    request.nextUrl.searchParams.get('token_hash')

  // Check if trying to access reset password page
  const isResetPasswordPage = request.nextUrl.pathname === '/forgot-password/reset-password'
  
  // Only allow access to reset password page if coming from valid auth flow
  if (isResetPasswordPage) {
    const referer = request.headers.get('referer')
    const isValidResetAccess = referer?.includes('/auth/confirm') && 
      referer?.includes('type=recovery')
    
    if (!isValidResetAccess) {
      // Redirect unauthorized attempts to forgot password page
      const url = request.nextUrl.clone()
      url.pathname = '/forgot-password'
      return NextResponse.redirect(url)
    }
  }

  // If it's a valid password reset flow, allow it regardless of auth status
  if (isPasswordResetFlow) {
    return supabaseResponse
  }

  // Handle logged-in users
  if (user) {
    // Redirect from root to dashboard
    if (request.nextUrl.pathname === '/') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
    
    // Redirect from auth pages to dashboard
    const isAuthRoute = authRoutes.some(route => 
      request.nextUrl.pathname.startsWith(route)
    )
    if (isAuthRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
    
    return supabaseResponse
  }

  // Handle non-logged-in users
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Allow access to public routes
  if (isPublicRoute) {
    return supabaseResponse
  }

  // Redirect to home page if trying to access protected route
  const url = request.nextUrl.clone()
  url.pathname = '/'
  return NextResponse.redirect(url)
}