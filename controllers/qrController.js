const QRCode = require('qrcode');

const generateQR = async (req, res) => {
  const { group } = req.body;
  try {
    if (!group) {
      return res.status(400).json({ message: 'Group is required' });
    }
    const qrCode = await QRCode.toDataURL(group);
    res.json({ qrCode });
  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { generateQR };