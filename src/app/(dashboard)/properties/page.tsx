import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function PropertiesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome to Properties</h1>
        </div>
      </div>
    </div>
  );
}
