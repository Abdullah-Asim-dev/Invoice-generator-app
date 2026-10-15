# Freelance Invoice Generator 🚀

A modern, full-stack application designed specifically for freelancers, consultants, and contractors to track billables, manage invoices, preview documents in real-time, and generate server-side vector PDF invoices with PDFKit.

---

## 🌐 Live Production Deployment

- **Live Frontend Dashboard (Vercel)**: [https://invoice-generator-app-snowy-five.vercel.app](https://invoice-generator-app-snowy-five.vercel.app)
- **Production Backend API (Render)**: [https://invoice-generator-app-ha6w.onrender.com](https://invoice-generator-app-ha6w.onrender.com)
- **Health Check Endpoint**: [https://invoice-generator-app-ha6w.onrender.com/api/health](https://invoice-generator-app-ha6w.onrender.com/api/health)
- **Invoices API**: [https://invoice-generator-app-ha6w.onrender.com/api/invoices](https://invoice-generator-app-ha6w.onrender.com/api/invoices)

---

## 🏗️ Architecture & Tech Stack

```
Invoice-generator-app/
├── backend/
│   ├── data/
│   │   └── invoices.json          # Persistent JSON database (seeded with sample data)
│   ├── routes/
│   │   └── invoiceRoutes.js      # REST API: CRUD + PDF streaming endpoints
│   ├── services/
│   │   ├── invoiceService.js     # Business logic & totals calculation (subtotal, tax, discount)
│   │   └── pdfService.js         # Server-side professional PDF generation (PDFKit)
│   ├── package.json              # Express, CORS, PDFKit, UUID, Dotenv
│   ├── server.js                 # Express server on port 5000
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardMetrics.jsx # Total Earned, Pending, Paid, Draft cards
│   │   │   ├── InvoiceList.jsx      # Filterable & searchable invoice ledger
│   │   │   ├── InvoiceForm.jsx      # Client info, dynamic line items, taxes, discounts
│   │   │   └── InvoicePreview.jsx   # Live paper-style preview matching PDFKit layout
│   │   ├── services/
│   │   │   └── api.js               # Clean fetch service with PDF download handling
│   │   ├── App.jsx                  # Main dashboard state & split-view workspace
│   │   ├── main.jsx
│   │   └── index.css                # Tailwind directives
│   ├── index.html
│   ├── package.json                 # React 18, Vite, Tailwind CSS, Lucide-React
│   ├── vite.config.js               # Dev server on port 5173 with API proxy
│   └── tailwind.config.js
└── package.json                     # Workspace root helper scripts
```

### Backend:
- **Runtime**: Node.js + Express.js
- **PDF Engine**: PDFKit (pure JavaScript vector PDF generation with custom layout, typography, tables, and accents)
- **Data Layer**: File-backed JSON store with UUID generation and sample mock invoices

### Frontend:
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom Inter typography
- **Icons**: Lucide React
- **Features**: Live split-screen preview, instant search, status filtering, one-click PDF export, and financial calculations (tax & discounts).

---

## ⚡ Installation & Run Commands

### 1. Install Dependencies
Run in your terminal from the root folder:
```bash
npm run install:all
```
*(Or individually: `cd backend && npm install` then `cd ../frontend && npm install`)*

### 2. Start Backend Server
```bash
npm run start:backend
# Runs at http://localhost:5000
```

### 3. Start Frontend App
```bash
npm run dev:frontend
# Runs at http://localhost:5173
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/invoices/stats` | Returns aggregate dashboard metrics (Total Earned, Pending, Counts) |
| `GET` | `/api/invoices` | List invoices with optional `?status=Paid` or `?search=Acme` |
| `GET` | `/api/invoices/:id` | Get details of a single invoice |
| `POST` | `/api/invoices` | Create a new invoice (auto calculates totals) |
| `PUT` | `/api/invoices/:id` | Update an existing invoice |
| `PATCH` | `/api/invoices/:id/status` | Quick status change (`Paid`, `Pending`, `Draft`) |
| `DELETE` | `/api/invoices/:id` | Delete an invoice |
| `GET` | `/api/invoices/:id/pdf` | Generate and download the invoice as a PDF file |
| `POST` | `/api/invoices/preview-pdf`| Generate and download a PDF directly from a draft payload |
