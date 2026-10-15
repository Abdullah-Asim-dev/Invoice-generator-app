const express = require('express');
const router = express.Router();
const { invoiceService, calculateTotals } = require('../services/invoiceService');
const { generateInvoicePDF } = require('../services/pdfService');

/**
 * GET /api/invoices/stats
 * Dashboard metrics summary
 */
router.get('/stats', (req, res) => {
  try {
    const stats = invoiceService.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve stats' });
  }
});

/**
 * GET /api/invoices
 * Retrieve all invoices with optional filter
 */
router.get('/', (req, res) => {
  try {
    const { status, search } = req.query;
    const invoices = invoiceService.getAll({ status, search });
    res.json({ success: true, data: invoices });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve invoices' });
  }
});

/**
 * GET /api/invoices/:id
 * Retrieve single invoice
 */
router.get('/:id', (req, res) => {
  try {
    const invoice = invoiceService.getById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.json({ success: true, data: invoice });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve invoice' });
  }
});

/**
 * POST /api/invoices
 * Create new invoice
 */
router.post('/', (req, res) => {
  try {
    const newInvoice = invoiceService.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: newInvoice,
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ success: false, message: 'Failed to create invoice' });
  }
});

/**
 * PUT /api/invoices/:id
 * Update invoice
 */
router.put('/:id', (req, res) => {
  try {
    const updated = invoiceService.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.json({
      success: true,
      message: 'Invoice updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ success: false, message: 'Failed to update invoice' });
  }
});

/**
 * PATCH /api/invoices/:id/status
 * Quick update invoice status (Paid, Pending, Draft)
 */
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }
    const updated = invoiceService.updateStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.json({
      success: true,
      message: `Invoice status changed to ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

/**
 * DELETE /api/invoices/:id
 * Delete invoice
 */
router.delete('/:id', (req, res) => {
  try {
    const deleted = invoiceService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ success: false, message: 'Failed to delete invoice' });
  }
});

/**
 * GET /api/invoices/:id/pdf
 * Stream generated PDF to client
 */
router.get('/:id/pdf', (req, res) => {
  try {
    const invoice = invoiceService.getById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const filename = `${invoice.invoiceNumber || 'Invoice'}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    generateInvoicePDF(invoice, res);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ success: false, message: 'Failed to generate PDF' });
  }
});

/**
 * POST /api/invoices/preview-pdf
 * Generate and stream PDF from arbitrary draft payload without saving
 */
router.post('/preview-pdf', (req, res) => {
  try {
    const draftData = req.body;
    const totals = calculateTotals(draftData.items, draftData.discountRate, draftData.taxRate);
    const invoice = {
      ...draftData,
      ...totals,
      invoiceNumber: draftData.invoiceNumber || 'PREVIEW-DRAFT',
    };

    const filename = `${invoice.invoiceNumber}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

    generateInvoicePDF(invoice, res);
  } catch (error) {
    console.error('Error previewing PDF:', error);
    res.status(500).json({ success: false, message: 'Failed to generate preview PDF' });
  }
});

module.exports = router;
