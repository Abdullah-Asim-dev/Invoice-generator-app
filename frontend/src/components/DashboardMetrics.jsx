import React from 'react';
import { ArrowUpRight, Clock, CheckCircle2, FileText, Layers } from 'lucide-react';

export default function DashboardMetrics({ stats, currency = 'USD' }) {
  const formatCurrency = (val) => {
    const symbolMap = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'CA$',
      AUD: 'A$',
      INR: '₹',
    };
    const symbol = symbolMap[currency] || '$';
    return `${symbol}${Number(val || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const cards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(stats?.totalEarned || 0),
      subtitle: `${stats?.paidCount || 0} invoices settled`,
      icon: ArrowUpRight,
      indicator: 'Collected',
      indicatorClass: 'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20',
      dotClass: 'bg-emerald-500',
    },
    {
      label: 'Outstanding Balance',
      value: formatCurrency(stats?.pendingAmount || 0),
      subtitle: `${stats?.pendingCount || 0} awaiting payment`,
      icon: Clock,
      indicator: 'In Flight',
      indicatorClass: 'bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20',
      dotClass: 'bg-amber-500',
    },
    {
      label: 'Settled Invoices',
      value: String(stats?.paidCount || 0),
      subtitle: 'Paid in full',
      icon: CheckCircle2,
      indicator: '100% Rate',
      indicatorClass: 'bg-indigo-500/10 text-indigo-700 ring-1 ring-indigo-500/20',
      dotClass: 'bg-indigo-500',
    },
    {
      label: 'Total Volume',
      value: String(stats?.totalCount || 0),
      subtitle: `${stats?.draftCount || 0} drafts in progress`,
      icon: Layers,
      indicator: 'All Time',
      indicatorClass: 'bg-zinc-500/10 text-zinc-700 ring-1 ring-zinc-500/20',
      dotClass: 'bg-zinc-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="group bg-white rounded-2xl p-6 ring-1 ring-zinc-200/80 shadow-xs hover:shadow-card-hover transition-all duration-200 relative overflow-hidden"
          >
            {/* Top row: Label and Icon */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-medium text-zinc-500">
                {card.label}
              </span>
              <div className="w-8 h-8 rounded-xl bg-zinc-50 group-hover:bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-zinc-700 transition-colors">
                <Icon className="w-4 h-4 stroke-[1.8]" />
              </div>
            </div>

            {/* Main Value */}
            <div className="mb-4">
              <h3 className="text-3xl font-semibold tracking-tight text-zinc-950">
                {card.value}
              </h3>
            </div>

            {/* Footer metadata */}
            <div className="flex items-center justify-between text-xs pt-3 border-t border-zinc-100 text-zinc-500">
              <span className="font-normal">{card.subtitle}</span>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${card.indicatorClass}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${card.dotClass}`} />
                {card.indicator}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
