import PropertyCard from '@/components/features/properties/property-card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { Plus } from 'lucide-react';
import { redirect } from 'next/navigation';
import { formatRM } from '@/utils/format';
import { mockProperties } from '@/lib/mocks/properties';

export default async function PropertiesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const totalAssets = mockProperties.reduce((sum, p) => sum + p.spaPrice, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              My properties
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Total assets managed: {formatRM(totalAssets)}
            </p>
          </div>
          <Button>
            <Plus />
            Add property
          </Button>
        </div>

        <div className="space-y-4">
          {mockProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </div>
  );
}
