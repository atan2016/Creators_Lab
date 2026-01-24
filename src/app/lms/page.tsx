import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function LMSRedirect() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const role = (session.user as any).role

  switch (role) {
    case 'ADMIN':
      redirect('/admin')
    case 'TEACHER':
      redirect('/teacher')
    case 'STUDENT':
      redirect('/student')
    default:
      redirect('/login')
  }
}
