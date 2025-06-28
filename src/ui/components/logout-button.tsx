'use client'

import { useRouter } from 'next/navigation'

import { createClient } from '~/lib/supabase/client'
import { Button } from '~/ui/primitives/button'

export function LogoutButton() {
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return <Button onClick={logout}>Logout</Button>
}
