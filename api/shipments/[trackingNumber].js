const shipments = {
  'ZAJ-12345678': {
    status: 'Out for delivery',
    route: 'Abu Dhabi → Dubai',
    driver: 'Omar Hassan',
    eta: 'Today, 5:30 PM',
    steps: ['Shipment created', 'Received at Abu Dhabi hub', 'In transit', 'Out for delivery']
  },
  'ZAJ-77881234': {
    status: 'In transit',
    route: 'Dubai → Sharjah',
    driver: 'Hassan Ali',
    eta: 'Tomorrow, 11:00 AM',
    steps: ['Shipment created', 'Picked up', 'In transit']
  }
};

module.exports = (req, res) => {
  const trackingNumber = String(req.query.trackingNumber || '').toUpperCase();
  const shipment = shipments[trackingNumber];

  if (!shipment) {
    return res.status(404).json({ message: 'Shipment not found' });
  }

  return res.status(200).json({ trackingNumber, ...shipment });
};
