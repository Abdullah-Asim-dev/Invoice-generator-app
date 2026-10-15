const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'invoices.json');

// Ensure directory and data file exist
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readInvoices() {
  ensureDataFile();
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(rawData || '[]');
  } catch (err) {
    console.error('Error reading invoices file:', err);
    return [];
  }
}

function writeInvoices(invoices) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(invoices, null, 2), 'utf-8');
}

/**
 * Calculates line items and invoice financial totals
 */
function calculateTotals(items = [], discountRate = 0, taxRate = 0) {
  const parsedDiscountRate = Number(discountRate) || 0;
  const parsedTaxRate = Number(taxRate) || 0;

  const calculatedItems = (items || []).map((item, index) => {
    const quantity = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const amount = Number((quantity * rate).toFixed(2));
    return {
      id: item.id || `item-${index + 1}`,
      description: item.description || '',
      quantity,
      rate,
      amount,
    };
  });

  const subtotal = Number(
    calculatedItems.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)
  );

  const discountAmount = Number(((subtotal * parsedDiscountRate) / 100).toFixed(2));
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Number(((subtotalAfterDiscount * parsedTaxRate) / 100).toFixed(2));
  const total = Number((subtotalAfterDiscount + taxAmount).toFixed(2));

  return {
    items: calculatedItems,
    subtotal,
    discountRate: parsedDiscountRate,
    discountAmount,
    taxRate: parsedTaxRate,
    taxAmount,
    total,
  };
}

const invoiceService = {
  getAll(filter = {}) {
    let invoices = readInvoices();

    if (filter.status && filter.status !== 'All') {
      invoices = invoices.filter(
        (inv) => (inv.status || '').toLowerCase() === filter.status.toLowerCase()
      );
    }

    if (filter.search) {
      const q = filter.search.toLowerCase();
      invoices = invoices.filter(
        (inv) =>
          (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(q)) ||
          (inv.client?.name && inv.client.name.toLowerCase().includes(q)) ||
          (inv.client?.company && inv.client.company.toLowerCase().includes(q)) ||
          (inv.sender?.name && inv.sender.name.toLowerCase().includes(q))
      );
    }

    // Sort descending by issueDate / createdAt
    return invoices.sort((a, b) => new Date(b.issueDate || b.createdAt) - new Date(a.issueDate || a.createdAt));
  },

  getStats() {
    const invoices = readInvoices();

    let totalEarned = 0;
    let pendingAmount = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let draftCount = 0;

    invoices.forEach((inv) => {
      const status = (inv.status || '').toLowerCase();
      const total = Number(inv.total) || 0;

      if (status === 'paid') {
        totalEarned += total;
        paidCount++;
      } else if (status === 'pending') {
        pendingAmount += total;
        pendingCount++;
      } else if (status === 'draft') {
        draftCount++;
      }
    });

    return {
      totalEarned: Number(totalEarned.toFixed(2)),
      pendingAmount: Number(pendingAmount.toFixed(2)),
      paidCount,
      pendingCount,
      draftCount,
      totalCount: invoices.length,
    };
  },

  getById(id) {
    const invoices = readInvoices();
    return invoices.find((inv) => inv.id === id);
  },

  create(data) {
    const invoices = readInvoices();
    const id = uuidv4();

    // Auto-generate invoice number if missing
    const nextNumber = invoices.length + 1;
    const generatedNumber = `INV-${new Date().getFullYear()}-${String(nextNumber).padStart(3, '0')}`;
    const invoiceNumber = data.invoiceNumber?.trim() || generatedNumber;

    const totals = calculateTotals(data.items, data.discountRate, data.taxRate);

    const newInvoice = {
      id,
      invoiceNumber,
      status: data.status || 'Pending',
      issueDate: data.issueDate || new Date().toISOString().split('T')[0],
      dueDate: data.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      currency: data.currency || 'USD',
      sender: {
        name: data.sender?.name || '',
        company: data.sender?.company || '',
        email: data.sender?.email || '',
        phone: data.sender?.phone || '',
        address: data.sender?.address || '',
        city: data.sender?.city || '',
        state: data.sender?.state || '',
        zip: data.sender?.zip || '',
        country: data.sender?.country || '',
      },
      client: {
        name: data.client?.name || '',
        company: data.client?.company || '',
        email: data.client?.email || '',
        phone: data.client?.phone || '',
        address: data.client?.address || '',
        city: data.client?.city || '',
        state: data.client?.state || '',
        zip: data.client?.zip || '',
        country: data.client?.country || '',
      },
      items: totals.items,
      subtotal: totals.subtotal,
      discountRate: totals.discountRate,
      discountAmount: totals.discountAmount,
      taxRate: totals.taxRate,
      taxAmount: totals.taxAmount,
      total: totals.total,
      notes: data.notes || '',
      paymentDetails: data.paymentDetails || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    invoices.unshift(newInvoice);
    writeInvoices(invoices);
    return newInvoice;
  },

  update(id, data) {
    const invoices = readInvoices();
    const index = invoices.findIndex((inv) => inv.id === id);
    if (index === -1) return null;

    const existing = invoices[index];
    const totals = calculateTotals(
      data.items !== undefined ? data.items : existing.items,
      data.discountRate !== undefined ? data.discountRate : existing.discountRate,
      data.taxRate !== undefined ? data.taxRate : existing.taxRate
    );

    const updated = {
      ...existing,
      ...data,
      sender: { ...existing.sender, ...(data.sender || {}) },
      client: { ...existing.client, ...(data.client || {}) },
      items: totals.items,
      subtotal: totals.subtotal,
      discountRate: totals.discountRate,
      discountAmount: totals.discountAmount,
      taxRate: totals.taxRate,
      taxAmount: totals.taxAmount,
      total: totals.total,
      updatedAt: new Date().toISOString(),
    };

    invoices[index] = updated;
    writeInvoices(invoices);
    return updated;
  },

  updateStatus(id, status) {
    const invoices = readInvoices();
    const index = invoices.findIndex((inv) => inv.id === id);
    if (index === -1) return null;

    invoices[index].status = status;
    invoices[index].updatedAt = new Date().toISOString();
    writeInvoices(invoices);
    return invoices[index];
  },

  delete(id) {
    const invoices = readInvoices();
    const filtered = invoices.filter((inv) => inv.id !== id);
    if (filtered.length === invoices.length) return false;
    writeInvoices(filtered);
    return true;
  },
};

module.exports = {
  invoiceService,
  calculateTotals,
};
