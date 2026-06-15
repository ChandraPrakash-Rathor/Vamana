const Newsletter = require('../../Admin/models/Newsletter');

// POST /api/member/newsletter/subscribe
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'This email is already subscribed' });
    }

    await Newsletter.create({ email });

    return res.json({ success: true, message: 'Successfully subscribed to newsletter!' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'This email is already subscribed' });
    }
    return res.status(500).json({ success: false, message: 'Something went wrong, please try again' });
  }
};
