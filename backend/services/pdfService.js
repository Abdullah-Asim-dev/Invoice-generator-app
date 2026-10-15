const PDFDocument = require('pdfkit');

/**
 * Formats numbers into currency format
 */
function formatCurrency(amount, currency = 'USD') {
  const symbolMap = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    AUD: 'A$',
    INR: '₹',
  };
  const symbol = symbolMap[currency] || `${currency} `;
  return `${symbol}${Number(amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Builds a professional vector PDF using PDFKit
 * @param {Object} invoice 
 * @param {stream.Writable} res 
 */
function generateInvoicePDF(invoice, res) {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 45,
    info: {
      Title: `Invoice ${invoice.invoiceNumber || 'Draft'}`,
      Author: invoice.sender?.name || 'Freelancer',
      Subject: 'Invoice Document',
    },
  });

  doc.pipe(res);

  const primaryColor = '#1e293b'; // Slate 800
  const accentColor = '#3b82f6';  // Blue 500
  const secondaryColor = '#64748b'; // Slate 500
  const lightBg = '#f8fafc';       // Slate 50
  const borderColor = '#e2e8f0';   // Slate 200

  // 1. Header Banner
  doc.rect(45, 45, 505, 5).fill(accentColor);

  // Freelancer Info / Title
  doc
    .fontSize(22)
    .font('Helvetica-Bold')
    .fillColor(primaryColor)
    .text(invoice.sender?.company || invoice.sender?.name || 'FREELANCE STUDIO', 45, 65);

  doc
    .fontSize(9)
    .font('Helvetica')
    .fillColor(secondaryColor)
    .text(invoice.sender?.name ? `${invoice.sender.name} • ${invoice.sender.email || ''}` : '', 45, 92)
    .text(invoice.sender?.address ? `${invoice.sender.address}, ${invoice.sender.city || ''} ${invoice.sender.state || ''}` : '', 45, 105)
    .text(invoice.sender?.phone || '', 45, 118);

  // Invoice Title & Status
  doc
    .fontSize(26)
    .font('Helvetica-Bold')
    .fillColor(primaryColor)
    .text('INVOICE', 350, 65, { align: 'right' });

  doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .fillColor(secondaryColor)
    .text(`# ${invoice.invoiceNumber || 'DRAFT'}`, 350, 95, { align: 'right' });

  // Status Badge
  const status = (invoice.status || 'Pending').toUpperCase();
  const badgeColor = status === 'PAID' ? '#10b981' : status === 'PENDING' ? '#f59e0b' : '#64748b';
  doc
    .roundedRect(485, 115, 65, 18, 4)
    .fill(badgeColor);
  doc
    .fontSize(8)
    .font('Helvetica-Bold')
    .fillColor('#ffffff')
    .text(status, 485, 120, { width: 65, align: 'center' });

  // Divider Line
  doc.moveTo(45, 145).lineTo(550, 145).strokeColor(borderColor).lineWidth(1).stroke();

  // 2. Client & Invoice Meta Section
  const metaY = 160;

  // Bill To Box
  doc
    .fontSize(8)
    .font('Helvetica-Bold')
    .fillColor(secondaryColor)
    .text('BILLED TO', 45, metaY);

  doc
    .fontSize(11)
    .font('Helvetica-Bold')
    .fillColor(primaryColor)
    .text(invoice.client?.company || invoice.client?.name || 'Valued Client', 45, metaY + 15);

  doc
    .fontSize(9)
    .font('Helvetica')
    .fillColor(secondaryColor)
    .text(invoice.client?.name && invoice.client?.company ? `Attn: ${invoice.client.name}` : '', 45, metaY + 30)
    .text(invoice.client?.email || '', 45, metaY + 44)
    .text(invoice.client?.address ? `${invoice.client.address}, ${invoice.client.city || ''} ${invoice.client.state || ''}` : '', 45, metaY + 58)
    .text(invoice.client?.country || '', 45, metaY + 72);

  // Meta Details Box
  const metaBoxX = 360;
  doc
    .rect(metaBoxX, metaY - 5, 190, 85)
    .fill(lightBg)
    .strokeColor(borderColor)
    .lineWidth(1)
    .stroke();

  const renderMetaRow = (label, val, y) => {
    doc
      .fontSize(8.5)
      .font('Helvetica')
      .fillColor(secondaryColor)
      .text(label, metaBoxX + 12, y);
    doc
      .fontSize(8.5)
      .font('Helvetica-Bold')
      .fillColor(primaryColor)
      .text(val, metaBoxX + 90, y, { width: 88, align: 'right' });
  };

  renderMetaRow('Issue Date:', invoice.issueDate || 'N/A', metaY + 8);
  renderMetaRow('Due Date:', invoice.dueDate || 'N/A', metaY + 28);
  renderMetaRow('Currency:', invoice.currency || 'USD', metaY + 48);
  renderMetaRow('Total Due:', formatCurrency(invoice.total, invoice.currency), metaY + 65);

  // 3. Line Items Table
  let tableTop = 270;

  // Header background
  doc.rect(45, tableTop, 505, 24).fill(lightBg);

  doc
    .fontSize(8.5)
    .font('Helvetica-Bold')
    .fillColor(secondaryColor)
    .text('DESCRIPTION', 55, tableTop + 7)
    .text('QTY / HRS', 330, tableTop + 7, { width: 60, align: 'right' })
    .text('RATE', 400, tableTop + 7, { width: 65, align: 'right' })
    .text('AMOUNT', 475, tableTop + 7, { width: 65, align: 'right' });

  doc.moveTo(45, tableTop + 24).lineTo(550, tableTop + 24).strokeColor(borderColor).lineWidth(1).stroke();

  let currentY = tableTop + 32;
  const items = invoice.items || [];

  items.forEach((item, index) => {
    // Check if new page needed
    if (currentY > 680) {
      doc.addPage();
      currentY = 50;
    }

    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor(primaryColor)
      .text(item.description || `Item #${index + 1}`, 55, currentY, { width: 260 });

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor(secondaryColor)
      .text(String(item.quantity || 1), 330, currentY, { width: 60, align: 'right' })
      .text(formatCurrency(item.rate, invoice.currency), 400, currentY, { width: 65, align: 'right' });

    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor(primaryColor)
      .text(formatCurrency(item.amount, invoice.currency), 475, currentY, { width: 65, align: 'right' });

    currentY += 24;
    doc.moveTo(45, currentY).lineTo(550, currentY).strokeColor('#f1f5f9').lineWidth(0.5).stroke();
    currentY += 8;
  });

  // 4. Financials / Totals Breakdown
  currentY += 10;
  if (currentY > 650) {
    doc.addPage();
    currentY = 50;
  }

  const totalsX = 350;
  const renderTotalRow = (label, value, isBold = false, color = primaryColor) => {
    doc
      .fontSize(9)
      .font(isBold ? 'Helvetica-Bold' : 'Helvetica')
      .fillColor(secondaryColor)
      .text(label, totalsX, currentY);
    doc
      .fontSize(9)
      .font(isBold ? 'Helvetica-Bold' : 'Helvetica')
      .fillColor(color)
      .text(value, 460, currentY, { width: 80, align: 'right' });
    currentY += 18;
  };

  renderTotalRow('Subtotal:', formatCurrency(invoice.subtotal, invoice.currency));

  if (invoice.discountRate > 0) {
    renderTotalRow(
      `Discount (${invoice.discountRate}%):`,
      `-${formatCurrency(invoice.discountAmount, invoice.currency)}`,
      false,
      '#ef4444'
    );
  }

  if (invoice.taxRate > 0) {
    renderTotalRow(
      `Tax / VAT (${invoice.taxRate}%):`,
      formatCurrency(invoice.taxAmount, invoice.currency)
    );
  }

  currentY += 4;
  doc
    .roundedRect(totalsX - 10, currentY - 4, 210, 32, 4)
    .fill('#eff6ff');

  doc
    .fontSize(11)
    .font('Helvetica-Bold')
    .fillColor(primaryColor)
    .text('TOTAL DUE:', totalsX, currentY + 6);

  doc
    .fontSize(13)
    .font('Helvetica-Bold')
    .fillColor(accentColor)
    .text(formatCurrency(invoice.total, invoice.currency), 450, currentY + 5, { width: 90, align: 'right' });

  currentY += 45;

  // 5. Notes & Payment Details
  if (currentY > 670) {
    doc.addPage();
    currentY = 50;
  }

  if (invoice.paymentDetails || invoice.notes) {
    doc.rect(45, currentY, 505, 1).fill(borderColor);
    currentY += 12;

    if (invoice.paymentDetails) {
      doc
        .fontSize(8.5)
        .font('Helvetica-Bold')
        .fillColor(secondaryColor)
        .text('PAYMENT INSTRUCTIONS & BANK DETAILS', 45, currentY);
      currentY += 12;
      doc
        .fontSize(8.5)
        .font('Helvetica')
        .fillColor(primaryColor)
        .text(invoice.paymentDetails, 45, currentY, { width: 505 });
      currentY += 22;
    }

    if (invoice.notes) {
      doc
        .fontSize(8.5)
        .font('Helvetica-Bold')
        .fillColor(secondaryColor)
        .text('NOTES & TERMS', 45, currentY);
      currentY += 12;
      doc
        .fontSize(8.5)
        .font('Helvetica')
        .fillColor(primaryColor)
        .text(invoice.notes, 45, currentY, { width: 505 });
    }
  }

  // 6. Footer
  const footerY = 770;
  doc.rect(45, footerY, 505, 0.5).fill(borderColor);
  doc
    .fontSize(8)
    .font('Helvetica')
    .fillColor(secondaryColor)
    .text('Thank you for your business! Powered by Freelance Invoice Generator.', 45, footerY + 10, {
      align: 'center',
      width: 505,
    });

  doc.end();
}

module.exports = {
  generateInvoicePDF,
  formatCurrency,
};
