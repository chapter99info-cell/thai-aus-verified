export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/admin'

async function requireAdmin(): Promise<
  { service: NonNullable<ReturnType<typeof createServiceClient>> } | { error: NextResponse }
> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const { data: profile } = await supabase
    .from('providers')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  const service = createServiceClient()
  if (!service) {
    return { error: NextResponse.json({ error: 'Server misconfigured' }, { status: 500 }) }
  }

  return { service }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin()
    if ('error' in auth) return auth.error

    const body = await request.json()
    const {
      title,
      slug,
      summary,
      content,
      category,
      tags,
      target_occupation,
      is_published,
    } = body

    if (!title || !slug || !summary || !content || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await auth.service
      .from('articles')
      .insert({
        title,
        slug,
        summary,
        content,
        category,
        tags: tags ?? [],
        target_occupation: target_occupation ?? 'all',
        is_published: is_published ?? false,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ article: data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireAdmin()
    if ('error' in auth) return auth.error

    const body = await request.json()
    const { id, is_published, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing article id' }, { status: 400 })
    }

    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (typeof is_published === 'boolean') payload.is_published = is_published
    if (updates.title) payload.title = updates.title
    if (updates.slug) payload.slug = updates.slug
    if (updates.summary) payload.summary = updates.summary
    if (updates.content) payload.content = updates.content
    if (updates.category) payload.category = updates.category
    if (updates.tags) payload.tags = updates.tags
    if (updates.target_occupation) payload.target_occupation = updates.target_occupation

    const { error } = await auth.service.from('articles').update(payload).eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
