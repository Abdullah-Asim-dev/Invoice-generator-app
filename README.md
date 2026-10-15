<div align="center">

  # ⚡ InvoiceForge Studio
  ### *Autonomous Full-Stack Freelance Invoicing & High-Fidelity Vector PDF Engine*

  <p align="center">
    A production-grade, distributed financial management studio engineered for independent consultants, contractors, and agency teams. Built with a decoupled dual-tier architecture featuring real-time state synchronization, instant vector document compilation, and an ultra-modern Linear/Stripe design system.
  </p>

  <p align="center">
    <a href="https://invoice-generator-app-snowy-five.vercel.app/" target="_blank">
      <img src="https://img.shields.io/badge/Frontend-Vercel%20Production-black?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel Live Frontend" />
    </a>
    <a href="https://invoice-generator-app-ha6w.onrender.com/api/health" target="_blank">
      <img src="https://img.shields.io/badge/Backend-Render%20Live-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render Live Backend" />
    </a>
    <img src="https://img.shields.io/badge/Status-Active%20Deployment-emerald?style=for-the-badge&logo=githubactions&logoColor=white" alt="Deployment Status" />
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 18" />
    <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express-4.19-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/PDFKit-Vector%20Engine-E11D48?style=flat-square&logo=adobeacrobatreader&logoColor=white" alt="PDFKit" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="MIT License" />
  </p>

  ---

  ### 🔗 Live Environments

  | Component | Environment | Live Endpoint | Status |
  | :--- | :--- | :--- | :--- |
  | **Client App** | Production (Vercel) | [https://invoice-generator-app-snowy-five.vercel.app](https://invoice-generator-app-snowy-five.vercel.app) | `ONLINE` |
  | **REST API Engine** | Production (Render) | [https://invoice-generator-app-ha6w.onrender.com](https://invoice-generator-app-ha6w.onrender.com) | `ONLINE` |
  | **Health Check** | Diagnostics (Render) | [https://invoice-generator-app-ha6w.onrender.com/api/health](https://invoice-generator-app-ha6w.onrender.com/api/health) | `HEALTHY` |
  | **Invoices Ledger** | Data Service | [https://invoice-generator-app-ha6w.onrender.com/api/invoices](https://invoice-generator-app-ha6w.onrender.com/api/invoices) | `200 OK` |

</div>

---

## 🎯 Executive Overview & Architecture Dialect

InvoiceForge was engineered from the ground up to eliminate billing friction for independent developers and digital consultancies. It merges **event-driven frontend reactivity** with **server-side high-fidelity vector compilation** to deliver instant document rendering, real-time analytics aggregation, and professional accounting workflows.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (Vercel / Mobile)                  │
│                                                                        │
│   React 18 + Vite SPA  ◄──►  State Synchronization Layout (Split View) │
│            │                                                           │
│            ▼                                                           │
│   Dynamic API Client  (Automatic Hostname Resolution & Failover)       │
└───────────────────────────┬────────────────────────────────────────────┘
                            │ HTTPS / REST (JSON + PDF Streams)
                            ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        SERVER LAYER (Render Cloud)                     │
│                                                                        │
│   Express.js Application Gateway (CORS Whitelisted + JSON Body Parser) │
│            │                                                           │
│   ┌────────┴─────────────┬──────────────────────────┐                  │
│   ▼                      ▼                          ▼                  │
│ [Invoice Service]   [PDFKit Engine]        [Persistent Store]          │
│ Math Computation    High-Res Vector Stream Local / Distributed Data    │
│ (Taxes, Discounts)  (A4 Dynamic Layout)    (invoices.json Store)       │
└────────────────────────────────────────────────────────────────────────┘
```

### 🧠 Core Architectural Tenets:

- **Decoupled Dual-Tier Topology**: Distinct separation of presentation and compilation layers, providing elastic independent scaling between client asset delivery and compute-intensive PDF rendering.
- **Server-Side High-Fidelity Vector Compilation**: Offloads document generation to a headless, low-overhead Node runtime using `PDFKit`. Generates byte-perfect vector documents with calibrated typographical hierarchy, dynamic page budget calculation, and sub-millimeter coordinate grids.
- **State Synchronization Layout**: Bidirectional reactive form fields that pipe state mutations synchronously to both arithmetic ledger computation and live visual preview modules.
- **Resilient Multi-Environment API Client**: Dynamic endpoint resolution engine that automatically pivots between localhost development proxying, local area network (LAN) mobile testing, and production cloud endpoints with zero code alterations.

---

## ✨ Product Features

- 📑 **Live Split-Screen Preview Studio**: Side-by-side interactive paper visualizer mirroring server-side PDF output with real-time keystroke synchronization.
- 🖨️ **Server-Side Vector PDF Engine**: Direct binary streaming of publication-grade vector invoices with zero native browser/Chromium bloat.
- 📊 **Dynamic Metrics & Analytics Engine**: Instant computational ledger aggregating Gross Revenue Collected, Unpaid/Pending Capital In-Flight, and Invoice Volume tallies.
- 🎛️ **Granular Financial Adjustments**: Dynamic line-item multiplication, auto-computed subtotals, tax rate percentage additions, and early-settlement discount algorithms.
- 🎨 **Linear/Stripe-Inspired Design System**: Borderless cards, ambient depth shadows (`shadow-paper`, `shadow-xs`), Zinc-neutral typography scale, and an Electric Violet/Indigo accent palette.
- 📱 **Adaptive Ergonomic Viewports**: Desktop multi-column split view that gracefully transforms into an ergonomic segmented tab interface on mobile viewports.
- 📶 **Zero-Config LAN Exposure & QR Terminal**: Automated IPv4 discovery with immediate Unicode ASCII QR code terminal generation for frictionless mobile verification.
- 🏷️ **Lifecycle Status Matrix**: One-click transactional status transitions (`Paid`, `Pending`, `Draft`) with real-time UI indicator updates.

---

## 🛠️ Technology Matrix

| Layer | Technology | Key Capabilities |
| :--- | :--- | :--- |
| **Frontend Core** | **React 18.3** | Component composition, hooks, optimistic status updates |
| **Build Tooling** | **Vite 5.4** | Instant HMR, lightning-fast tree-shaking, Rollup production bundling |
| **Styling & Tokens** | **Tailwind CSS 3.4** | Utility-first CSS, custom design tokens, backdrop-filter glassmorphism |
| **Typography** | **Inter + Feature Ligatures** | Tabular numbers, optical sizing (`cv02`, `cv03`, `cv04`, `cv11`) |
| **Icons** | **Lucide React** | Clean, lightweight modern SVG micro-icons |
| **Backend Core** | **Node.js + Express 4.19** | Asynchronous non-blocking event loop, CORS policy enforcement |
| **PDF Generation** | **PDFKit 0.15** | Vector typography, dynamic line wrapping, streamable binary buffers |
| **Network Discovery**| **qrcode + os** | Automated internal network interface resolution & terminal QR matrix |
| **Hosting (Client)**| **Vercel Edge** | Global CDN caching, edge asset deployment |
| **Hosting (API)** | **Render Cloud** | Fully managed containerized web service with automated CD pipeline |

---

## 📡 REST API Specifications

The backend exposes a clean, RESTful resource interface supporting JSON payloads and binary PDF streams:

```http
BASE_URL: https://invoice-generator-app-ha6w.onrender.com/api
```

| Method | Endpoint | Description | Response Type |
| :---: | :--- | :--- | :--- |
| `GET` | `/health` | Service uptime diagnostics & node status | `application/json` |
| `GET` | `/invoices` | List invoices with optional `?status=Paid` and `?search=Acme` | `application/json` |
| `GET` | `/invoices/stats` | Computational metrics: Total Earned, Pending Balance, Counts | `application/json` |
| `GET` | `/invoices/:id` | Fetch single invoice document by ID | `application/json` |
| `POST` | `/invoices` | Create invoice with auto-calculated subtotals, tax, and total | `application/json` |
| `PUT` | `/invoices/:id` | Full document update and ledger recalculation | `application/json` |
| `PATCH`| `/invoices/:id/status`| Transactional status toggle (`Paid`, `Pending`, `Draft`) | `application/json` |
| `DELETE`| `/invoices/:id` | Safe document purge from persistent store | `application/json` |
| `GET` | `/invoices/:id/pdf` | Server-side vector PDF stream (`Content-Disposition: attachment`)| `application/pdf` |
| `POST` | `/invoices/preview-pdf`| Real-time draft vector PDF generation from payload without saving | `application/pdf` |

---

## 💻 Local Development & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone Repository
```bash
git clone https://github.com/Abdullah-Asim-dev/Invoice-generator-app.git
cd Invoice-generator-app
```

### 2. Install Workspace Dependencies
```bash
# Installs backend, frontend, and root tooling in one shot
npm run install:all
```

### 3. Launch Development Servers

You can run both tiers concurrently or in dedicated terminal windows:

#### Start Backend Engine (Port 5001):
```bash
npm run dev:backend
# API is accessible at http://localhost:5001 and across your LAN
```

#### Start Frontend Studio (Port 5173):
```bash
npm run dev:frontend
# Vite automatically prints local URL and mobile-scannable QR code in your terminal
```

---

## 📱 Mobile Network Testing & Terminal QR Codes

The development ecosystem includes an automated LAN discovery daemon. When you boot the frontend or backend, it inspects your local network interfaces via Node's `os` module and generates a high-contrast terminal QR code:

```text
════════════════════════════════════════════════════════════
  📱 SCAN QR CODE FOR INSTANT MOBILE ACCESS
  🔗 Mobile URL: http://192.168.100.75:5173
════════════════════════════════════════════════════════════

  ██████████████  ████        ██████  ██████████████  
  ██          ██  ████  ██  ██    ██  ██          ██  
  ██  ██████  ██  ██████    ████████  ██  ██████  ██  
  ██  ██████  ██    ██  ████  ██████  ██  ██████  ██  
  ██  ██████  ██  ██  ████  ██  ████  ██  ██████  ██  
  ██          ██          ██  ██      ██          ██  
  ██████████████  ██  ██  ██  ██  ██  ██████████████  
```

To reprint the QR code at any time without restarting the server:
```bash
npm run qr
```

---

## 📁 Repository Directory Structure

```text
Invoice-generator-app/
├── backend/
│   ├── data/
│   │   └── invoices.json          # Persistent JSON store seeded with realistic client invoices
│   ├── routes/
│   │   └── invoiceRoutes.js      # REST API route definitions & PDF stream handlers
│   ├── services/
│   │   ├── invoiceService.js     # Arithmetic computation & data access abstraction layer
│   │   └── pdfService.js         # Vector PDFKit compilation engine (A4 grid, typography)
│   ├── server.js                 # Express server with CORS whitelist & LAN discovery
│   ├── package.json              # Backend dependencies (Express, PDFKit, UUID, CORS)
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardMetrics.jsx # KPI cards (Total Earned, In-Flight, Settlement count)
│   │   │   ├── InvoiceList.jsx      # Ledger view with segmented filter pills & dot badges
│   │   │   ├── InvoiceForm.jsx      # Dynamic form with itemized deliverables & tax rates
│   │   │   └── InvoicePreview.jsx   # Live paper visualizer with one-click export button
│   │   ├── services/
│   │   │   └── api.js               # Resilient fetch client with Render production fallback
│   │   ├── App.jsx                  # Root state orchestration & responsive split layout
│   │   ├── index.css                # Custom scrollbars, Inter font configuration
│   │   └── main.jsx
│   ├── generate-qr.js               # Internal IPv4 auto-detection script
│   ├── vite.config.js               # Dev server configuration with network host enabled
│   ├── tailwind.config.js           # Design tokens, Electric Violet/Zinc color palette
│   └── package.json                 # Frontend dependencies (React 18, Vite, Lucide, Tailwind)
├── package.json                     # Root orchestrator scripts
├── show-qr.js                       # Standalone LAN QR printer utility
└── README.md                        # Documentation & engineering overview
```

---

<div align="center">

  <br />

  ### 🚀 Developed with precision by **Abdullah Asim**
  *Full-Stack Systems & AI Engineering Portfolio*

  <p>
    <a href="https://github.com/Abdullah-Asim-dev" target="_blank">
      <img src="https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
    </a>
    <a href="https://invoice-generator-app-snowy-five.vercel.app/" target="_blank">
      <img src="https://img.shields.io/badge/Live%20App-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
    </a>
  </p>

  <p text-xs text-muted>
    Released under the MIT License • © 2026 Abdullah Asim. All rights reserved.
  </p>

</div>
