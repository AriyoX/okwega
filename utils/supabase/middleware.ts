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
          const response = NextResponse.next({ request })
          
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
          
          supabaseResponse = response
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define routes
  const authRoutes = ['/login', '/register', '/forgot-password']
  const publicRoutes = [
    '/', 
    ...authRoutes, 
    '/auth', 
    '/mentor/complete-profile', 
    '/mentee/complete-profile',
    '/forgot-password/reset-password'
  ]
  const adminRoutes = ['/admin']
  const roleBasePaths = ['/mentor', '/mentee']

  // Password reset flow checks
  const isPasswordResetFlow = request.nextUrl.pathname.startsWith('/auth/confirm') && 
    request.nextUrl.searchParams.get('type') === 'recovery' &&
    request.nextUrl.searchParams.get('token_hash')

  const isResetPasswordPage = request.nextUrl.pathname === '/forgot-password/reset-password'
  
  if (isPasswordResetFlow || isResetPasswordPage) {
    if (user) {
      return supabaseResponse
    }
    return supabaseResponse
  }

  // Handle non-authenticated users first
  if (!user) {
    const isPublicRoute = publicRoutes.some(route => 
      request.nextUrl.pathname.startsWith(route)
    )

    if (isPublicRoute) {
      return supabaseResponse
    }

    // Redirect to login if trying to access role-specific pages
    if (roleBasePaths.some(path => request.nextUrl.pathname.startsWith(path))) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Get user profile only if user is authenticated
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('role, verification_status, full_name, profile_strength, is_admin')
    .eq('id', user.id)
    .single()

  // If no profile exists yet, allow access only to profile completion
  if (!userProfile) {
    if (!request.nextUrl.pathname.includes('/complete-profile')) {
      const url = request.nextUrl.clone()
      // Default to mentor complete-profile path if no role yet
      url.pathname = '/mentor/complete-profile'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  const userRole = userProfile.role
  const isProfileComplete = userProfile.full_name && userProfile.profile_strength >= 40

  // Handle profile completion
  if (!isProfileComplete && !request.nextUrl.pathname.includes('/complete-profile')) {
    const url = request.nextUrl.clone()
    url.pathname = `/${userRole}/complete-profile`
    return NextResponse.redirect(url)
  }

  // Handle verification for mentors
  const isMentor = userRole === 'mentor'
  const verificationPath = isMentor ? '/mentor/verification' : null
  const needsVerification = isMentor && 
    (!userProfile.verification_status || userProfile.verification_status !== 'verified')
  const isVerificationPage = verificationPath && 
    request.nextUrl.pathname.startsWith(verificationPath)

  if (needsVerification && !isVerificationPage && isProfileComplete) {
    const url = request.nextUrl.clone()
    url.pathname = verificationPath!
    return NextResponse.redirect(url)
  }

  // Handle role-based access
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

  // Handle admin routes
  const isAdminRoute = adminRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )
  
  if (isAdminRoute && !userProfile.is_admin) {
    const url = request.nextUrl.clone()
    url.pathname = userRole === 'mentor' ? '/mentor/dashboard' : '/mentee/dashboard'
    return NextResponse.redirect(url)
  }

  // Handle root path redirect
  if (request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = needsVerification ? verificationPath! : 
      (userRole === 'mentor' ? '/mentor/dashboard' : '/mentee/dashboard')
    return NextResponse.redirect(url)
  }

  // Handle auth routes for authenticated users
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