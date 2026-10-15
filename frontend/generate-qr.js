import os from 'os';
import QRCode from 'qrcode';

/**
 * Automatically detects the computer's primary internal IPv4 address
 */
function getLocalIPv4() {
  const interfaces = os.networkInterfaces();

  // 1. Prefer standard private Wi-Fi / Ethernet subnets (192.168.x.x, 10.x.x.x)
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('127.')) {
        if (net.address.startsWith('192.168.') || net.address.startsWith('10.')) {
          return net.address;
        }
      }
    }
  }

  // 2. Fallback to any non-internal IPv4
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('127.')) {
        return net.address;
      }
    }
  }

  return 'localhost';
}

const localIp = getLocalIPv4();
const url = `http://${localIp}:5173`;

console.log('\n\x1b[36m%s\x1b[0m', '════════════════════════════════════════════════════════════');
console.log('\x1b[1m\x1b[35m%s\x1b[0m', '  📱 SCAN QR CODE FOR INSTANT MOBILE ACCESS');
console.log('\x1b[32m%s\x1b[0m', `  🔗 Mobile URL: ${url}`);
console.log('\x1b[36m%s\x1b[0m', '════════════════════════════════════════════════════════════\n');

QRCode.toString(url, { type: 'terminal', small: false }, (err, qrString) => {
  if (err) {
    console.error('Error generating QR code:', err);
    return;
  }
  // Replace ANSI escape background sequences with solid unicode blocks for maximum contrast
  const formatted = qrString
    .replace(/\u001b\[40m  \u001b\[0m/g, '██')
    .replace(/\u001b\[47m  \u001b\[0m/g, '  ');

  console.log(formatted);
  console.log('\n\x1b[90m%s\x1b[0m', `  Connect your phone to the same Wi-Fi and open ${url}\n`);
});
