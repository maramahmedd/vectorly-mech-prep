// src/hooks/useSupabase.ts
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)

        // Create or update user profile on sign in
        if (event === 'SIGNED_IN' && session?.user) {
          await createUserProfile(session.user)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}

async function createUserProfile(user: User) {
  const { error } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      name: user.user_metadata.name || '',
      email: user.email || '',
      last_login_at: new Date().toISOString()
    })
  
  if (error) {
    console.error('Error creating user profile:', error)
  }
}

