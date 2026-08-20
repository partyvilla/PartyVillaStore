import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import LoginForm from '@/components/auth/login-form'

export default async function LoginPage() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: (() => cookieStore) as any })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/admin')
  }

  return <LoginForm />
}
