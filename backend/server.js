require('dotenv').config();
const express = require('express');
const cors = require('cors');
const os = require('os');
const qrcode = require('qrcode-terminal');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();
const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0';

/**
 * Detects internal IPv4 LAN address
 */
function getLocalIPv4() {
  const interfaces = os.networkInterfaces();

  // Prefer standard private Wi-Fi / Ethernet subnets (192.168.x.x, 10.x.x.x)
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('127.')) {
        if (net.address.startsWith('192.168.') || net.address.startsWith('10.')) {
          return net.address;
        }
      }
    }
  }

  // Fallback to any active non-internal IPv4
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('127.')) {
        return net.address;
      }
    }
  }

  return 'localhost';
}

// Allowed CORS Origins (including live Vercel frontend, local dev & network IPs)
const allowedOrigins = [
  'https://invoice-generator-app-snowy-five.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile curl, health checks)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.includes('192.168.') ||
      origin.includes('localhost')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Freelance Invoice Generator API',
    timestamp: new Date().toISOString()
  });
});

// Invoices Routes
app.use('/api/invoices', invoiceRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, HOST, () => {
  const localIp = getLocalIPv4();
  const networkApiUrl = `http://${localIp}:${PORT}/api/invoices`;
  const localApiUrl = `http://localhost:${PORT}/api/invoices`;

  console.log('\n\x1b[36m%s\x1b[0m', '════════════════════════════════════════════════════════════');
  console.log('\x1b[1m\x1b[32m%s\x1b[0m', `  🚀 Backend running on 0.0.0.0:${PORT} (Network Exposed)`);
  console.log('\x1b[33m%s\x1b[0m', `  💻 Local API:    ${localApiUrl}`);
  console.log('\x1b[35m%s\x1b[0m', `  📱 Network API:  ${networkApiUrl}`);
  console.log('\x1b[36m%s\x1b[0m', '════════════════════════════════════════════════════════════\n');

  console.log('  SCAN QR CODE TO CHECK BACKEND INVOICES STATUS ON YOUR PHONE:\n');

  qrcode.generate(networkApiUrl, { small: false }, (qrString) => {
    // Replace ANSI background escape sequences with solid high-contrast Unicode blocks
    const formatted = qrString
      .replace(/\u001b\[40m  \u001b\[0m/g, '██')
      .replace(/\u001b\[47m  \u001b\[0m/g, '  ');
    console.log(formatted);
  });

  console.log('\n\x1b[90m%s\x1b[0m\n', `  Connected to ${networkApiUrl}`);
});
