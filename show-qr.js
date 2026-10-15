const os = require('os');
const qrcode = require('qrcode-terminal');

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      // Find non-internal IPv4
      if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('127.')) {
        // Prefer standard local Wi-Fi / Ethernet subnets (192.168.x.x, 10.x.x.x)
        if (net.address.startsWith('192.168.') || net.address.startsWith('10.')) {
          return net.address;
        }
      }
    }
  }
  // Fallback to any non-internal IPv4
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const localIp = getLocalIp();
const url = `http://${localIp}:5173`;

console.log('\n======================================================');
console.log(`📱 Mobile Local Network URL: ${url}`);
console.log('======================================================\n');

qrcode.generate(url, { small: false }, (qr) => {
  // Replace ANSI background escape sequences with visible Unicode blocks
  const formatted = qr
    .replace(/\u001b\[40m  \u001b\[0m/g, '██')
    .replace(/\u001b\[47m  \u001b\[0m/g, '  ');
  console.log(formatted);
});

console.log('\nScan the QR code above with your phone camera or QR scanner app.');
console.log(`Make sure your phone is connected to the same Wi-Fi network.\n`);
