import { createClient } from 'lib/supabase/server'

export async function getServerSession() {
  const supabase = createClient()

  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw new Error(error.message);
    return session
  } catch (error) {
    console.error('Error in getServerSession:', error)
    return null
  }
}

export async function getServerUser() {
  const supabase = createClient()

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw new Error(error.message);
    return user
  } catch (error) {
    console.error('Error in getServerUser:', error)
    return null
  }
}
