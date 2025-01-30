'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

export async function uploadAvatar(formData: FormData) {
  const cookieStore = cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      }
    }
  )

  try {
    const file = formData.get('avatar') as File
    if (!file) throw new Error('No file uploaded')

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) throw new Error('Authentication required')

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${uuidv4()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    return { publicUrl }
  } catch (error: any) {
    return { error: error.message }
  }
}