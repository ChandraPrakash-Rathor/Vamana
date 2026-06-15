const Newsletter = require('../models/Newsletter');

// GET /api/admin/newsletter — get all subscribers
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 }).lean();
    return res.json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/newsletter/:id — remove a subscriber
exports.deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Subscriber not found' });
    }
    return res.json({ success: true, message: 'Subscriber removed' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
