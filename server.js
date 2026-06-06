const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(express.json());

const shipments = {
  'ZAJ-12345678': { status: 'Out for delivery', route: 'Abu Dhabi → Dubai', driver: 'Omar Hassan', eta: 'Today, 5:30 PM' },
  'ZAJ-77881234': { status: 'In transit', route: 'Dubai → Sharjah', driver: 'Hassan Ali', eta: 'Tomorrow, 11:00 AM' }
};

app.get('/api/shipments/:trackingNumber', (req, res) => {
  const trackingNumber = req.params.trackingNumber.toUpperCase();
  const shipment = shipments[trackingNumber];
  if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
  res.json({ trackingNumber, ...shipment });
});

app.use((req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => console.log(`ZAJEL project running on http://localhost:${PORT}`));
