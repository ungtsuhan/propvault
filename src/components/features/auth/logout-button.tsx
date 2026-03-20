'use client';

import { SidebarMenuButton } from '@/components/ui/sidebar';
import { createClient } from '@/lib/supabase/client';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <SidebarMenuButton onClick={handleLogout}>
      <LogOut />
      <span className="uppercase">Sign out</span>
    </SidebarMenuButton>
  );
}
