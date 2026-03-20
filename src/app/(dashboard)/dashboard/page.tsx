import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  let dbStatus = 'unknown';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = '✅ connected';
  } catch (error) {
    dbStatus = '❌ failed';
    console.error('DB error:', error);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome to PropVault</h1>
          <p className="text-slate-500 mt-1">{user.email}</p>
          <p className="text-slate-500 mt-1">Database status: {dbStatus}</p>
        </div>
      </div>
    </div>
  );
}
