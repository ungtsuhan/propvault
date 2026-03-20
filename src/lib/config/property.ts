import type { PropertyStatus } from '@/types/property';

export const PROPERTY_STATUS_CONFIG: Record<
  PropertyStatus,
  { label: string; className: string }
> = {
  UNDER_CONSTRUCTION: {
    label: 'Under construction',
    className: 'bg-amber-100 text-amber-800 border-0',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-blue-100 text-blue-800 border-0',
  },
  RENTED: { label: 'Rented', className: 'bg-teal-100 text-teal-800 border-0' },
  VACANT: { label: 'Vacant', className: 'bg-gray-100 text-gray-800 border-0' },
};
