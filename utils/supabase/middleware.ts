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

  let userProfile = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, verification_status')
      .eq('id', user.id)
      .single()
    userProfile = profile
  }

  // Define routes
  const authRoutes = ['/login', '/register', '/forgot-password']
  const publicRoutes = ['/', ...authRoutes, '/auth']
  const adminRoutes = ['/admin']
  const roleBasePaths = ['/mentor', '/mentee']
  
  // Password reset flow checks
  const isPasswordResetFlow = request.nextUrl.pathname.startsWith('/auth/confirm') && 
    request.nextUrl.searchParams.get('type') === 'recovery' &&
    request.nextUrl.searchParams.get('token_hash')

  const isResetPasswordPage = request.nextUrl.pathname === '/forgot-password/reset-password'
  
  if (isResetPasswordPage) {
    const referer = request.headers.get('referer')
    const isValidResetAccess = referer?.includes('/auth/confirm') && 
      referer?.includes('type=recovery')
    
    if (!isValidResetAccess) {
      const url = request.nextUrl.clone()
      url.pathname = '/forgot-password'
      return NextResponse.redirect(url)
    }
  }

  if (isPasswordResetFlow) {
    return supabaseResponse
  }

  if (user) {
    const userRole = userProfile?.role
    const isAdminRoute = adminRoutes.some(route =>
      request.nextUrl.pathname.startsWith(route)
    )

    // Role-based path protection
    if (userRole === 'mentor' && request.nextUrl.pathname.startsWith('/mentee')) {
      const url = request.nextUrl.clone()
      url.pathname = '/mentor/dashboard'
      return NextResponse.redirect(url)
    }
    
    if (userRole === 'mentee' && request.nextUrl.pathname.startsWith('/mentor')) {
      const url = request.nextUrl.clone()
      url.pathname = '/mentee/dashboard'
      return NextResponse.redirect(url)
    }

    if (isResetPasswordPage) { 
      return supabaseResponse;
    }
    
    if (isAdminRoute) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()
  
      if (!profile?.is_admin) {
        const url = request.nextUrl.clone()
        url.pathname = userRole === 'mentor' ? '/mentor/dashboard' : '/mentee/dashboard'
        return NextResponse.redirect(url)
      }
    }
    
    // Verification logic
    const isMentor = userRole === 'mentor'
    const verificationPath = isMentor ? '/mentor/verification' : null
    const needsVerification = isMentor && 
      (!userProfile?.verification_status || userProfile?.verification_status !== 'verified')
    const isVerificationPage = verificationPath && 
      request.nextUrl.pathname.startsWith(verificationPath)

    // Root path redirect
    if (request.nextUrl.pathname === '/') {
      const url = request.nextUrl.clone()
      url.pathname = needsVerification ? verificationPath! : 
        (userRole === 'mentor' ? '/mentor/dashboard' : '/mentee/dashboard')
      return NextResponse.redirect(url)
    }
    
    // Verification redirect
    if (needsVerification && !isVerificationPage) {
      const url = request.nextUrl.clone()
      url.pathname = verificationPath!
      return NextResponse.redirect(url)
    }

    // Auth route redirect for authenticated users
    const isAuthRoute = authRoutes.some(route =>
      request.nextUrl.pathname.startsWith(route)
    )
    if (isAuthRoute) {
      const url = request.nextUrl.clone()
      url.pathname = needsVerification ? verificationPath! : 
        (userRole === 'mentor' ? '/mentor/dashboard' : '/mentee/dashboard')
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }

  // Handle non-authenticated users
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Redirect to login if trying to access role-specific pages
  if (roleBasePaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isPublicRoute) {
    return supabaseResponse
  }

  const url = request.nextUrl.clone()
  url.pathname = '/'
  return NextResponse.redirect(url)
}