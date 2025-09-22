import { createClient } from 'lib/supabase/server'

export async function getServerSession() {
  const supabase = createClient()

  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Error in getServerSession:', error)
    return null
  }
}

export async function getServerUser() {
  const supabase = createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Error in getServerUser:', error)
    return null
  }
}
