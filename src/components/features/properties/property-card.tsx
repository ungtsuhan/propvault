import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PROPERTY_STATUS_CONFIG } from '@/lib/config/property';
import { Property } from '@/types/property';
import { formatRM, formatDate } from '@/utils/format';
import { Pencil, Building2 } from 'lucide-react';
import Image from 'next/image';

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Card className="p-0">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Col 1 — Image */}
        <div className="lg:col-span-3 h-48 lg:h-auto relative overflow-hidden bg-muted">
          <Image
            src="/images/property.png"
            alt="Property"
            fill
            className="object-cover"
          />
          <div className="absolute top-3 left-3">
            <StatusBadge status={property.status} />
          </div>
        </div>

        {/* Col 2 — Property Details */}
        <div className="lg:col-span-6 p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {property.name}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {property.address}
              </p>
              <p className="text-xs text-muted-foreground">
                {property.developer}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-sm">
              <Pencil className="w-4 h-4" />
            </Button>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-y py-4">
            <DataField label="SPA price" value={formatRM(property.spaPrice)} />
            <DataField label="Net price" value={formatRM(property.netPrice)} />
            <DataField
              label="Built-up"
              value={`${property.builtUpSqft} sqft`}
            />
            <DataField
              label="PSF (net)"
              value={
                property.pricePerSqft ? formatRM(property.pricePerSqft) : '—'
              }
            />
          </div>

          {/* Dates */}
          <div className="flex gap-6 text-xs text-muted-foreground">
            {property.spaSignedDate && (
              <span>
                SPA signed:{' '}
                <span className="font-medium text-foreground">
                  {formatDate(property.spaSignedDate)}
                </span>
              </span>
            )}
            {property.expectedVpDate && (
              <span>
                Expected VP:{' '}
                <span className="font-medium text-foreground">
                  {formatDate(property.expectedVpDate)}
                </span>
              </span>
            )}
          </div>

          {/* Profile Completion */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <span>Profile completion</span>
              <span>{property.completionPercent}%</span>
            </div>
            <div className="w-full h-1 bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${property.completionPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Col 3 — Loan Panel */}
        {property.loan && <LoanPanel loan={property.loan} />}
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: Property['status'] }) {
  const config = PROPERTY_STATUS_CONFIG[status];

  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function LoanPanel({ loan }: { loan: NonNullable<Property['loan']> }) {
  return (
    <div className="lg:col-span-3 bg-muted/40 border-l p-6 flex flex-col justify-between">
      <div className="space-y-4">
        {/* Bank header */}
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider">
            {loan.bank} Financing
          </span>
        </div>

        {/* Loan details */}
        <div className="space-y-2.5">
          <LoanRow label="Margin" value={`${loan.margin * 100}%`} />
          <LoanRow
            label="Rate"
            value={`${loan.effectiveRate.toFixed(2)}% p.a.`}
          />

          <div className="flex justify-between border-t pt-2">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">
              Monthly
            </span>
            <span className="text-sm font-black text-primary">
              {formatRM(loan.monthlyRepayment)}
            </span>
          </div>
        </div>
      </div>

      {/* FD + MRTA */}
      {(loan.fdPledgeAmount || loan.mrtaPremium) && (
        <div className="mt-4 pt-4 border-t flex gap-4">
          {loan.fdPledgeAmount && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                FD Pledge
              </p>
              <p className="text-xs font-bold">
                {formatRM(loan.fdPledgeAmount)}
              </p>
            </div>
          )}
          {loan.mrtaPremium && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                MRTA
              </p>
              <p className="text-xs font-bold">{formatRM(loan.mrtaPremium)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LoanRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <span className="text-xs font-bold">{value}</span>
    </div>
  );
}
