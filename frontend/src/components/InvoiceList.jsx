import React, { useState } from 'react';
import {
  Download,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  FileText,
  Loader2,
  ArrowUpRight,
  MoreHorizontal,
  ChevronRight,
} from 'lucide-react';

export default function InvoiceList({
  invoices = [],
  loading = false,
  onEdit,
  onDelete,
  onStatusChange,
  onDownloadPDF,
  onCreateNew,
  currency = 'USD',
}) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const formatCurrency = (val, curr = currency) => {
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

  const handleDownload = async (e, invoice) => {
    e.stopPropagation();
    try {
      setDownloadingId(invoice.id);
      await onDownloadPDF(invoice.id, invoice.invoiceNumber);
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesTab =
      activeTab === 'All' ||
      (inv.status || '').toLowerCase() === activeTab.toLowerCase();

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(q)) ||
      (inv.client?.name && inv.client.name.toLowerCase().includes(q)) ||
      (inv.client?.company && inv.client.company.toLowerCase().includes(q)) ||
      (inv.items && inv.items.some((it) => it.description?.toLowerCase().includes(q)));

    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status = 'Pending') => {
    const s = status.toLowerCase();
    if (s === 'paid') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Paid
        </span>
      );
    }
    if (s === 'pending') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Pending
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-500/10 text-zinc-600 ring-1 ring-zinc-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
        Draft
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl ring-1 ring-zinc-200/80 shadow-xs overflow-hidden">
      {/* Sleek Toolbar Header */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100">
        {/* Segmented Filter Pills */}
        <div className="inline-flex items-center p-1 bg-zinc-100/80 rounded-xl self-start">
          {['All', 'Paid', 'Pending', 'Draft'].map((tab) => {
            const count =
              tab === 'All'
                ? invoices.length
                : invoices.filter((i) => (i.status || '').toLowerCase() === tab.toLowerCase()).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 flex items-center gap-2 ${
                  activeTab === tab
                    ? 'bg-white text-zinc-950 shadow-xs font-semibold'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeTab === tab
                      ? 'bg-zinc-100 text-zinc-800'
                      : 'bg-zinc-200/60 text-zinc-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar & Action Button */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by client, invoice #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-zinc-50/70 hover:bg-zinc-50 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-zinc-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 text-xs px-1"
              >
                ×
              </button>
            )}
          </div>

          <button
            onClick={onCreateNew}
            className="group inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium rounded-xl shadow-xs hover:shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.2] transition-transform group-hover:rotate-90 duration-200" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Modern Table */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-zinc-400">
          <Loader2 className="w-7 h-7 animate-spin text-brand-600 mb-3" />
          <p className="text-xs font-medium text-zinc-500">Loading ledger records...</p>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="py-20 text-center px-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 ring-1 ring-zinc-200/60 flex items-center justify-center mx-auto mb-3.5 text-zinc-400">
            <FileText className="w-5 h-5 stroke-[1.8]" />
          </div>
          <h4 className="text-sm font-semibold text-zinc-900">No invoices found</h4>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto mt-1 mb-5">
            {searchQuery
              ? `No invoices match "${searchQuery}". Clear your search query to see all records.`
              : `You haven't generated any invoices under "${activeTab}".`}
          </p>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Create New Invoice
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead>
              <tr className="border-b border-zinc-100 text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-5 font-medium">Invoice</th>
                <th className="py-3.5 px-5 font-medium">Client</th>
                <th className="py-3.5 px-5 font-medium">Issue Date</th>
                <th className="py-3.5 px-5 font-medium">Due Date</th>
                <th className="py-3.5 px-5 font-medium">Amount</th>
                <th className="py-3.5 px-5 font-medium">Status</th>
                <th className="py-3.5 px-5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50/90">
              {filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => onEdit(inv)}
                  className="hover:bg-zinc-50/70 transition-colors group cursor-pointer"
                >
                  {/* Invoice # */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    <span className="font-semibold text-zinc-900 group-hover:text-brand-600 transition-colors">
                      {inv.invoiceNumber || 'INV-DRAFT'}
                    </span>
                  </td>

                  {/* Client Info */}
                  <td className="py-4 px-5">
                    <div className="font-medium text-zinc-900">
                      {inv.client?.name || 'Unnamed Client'}
                    </div>
                    {inv.client?.company && (
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        {inv.client.company}
                      </div>
                    )}
                  </td>

                  {/* Issue Date */}
                  <td className="py-4 px-5 whitespace-nowrap text-zinc-500">
                    {inv.issueDate || '—'}
                  </td>

                  {/* Due Date */}
                  <td className="py-4 px-5 whitespace-nowrap text-zinc-500">
                    {inv.dueDate || '—'}
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-5 whitespace-nowrap font-semibold text-zinc-950">
                    {formatCurrency(inv.total, inv.currency)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    {getStatusBadge(inv.status)}
                  </td>

                  {/* Actions Column */}
                  <td className="py-4 px-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      {/* PDF Download Button */}
                      <button
                        title="Download Vector PDF"
                        onClick={(e) => handleDownload(e, inv)}
                        disabled={downloadingId === inv.id}
                        className="p-1.5 text-zinc-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all active:scale-95 disabled:opacity-50"
                      >
                        {downloadingId === inv.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                        ) : (
                          <Download className="w-4 h-4 stroke-[1.8]" />
                        )}
                      </button>

                      {/* Status Toggle Button */}
                      {inv.status?.toLowerCase() === 'paid' ? (
                        <button
                          title="Mark as Pending"
                          onClick={() => onStatusChange(inv.id, 'Pending')}
                          className="p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all active:scale-95"
                        >
                          <Clock className="w-4 h-4 stroke-[1.8]" />
                        </button>
                      ) : (
                        <button
                          title="Mark as Settled / Paid"
                          onClick={() => onStatusChange(inv.id, 'Paid')}
                          className="p-1.5 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4 stroke-[1.8]" />
                        </button>
                      )}

                      {/* Edit Button */}
                      <button
                        title="Edit Invoice Details"
                        onClick={() => onEdit(inv)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all active:scale-95"
                      >
                        <Edit3 className="w-4 h-4 stroke-[1.8]" />
                      </button>

                      {/* Delete Button */}
                      <button
                        title="Delete Invoice"
                        onClick={() => {
                          if (window.confirm(`Delete invoice ${inv.invoiceNumber || 'this record'} permanently?`)) {
                            onDelete(inv.id);
                          }
                        }}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all active:scale-95"
                      >
                        <Trash2 className="w-4 h-4 stroke-[1.8]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
