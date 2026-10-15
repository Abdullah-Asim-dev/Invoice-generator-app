import React from 'react';
import { Plus, Trash2, ArrowLeft, Download, Loader2, Sparkles, Check } from 'lucide-react';

export default function InvoiceForm({
  formData,
  onChange,
  onSave,
  onCancel,
  onDownloadPreview,
  saving = false,
  downloadingPreview = false,
  isEditing = false,
}) {
  const updateSender = (field, val) => {
    onChange({
      ...formData,
      sender: { ...formData.sender, [field]: val },
    });
  };

  const updateClient = (field, val) => {
    onChange({
      ...formData,
      client: { ...formData.client, [field]: val },
    });
  };

  const updateItem = (index, field, val) => {
    const updatedItems = [...formData.items];
    const item = { ...updatedItems[index], [field]: val };

    if (field === 'quantity' || field === 'rate') {
      const q = field === 'quantity' ? Number(val) || 0 : Number(item.quantity) || 0;
      const r = field === 'rate' ? Number(val) || 0 : Number(item.rate) || 0;
      item.amount = Number((q * r).toFixed(2));
    }

    updatedItems[index] = item;
    recalcAndSave(updatedItems, formData.discountRate, formData.taxRate);
  };

  const addItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      description: '',
      quantity: 1,
      rate: 75,
      amount: 75,
    };
    const updatedItems = [...formData.items, newItem];
    recalcAndSave(updatedItems, formData.discountRate, formData.taxRate);
  };

  const removeItem = (index) => {
    if (formData.items.length <= 1) return;
    const updatedItems = formData.items.filter((_, i) => i !== index);
    recalcAndSave(updatedItems, formData.discountRate, formData.taxRate);
  };

  const handleRateChange = (field, val) => {
    const rateVal = Math.max(0, Number(val) || 0);
    const newDiscount = field === 'discountRate' ? rateVal : formData.discountRate;
    const newTax = field === 'taxRate' ? rateVal : formData.taxRate;
    recalcAndSave(formData.items, newDiscount, newTax);
  };

  const recalcAndSave = (items, discountRate, taxRate) => {
    const subtotal = Number(
      items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0).toFixed(2)
    );
    const discountAmount = Number(((subtotal * (Number(discountRate) || 0)) / 100).toFixed(2));
    const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
    const taxAmount = Number(((subtotalAfterDiscount * (Number(taxRate) || 0)) / 100).toFixed(2));
    const total = Number((subtotalAfterDiscount + taxAmount).toFixed(2));

    onChange({
      ...formData,
      items,
      subtotal,
      discountRate,
      discountAmount,
      taxRate,
      taxAmount,
      total,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Action Header */}
      <div className="bg-white rounded-2xl ring-1 ring-zinc-200/80 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 rounded-xl bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2]" />
          </button>
          <div>
            <h2 className="text-base font-semibold text-zinc-900 tracking-tight">
              {isEditing ? `Edit Invoice ${formData.invoiceNumber}` : 'Create New Invoice'}
            </h2>
            <p className="text-xs text-zinc-400">
              Live updates sync across document preview in real time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onDownloadPreview && (
            <button
              type="button"
              onClick={onDownloadPreview}
              disabled={downloadingPreview}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-700 bg-zinc-50 hover:bg-zinc-100 rounded-xl ring-1 ring-zinc-200/80 transition-all disabled:opacity-50 active:scale-95"
            >
              {downloadingPreview ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />
              ) : (
                <Download className="w-3.5 h-3.5 stroke-[1.8]" />
              )}
              <span>Export PDF</span>
            </button>
          )}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-medium shadow-xs hover:shadow-sm transition-all disabled:opacity-50 active:scale-95"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <Check className="w-3.5 h-3.5 stroke-[2.2]" />
            )}
            <span>{isEditing ? 'Save Changes' : 'Issue Invoice'}</span>
          </button>
        </div>
      </div>

      {/* Primary Configuration Bar */}
      <div className="bg-white rounded-2xl ring-1 ring-zinc-200/80 p-6 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5 block">
            Invoice Number
          </label>
          <input
            type="text"
            value={formData.invoiceNumber || ''}
            onChange={(e) => onChange({ ...formData, invoiceNumber: e.target.value })}
            placeholder="INV-2026-001"
            className="w-full text-xs px-3.5 py-2 bg-zinc-50/60 hover:bg-zinc-50 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium text-zinc-900 transition-all"
            required
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5 block">
            Status
          </label>
          <select
            value={formData.status || 'Pending'}
            onChange={(e) => onChange({ ...formData, status: e.target.value })}
            className="w-full text-xs px-3.5 py-2 bg-zinc-50/60 hover:bg-zinc-50 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium text-zinc-900 transition-all cursor-pointer"
          >
            <option value="Draft">Draft</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5 block">
            Currency
          </label>
          <select
            value={formData.currency || 'USD'}
            onChange={(e) => onChange({ ...formData, currency: e.target.value })}
            className="w-full text-xs px-3.5 py-2 bg-zinc-50/60 hover:bg-zinc-50 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium text-zinc-900 transition-all cursor-pointer"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (CA$)</option>
            <option value="AUD">AUD (A$)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5 block">
            Issue Date
          </label>
          <input
            type="date"
            value={formData.issueDate || ''}
            onChange={(e) => onChange({ ...formData, issueDate: e.target.value })}
            className="w-full text-xs px-3.5 py-2 bg-zinc-50/60 hover:bg-zinc-50 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-zinc-900 transition-all"
            required
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5 block">
            Due Date
          </label>
          <input
            type="date"
            value={formData.dueDate || ''}
            onChange={(e) => onChange({ ...formData, dueDate: e.target.value })}
            className="w-full text-xs px-3.5 py-2 bg-zinc-50/60 hover:bg-zinc-50 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-zinc-900 transition-all"
            required
          />
        </div>
      </div>

      {/* Dual Cards: Freelancer & Client */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sender (Freelancer) Card */}
        <div className="bg-white rounded-2xl ring-1 ring-zinc-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
              From (Your Business)
            </h3>
            <span className="text-[11px] text-zinc-400">Sender details</span>
          </div>

          <div>
            <label className="text-[11px] font-medium text-zinc-500 mb-1 block">Studio / Business Name</label>
            <input
              type="text"
              value={formData.sender?.company || ''}
              onChange={(e) => updateSender('company', e.target.value)}
              placeholder="Rivera Cloud & Code Studios"
              className="w-full text-xs px-3.5 py-2 bg-zinc-50/60 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-zinc-500 mb-1 block">Your Name</label>
              <input
                type="text"
                value={formData.sender?.name || ''}
                onChange={(e) => updateSender('name', e.target.value)}
                placeholder="Alex Rivera"
                className="w-full text-xs px-3.5 py-2 bg-zinc-50/60 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-zinc-500 mb-1 block">Email</label>
              <input
                type="email"
                value={formData.sender?.email || ''}
                onChange={(e) => updateSender('email', e.target.value)}
                placeholder="alex@riveradev.com"
                className="w-full text-xs px-3.5 py-2 bg-zinc-50/60 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-zinc-500 mb-1 block">Street Address</label>
            <input
              type="text"
              value={formData.sender?.address || ''}
              onChange={(e) => updateSender('address', e.target.value)}
              placeholder="742 Evergreen Terrace, Suite 400"
              className="w-full text-xs px-3.5 py-2 bg-zinc-50/60 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-medium text-zinc-500 mb-1 block">City</label>
              <input
                type="text"
                value={formData.sender?.city || ''}
                onChange={(e) => updateSender('city', e.target.value)}
                placeholder="Austin"
                className="w-full text-xs px-3.5 py-2 bg-zinc-50/60 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-zinc-500 mb-1 block">State / Zip</label>
              <input
                type="text"
                value={formData.sender?.state || ''}
                onChange={(e) => updateSender('state', e.target.value)}
                placeholder="TX 78701"
                className="w-full text-xs px-3.5 py-2 bg-zinc-50/60 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-zinc-500 mb-1 block">Phone</label>
              <input
                type="text"
                value={formData.sender?.phone || ''}
                onChange={(e) => updateSender('phone', e.target.value)}
                placeholder="+1 555-0199"
                className="w-full text-xs px-3.5 py-2 bg-zinc-50/60 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Client Card */}
        <div className="bg-white rounded-2xl ring-1 ring-zinc-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
              Bill To (Client)
            </h3>
            <span className="text-[11px] text-zinc-400">Recipient info</span>
          </div>

          <div>
            <label className="text-[11px] font-medium text-zinc-500 mb-1 block">Client Contact Name</label>
            <input
              type="text"
              value={formData.client?.name || ''}
              onChange={(e) => updateClient('name', e.target.value)}
              placeholder="Sarah Jenkins"
              className="w-full text-xs px-3.5 py-2 bg-zinc-50/60 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-zinc-500 mb-1 block">Client Company</label>
              <input
                type="text"
                value={formData.client?.company || ''}
                onChange={(e) => updateClient('company', e.target.value)}
                placeholder="Apex Global Solutions Inc."
                className="w-full text-xs px-3.5 py-2 bg-zinc-50/60 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-zinc-500 mb-1 block">Client Email</label>
              <input
                type="email"
                value={formData.client?.email || ''}
                onChange={(e) => updateClient('email', e.target.value)}
                placeholder="s.jenkins@apexsolutions.io"
                className="w-full text-xs px-3.5 py-2 bg-zinc-50/60 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-zinc-500 mb-1 block">Billing Street</label>
            <input
              type="text"
              value={formData.client?.address || ''}
              onChange={(e) => updateClient('address', e.target.value)}
              placeholder="1200 Innovation Parkway, Fl 18"
              className="w-full text-xs px-3.5 py-2 bg-zinc-50/60 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-medium text-zinc-500 mb-1 block">City</label>
              <input
                type="text"
                value={formData.client?.city || ''}
                onChange={(e) => updateClient('city', e.target.value)}
                placeholder="San Francisco"
                className="w-full text-xs px-3.5 py-2 bg-zinc-50/60 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-zinc-500 mb-1 block">State / Zip</label>
              <input
                type="text"
                value={formData.client?.state || ''}
                onChange={(e) => updateClient('state', e.target.value)}
                placeholder="CA 94107"
                className="w-full text-xs px-3.5 py-2 bg-zinc-50/60 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-zinc-500 mb-1 block">Country</label>
              <input
                type="text"
                value={formData.client?.country || ''}
                onChange={(e) => updateClient('country', e.target.value)}
                placeholder="United States"
                className="w-full text-xs px-3.5 py-2 bg-zinc-50/60 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Line Items Section */}
      <div className="bg-white rounded-2xl ring-1 ring-zinc-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
              Deliverables & Billable Items
            </h3>
            <p className="text-[11px] text-zinc-400">Itemize services, development sprints, or milestone deliverables</p>
          </div>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-700 bg-brand-50 hover:bg-brand-100/80 rounded-xl transition-colors active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> Add Item
          </button>
        </div>

        <div className="space-y-3">
          {formData.items.map((item, index) => (
            <div
              key={item.id || index}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 bg-zinc-50/60 hover:bg-zinc-50/90 rounded-xl border border-zinc-200/70 transition-colors"
            >
              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder="Task description (e.g. React Frontend Architecture & State Management)"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-white border border-zinc-200/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <div className="w-20">
                  <label className="text-[10px] text-zinc-400 block mb-0.5 sm:hidden">Qty</label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200/80 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    required
                  />
                </div>

                <div className="w-24">
                  <label className="text-[10px] text-zinc-400 block mb-0.5 sm:hidden">Rate</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) => updateItem(index, 'rate', e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200/80 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    required
                  />
                </div>

                <div className="w-24 text-right font-semibold text-xs text-zinc-900 px-2">
                  ${(Number(item.amount) || 0).toFixed(2)}
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={formData.items.length <= 1}
                  className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg transition-colors disabled:opacity-20"
                >
                  <Trash2 className="w-4 h-4 stroke-[1.8]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Adjustments & Totals Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-zinc-100">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1 block">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.taxRate}
                  onChange={(e) => handleRateChange('taxRate', e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-zinc-50/60 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1 block">
                  Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.discountRate}
                  onChange={(e) => handleRateChange('discountRate', e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-zinc-50/60 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1 block">
                Wire Transfer / Payment Instructions
              </label>
              <textarea
                rows={2}
                value={formData.paymentDetails || ''}
                onChange={(e) => onChange({ ...formData, paymentDetails: e.target.value })}
                placeholder="Direct Deposit: Bank of America | Routing: 121000358 | Account: 48301928492"
                className="w-full text-xs p-3 bg-zinc-50/60 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1 block">
                Invoice Notes & Terms
              </label>
              <textarea
                rows={2}
                value={formData.notes || ''}
                onChange={(e) => onChange({ ...formData, notes: e.target.value })}
                placeholder="Thank you for partnering with Rivera Cloud & Code Studios. Net 14 payment terms apply."
                className="w-full text-xs p-3 bg-zinc-50/60 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
              />
            </div>
          </div>

          {/* Totals Summary Panel */}
          <div className="bg-zinc-50/70 p-5 rounded-2xl border border-zinc-200/70 flex flex-col justify-between">
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">
                  ${(Number(formData.subtotal) || 0).toFixed(2)}
                </span>
              </div>

              {Number(formData.discountRate) > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Discount ({formData.discountRate}%)</span>
                  <span>-${(Number(formData.discountAmount) || 0).toFixed(2)}</span>
                </div>
              )}

              {Number(formData.taxRate) > 0 && (
                <div className="flex justify-between text-zinc-600">
                  <span>Tax ({formData.taxRate}%)</span>
                  <span>+${(Number(formData.taxAmount) || 0).toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-200/80 flex justify-between items-baseline mt-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-zinc-500 block">
                  Total Due
                </span>
                <span className="text-[11px] text-zinc-400">
                  {formData.currency || 'USD'}
                </span>
              </div>
              <span className="text-3xl font-bold tracking-tight text-zinc-950">
                ${(Number(formData.total) || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
