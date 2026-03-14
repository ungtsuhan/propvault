import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Welcome to PropVault</h1>
      <p className="text-slate-500 mt-1">{user.email}</p>
    </div>
  );
}
