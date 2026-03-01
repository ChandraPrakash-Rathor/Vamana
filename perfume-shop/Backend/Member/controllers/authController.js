const Member = require('../models/Member');
const { generateToken } = require('../../utils/jwtHelper');

exports.checkPhone = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Please provide phone number' });
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit phone number' });
    }
    const member = await Member.findOne({ phone });
    if (member) {
      if (!member.status) {
        return res.status(401).json({ success: false, message: 'Your account has been deactivated' });
      }
      const token = generateToken(member);
      return res.json({
        success: true,
        exists: true,
        message: 'Login successful',
        token,
        user: { id: member._id, name: member.name, email: member.email, phone: member.phone }
      });
    } else {
      return res.json({ success: true, exists: false, message: 'Phone number not registered. Please complete registration.', phone });
    }
  } catch (error) {
    console.error('Check phone error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide name and phone number' });
    }
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide email address' });
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit phone number' });
    }
    const existingMember = await Member.findOne({ phone });
    if (existingMember) {
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }
    const existingEmail = await Member.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const member = await Member.create({ name, email, phone });
    const token = generateToken(member);
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: { id: member._id, name: member.name, email: member.email, phone: member.phone }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    if (!req.member) {
      return res.status(500).json({ success: false, message: 'Member not attached to request' });
    }
    const member = await Member.findById(req.member._id).select('-password');
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    res.json({
      success: true,
      user: { id: member._id, name: member.name, email: member.email, phone: member.phone, status: member.status, createdAt: member.createdAt }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    if (!req.member) {
      return res.status(500).json({ success: false, message: 'Member not attached to request' });
    }
    const { name, email } = req.body;
    if (email && email !== req.member.email) {
      const existingEmail = await Member.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
    }
    const member = await Member.findByIdAndUpdate(req.member._id, { name, email }, { new: true, runValidators: true }).select('-password');
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: { id: member._id, name: member.name, email: member.email, phone: member.phone, status: member.status }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
