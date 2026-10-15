const RENDER_API_ROOT = 'https://invoice-generator-app-ha6w.onrender.com';

const getBaseUrl = () => {
  // 1. Explicit environment variable override
  if (import.meta.env?.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`;
  }

  // 2. Production mode (Vercel, Netlify, Render, etc.)
  if (import.meta.env?.PROD) {
    return `${RENDER_API_ROOT}/api`;
  }

  // 3. Running outside localhost (e.g. mobile device, LAN IP, remote preview)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `${RENDER_API_ROOT}/api`;
    }
  }

  // 4. Localhost development (proxied by Vite)
  return '/api';
};

const BASE_URL = getBaseUrl();

/**
 * Helper to handle JSON responses
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = `Server error: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.message) errorMsg = errorData.message;
    } catch (_) {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export const api = {
  /**
   * Fetch all invoices
   */
  async getInvoices(params = {}) {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.search) query.append('search', params.search);

    const url = `${BASE_URL}/invoices${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  /**
   * Fetch dashboard statistics
   */
  async getStats() {
    const res = await fetch(`${BASE_URL}/invoices/stats`);
    return handleResponse(res);
  },

  /**
   * Fetch invoice by ID
   */
  async getInvoiceById(id) {
    const res = await fetch(`${BASE_URL}/invoices/${id}`);
    return handleResponse(res);
  },

  /**
   * Create invoice
   */
  async createInvoice(invoiceData) {
    const res = await fetch(`${BASE_URL}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData),
    });
    return handleResponse(res);
  },

  /**
   * Update invoice
   */
  async updateInvoice(id, invoiceData) {
    const res = await fetch(`${BASE_URL}/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData),
    });
    return handleResponse(res);
  },

  /**
   * Update invoice status
   */
  async updateStatus(id, status) {
    const res = await fetch(`${BASE_URL}/invoices/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  /**
   * Delete invoice
   */
  async deleteInvoice(id) {
    const res = await fetch(`${BASE_URL}/invoices/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  /**
   * Download generated PDF for an existing invoice
   */
  async downloadPDF(id, invoiceNumber = 'invoice') {
    const res = await fetch(`${BASE_URL}/invoices/${id}/pdf`);
    if (!res.ok) throw new Error('Failed to download invoice PDF');

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },

  /**
   * Download preview PDF from draft state without saving to db
   */
  async downloadPreviewPDF(draftData) {
    const res = await fetch(`${BASE_URL}/invoices/preview-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draftData),
    });
    if (!res.ok) throw new Error('Failed to generate preview PDF');

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${draftData.invoiceNumber || 'Draft-Invoice'}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },
};
