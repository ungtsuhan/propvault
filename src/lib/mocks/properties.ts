import type { PropertyStatus } from '@/types/property';

export const mockProperty = {
  id: 'mock-property',
  name: 'Sample Property',
  address: 'Unit 12-3, Sample Residence, Kuala Lumpur',
  developer: 'Sample Developer Sdn. Bhd.',
  spaPrice: 500000,
  netPrice: 450000,
  builtUpSqft: 750,
  pricePerSqft: 600,
  status: 'UNDER_CONSTRUCTION' as PropertyStatus,
  spaSignedDate: '2025-01-01',
  expectedVpDate: '2028-01-01',
  completionPercent: 40,
  loan: {
    bank: 'Sample Bank',
    loanAmount: 450000,
    effectiveRate: 3.9,
    margin: 0.9,
    tenureYears: 35,
    monthlyRepayment: 2000,
    fdPledgeAmount: 45000,
    mrtaPremium: 6000,
  },
};

export const mockProperties = [
  {
    ...mockProperty,
    id: 'mock-property-1',
    name: 'Sample Property A',
    status: 'UNDER_CONSTRUCTION' as PropertyStatus,
  },
  {
    ...mockProperty,
    id: 'mock-property-2',
    name: 'Sample Property B',
    status: 'COMPLETED' as PropertyStatus,
  },
  {
    ...mockProperty,
    id: 'mock-property-3',
    name: 'Sample Property C',
    status: 'VACANT' as PropertyStatus,
  },
  {
    ...mockProperty,
    id: 'mock-property-4',
    name: 'Sample Property D',
    status: 'RENTED' as PropertyStatus,
  },
];
