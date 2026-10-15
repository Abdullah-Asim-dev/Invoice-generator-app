import React from 'react';
import { Download, FileText, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export default function InvoicePreview({ invoice, onDownload, downloading = false }) {
  const formatCurrency = (val, curr = invoice?.currency || 'USD') => {
    const symbolMap = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'CA$',
      AUD: 'A$',
      INR: '₹',
    };
    const symbol = symbolMap[curr] || '$';
    return `${symbol}${Number(val || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusBadge = (status = 'Pending') => {
    const s = status.toLowerCase();
    if (s === 'paid') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          PAID
        </span>
      );
    }
    if (s === 'pending') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          PENDING
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-500/10 text-zinc-600 ring-1 ring-zinc-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
        DRAFT
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Floating Preview Bar */}
      <div className="flex items-center justify-between bg-zinc-950 text-white px-5 py-3.5 rounded-t-2xl shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-300">
            Live Document Preview
          </span>
        </div>

        {onDownload && (
          <button
            onClick={onDownload}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 stroke-[1.8]" />
            <span>{downloading ? 'Rendering...' : 'Download PDF'}</span>
          </button>
        )}
      </div>

      {/* Styled Paper Sheet Container */}
      <div className="bg-white ring-1 ring-zinc-200/80 rounded-b-2xl p-8 sm:p-10 shadow-paper flex-1 flex flex-col justify-between text-zinc-800 relative overflow-hidden">
        <div>
          {/* Subtle Accent Gradient Bar */}
          <div className="h-1 bg-gradient-to-r from-brand-500 via-indigo-500 to-accent-500 rounded-full w-full mb-8" />

          {/* Document Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
                {invoice.sender?.company || invoice.sender?.name || 'Studio Brand Name'}
              </h1>
              {invoice.sender?.name && invoice.sender?.company && (
                <p className="text-xs text-zinc-500 mt-0.5">{invoice.sender.name}</p>
              )}
              <div className="text-xs text-zinc-400 mt-2 space-y-0.5 font-normal">
                {invoice.sender?.email && <p>{invoice.sender.email}</p>}
                {invoice.sender?.phone && <p>{invoice.sender.phone}</p>}
                {invoice.sender?.address && (
                  <p>
                    {invoice.sender.address}
                    {invoice.sender.city ? `, ${invoice.sender.city}` : ''}
                    {invoice.sender.state ? ` ${invoice.sender.state}` : ''}
                  </p>
                )}
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                INVOICE
              </div>
              <p className="text-lg font-semibold tracking-tight text-zinc-900 mt-0.5">
                #{invoice.invoiceNumber || 'INV-DRAFT'}
              </p>
              <div className="mt-2 sm:flex sm:justify-end">
                {getStatusBadge(invoice.status)}
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-100 mb-8" />

          {/* Recipient & Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Billed To
              </p>
              <div className="text-sm font-semibold text-zinc-900">
                {invoice.client?.company || invoice.client?.name || 'Client Contact / Company'}
              </div>
              {invoice.client?.name && invoice.client?.company && (
                <p className="text-xs text-zinc-600 mt-0.5">Attn: {invoice.client.name}</p>
              )}
              <div className="text-xs text-zinc-400 mt-2 space-y-0.5">
                {invoice.client?.email && <p>{invoice.client.email}</p>}
                {invoice.client?.phone && <p>{invoice.client.phone}</p>}
                {invoice.client?.address && (
                  <p>
                    {invoice.client.address}
                    {invoice.client.city ? `, ${invoice.client.city}` : ''}
                    {invoice.client.state ? ` ${invoice.client.state}` : ''}
                  </p>
                )}
                {invoice.client?.country && <p>{invoice.client.country}</p>}
              </div>
            </div>

            <div className="bg-zinc-50/70 p-4 rounded-xl border border-zinc-200/60 sm:self-start space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500 font-normal">Issue Date:</span>
                <span className="font-medium text-zinc-900">{invoice.issueDate || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-normal">Payment Due:</span>
                <span className="font-medium text-zinc-900">{invoice.dueDate || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-normal">Currency:</span>
                <span className="font-medium text-zinc-900">{invoice.currency || 'USD'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-200/60 font-semibold text-zinc-950">
                <span>Amount Due:</span>
                <span className="text-brand-700">{formatCurrency(invoice.total, invoice.currency)}</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200/70 text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Qty</th>
                  <th className="py-2.5 px-3 text-right">Rate</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {(invoice.items || []).map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="py-3 px-3 font-medium text-zinc-900">
                      {item.description || <span className="italic text-zinc-400">Untitled item</span>}
                    </td>
                    <td className="py-3 px-3 text-right text-zinc-500 font-normal">
                      {item.quantity || 1}
                    </td>
                    <td className="py-3 px-3 text-right text-zinc-500 font-normal">
                      {formatCurrency(item.rate, invoice.currency)}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-zinc-900">
                      {formatCurrency(item.amount, invoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financials Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal:</span>
                <span className="font-medium text-zinc-900">
                  {formatCurrency(invoice.subtotal, invoice.currency)}
                </span>
              </div>

              {Number(invoice.discountRate) > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Discount ({invoice.discountRate}%):</span>
                  <span>-{formatCurrency(invoice.discountAmount, invoice.currency)}</span>
                </div>
              )}

              {Number(invoice.taxRate) > 0 && (
                <div className="flex justify-between text-zinc-500">
                  <span>Tax ({invoice.taxRate}%):</span>
                  <span>+{formatCurrency(invoice.taxAmount, invoice.currency)}</span>
                </div>
              )}

              <div className="pt-2.5 border-t border-zinc-200/80 flex justify-between items-baseline bg-zinc-50/90 p-3 rounded-xl border border-zinc-200/60">
                <span className="font-semibold text-zinc-900">Total:</span>
                <span className="text-lg font-bold tracking-tight text-zinc-950">
                  {formatCurrency(invoice.total, invoice.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Details & Notes */}
          {(invoice.paymentDetails || invoice.notes) && (
            <div className="border-t border-zinc-100 pt-5 space-y-3 text-xs">
              {invoice.paymentDetails && (
                <div>
                  <p className="font-semibold text-zinc-700">Bank Wire / Payment Details:</p>
                  <p className="text-zinc-500 whitespace-pre-line mt-0.5">{invoice.paymentDetails}</p>
                </div>
              )}
              {invoice.notes && (
                <div>
                  <p className="font-semibold text-zinc-700">Terms & Conditions:</p>
                  <p className="text-zinc-500 whitespace-pre-line mt-0.5">{invoice.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-4 border-t border-zinc-100 text-center text-[11px] text-zinc-400">
          Thank you for your business. Powered by InvoiceForge.
        </div>
      </div>
    </div>
  );
}
