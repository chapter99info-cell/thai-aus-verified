'use client'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

const BUCKET = 'business-photos'

export function createStorageClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  )
}

export async function getAuthenticatedUserId(): Promise<string> {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('กรุณาเข้าสู่ระบบก่อนอัปโหลด')
  }

  return user.id
}

async function getAuthedStorageClient() {
  const authClient = createClient()
  const {
    data: { session },
  } = await authClient.auth.getSession()

  const storage = createStorageClient()

  if (session) {
    await storage.auth.setSession(session)
  }

  return storage
}

export function storagePathFromPublicUrl(url: string): string | null {
  const marker = '/business-photos/'
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return url.slice(idx + marker.length).split('?')[0] || null
}

export async function uploadBusinessPhoto(
  subPath: string,
  file: File
): Promise<string> {
  const userId = await getAuthenticatedUserId()
  const storage = await getAuthedStorageClient()
  const path = `${userId}/${subPath}`

  const { error: uploadError } = await storage.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) throw uploadError

  const {
    data: { publicUrl },
  } = storage.storage.from(BUCKET).getPublicUrl(path)

  return `${publicUrl}?t=${Date.now()}`
}

export async function deleteBusinessPhotoByUrl(url: string): Promise<void> {
  const path = storagePathFromPublicUrl(url)
  if (!path) return

  const userId = await getAuthenticatedUserId()
  if (!path.startsWith(`${userId}/`)) return

  const storage = await getAuthedStorageClient()
  await storage.storage.from(BUCKET).remove([path])
}

export function getDbClient() {
  return createClient()
}
