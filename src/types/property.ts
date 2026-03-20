export type PropertyStatus =
  | 'UNDER_CONSTRUCTION'
  | 'COMPLETED'
  | 'RENTED'
  | 'VACANT';

export interface Property {
  id: string;
  name: string;
  address: string;
  developer: string;
  spaPrice: number;
  netPrice: number;
  builtUpSqft: number;
  pricePerSqft?: number;
  status: PropertyStatus;
  expectedVpDate?: string;
  spaSignedDate?: string;
  completionPercent: number;
  loan?: Loan;
}

export interface Loan {
  bank: string;
  loanAmount: number;
  effectiveRate: number;
  margin: number;
  tenureYears: number;
  monthlyRepayment: number;
  fdPledgeAmount?: number;
  mrtaPremium?: number;
}
