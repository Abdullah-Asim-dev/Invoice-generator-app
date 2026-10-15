import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  LayoutDashboard,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Zap,
} from 'lucide-react';
import DashboardMetrics from './components/DashboardMetrics';
import InvoiceList from './components/InvoiceList';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import { api } from './services/api';

const defaultInvoiceTemplate = {
  invoiceNumber: '',
  status: 'Pending',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  currency: 'USD',
  sender: {
    name: 'Alex Rivera',
    company: 'Rivera Cloud & Code Studios',
    email: 'alex@riveradev.com',
    phone: '+1 (555) 349-8821',
    address: '742 Evergreen Terrace, Suite 400',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    country: 'United States',
  },
  client: {
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  },
  items: [
    {
      id: 'item-1',
      description: 'Full-Stack Architecture & Production API Design',
      quantity: 20,
      rate: 95,
      amount: 1900,
    },
  ],
  subtotal: 1900,
  discountRate: 0,
  discountAmount: 0,
  taxRate: 6.5,
  taxAmount: 123.5,
  total: 2023.5,
  notes: 'Payment is due within 14 days of invoice issue. Thank you for your continued partnership!',
  paymentDetails: 'Wire Transfer: Bank of America | Routing: 121000358 | Account: 48301928492 | SWIFT: BOFAUS3N',
};

export default function App() {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloadingPreview, setDownloadingPreview] = useState(false);
  const [view, setView] = useState('list'); // 'list' | 'create' | 'edit'
  const [activeInvoice, setActiveInvoice] = useState(defaultInvoiceTemplate);
  const [mobileTab, setMobileTab] = useState('form'); // 'form' | 'preview'
  const [toast, setToast] = useState(null);
  const [backendConnected, setBackendConnected] = useState(true);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [invoicesRes, statsRes] = await Promise.all([
        api.getInvoices(),
        api.getStats(),
      ]);
      setInvoices(invoicesRes.data || []);
      setStats(statsRes.data || null);
      setBackendConnected(true);
    } catch (err) {
      console.warn('API error, using local fallback:', err);
      setBackendConnected(false);
      showToast('Backend offline or initializing. Make sure server is active.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartCreate = () => {
    const nextInvNum = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;
    setActiveInvoice({
      ...defaultInvoiceTemplate,
      invoiceNumber: nextInvNum,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      items: [
        {
          id: `item-${Date.now()}`,
          description: 'Custom React Component System & Design Token Architecture',
          quantity: 24,
          rate: 90,
          amount: 2160,
        },
      ],
      subtotal: 2160,
      discountRate: 0,
      discountAmount: 0,
      taxRate: 5,
      taxAmount: 108,
      total: 2268,
    });
    setView('create');
    setMobileTab('form');
  };

  const handleStartEdit = (invoice) => {
    setActiveInvoice(JSON.parse(JSON.stringify(invoice)));
    setView('edit');
    setMobileTab('form');
  };

  const handleSaveInvoice = async () => {
    try {
      setSaving(true);
      if (view === 'edit' && activeInvoice.id) {
        await api.updateInvoice(activeInvoice.id, activeInvoice);
        showToast(`Invoice ${activeInvoice.invoiceNumber || ''} updated successfully!`);
      } else {
        await api.createInvoice(activeInvoice);
        showToast(`Invoice ${activeInvoice.invoiceNumber || ''} created successfully!`);
      }
      setView('list');
      await loadData();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to save invoice', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateStatus(id, newStatus);
      showToast(`Status marked as ${newStatus}`);
      await loadData();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDeleteInvoice = async (id) => {
    try {
      await api.deleteInvoice(id);
      showToast('Invoice deleted successfully');
      await loadData();
    } catch (err) {
      showToast('Failed to delete invoice', 'error');
    }
  };

  const handleDownloadPDF = async (id, invoiceNumber) => {
    try {
      await api.downloadPDF(id, invoiceNumber);
      showToast(`Downloaded ${invoiceNumber}.pdf`);
    } catch (err) {
      showToast('Failed to download PDF', 'error');
    }
  };

  const handleDownloadDraftPreview = async () => {
    try {
      setDownloadingPreview(true);
      await api.downloadPreviewPDF(activeInvoice);
      showToast('Draft preview PDF generated & saved!');
    } catch (err) {
      showToast('Failed to generate preview PDF', 'error');
    } finally {
      setDownloadingPreview(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/60 text-zinc-900 flex flex-col selection:bg-brand-500/15 selection:text-brand-900">
      {/* Toast Feedback Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-card ring-1 text-xs font-medium backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-rose-50/95 text-rose-800 ring-rose-200'
                : 'bg-zinc-950/90 text-white ring-zinc-800 shadow-xl'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-500" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Modern Sticky Glass Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-zinc-200/60 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand Title */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setView('list')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-zinc-950 to-zinc-800 ring-1 ring-zinc-700/50 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-4 h-4 text-brand-400 fill-brand-400/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-950 text-base tracking-tight">
                  Invoice<span className="text-brand-600">Forge</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-md ring-1 ring-zinc-200/60">
                  Studio
                </span>
              </div>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-3">
            {/* System Status Pill */}
            <div
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium border ${
                backendConnected
                  ? 'bg-zinc-50 text-zinc-600 border-zinc-200/80'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  backendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span>{backendConnected ? 'Engine Ready' : 'API Connecting...'}</span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={loadData}
              title="Refresh Ledger"
              className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/80 rounded-xl transition-colors active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {view === 'list' ? (
              <button
                onClick={handleStartCreate}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-medium shadow-xs hover:shadow-sm transition-all active:scale-[0.98]"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>New Invoice</span>
              </button>
            ) : (
              <button
                onClick={() => setView('list')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-zinc-200/80 text-zinc-700 hover:bg-zinc-50 rounded-xl text-xs font-medium transition-all active:scale-95"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {view === 'list' ? (
          <div>
            {/* Dashboard Overview Cards */}
            <DashboardMetrics stats={stats} currency="USD" />

            {/* Invoices List / Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
                    Billing & Invoicing Ledger
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Monitor outstanding invoices, track settled balances, and export high-res vector PDFs.
                  </p>
                </div>
              </div>

              <InvoiceList
                invoices={invoices}
                loading={loading}
                onEdit={handleStartEdit}
                onDelete={handleDeleteInvoice}
                onStatusChange={handleStatusChange}
                onDownloadPDF={handleDownloadPDF}
                onCreateNew={handleStartCreate}
                currency="USD"
              />
            </div>
          </div>
        ) : (
          /* Editor & Live Preview Workspace */
          <div className="space-y-6">
            {/* Mobile Segmented Switch (Collapses split view on small screens) */}
            <div className="xl:hidden flex bg-zinc-200/70 p-1 rounded-2xl mb-4">
              <button
                onClick={() => setMobileTab('form')}
                className={`flex-1 py-2 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  mobileTab === 'form'
                    ? 'bg-white text-zinc-950 shadow-xs font-semibold'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Form Editor</span>
              </button>
              <button
                onClick={() => setMobileTab('preview')}
                className={`flex-1 py-2 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  mobileTab === 'preview'
                    ? 'bg-white text-zinc-950 shadow-xs font-semibold'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>

            {/* Desktop Split-Screen Grid Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              {/* Form Column */}
              <div
                className={`xl:col-span-7 ${
                  mobileTab === 'form' ? 'block' : 'hidden xl:block'
                }`}
              >
                <InvoiceForm
                  formData={activeInvoice}
                  onChange={setActiveInvoice}
                  onSave={handleSaveInvoice}
                  onCancel={() => setView('list')}
                  onDownloadPreview={handleDownloadDraftPreview}
                  saving={saving}
                  downloadingPreview={downloadingPreview}
                  isEditing={view === 'edit'}
                />
              </div>

              {/* Live Preview Column */}
              <div
                className={`xl:col-span-5 sticky top-24 ${
                  mobileTab === 'preview' ? 'block' : 'hidden xl:block'
                }`}
              >
                <InvoicePreview
                  invoice={activeInvoice}
                  onDownload={handleDownloadDraftPreview}
                  downloading={downloadingPreview}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Minimalist Footer */}
      <footer className="bg-white/50 border-t border-zinc-200/60 py-6 mt-16 text-center text-xs text-zinc-400">
        <p>© 2026 InvoiceForge Studio • Crafted for modern freelancers & consultants</p>
      </footer>
    </div>
  );
}
