const axios = require('axios');

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID || 'VMNAPR'; // 6-char sender ID
const MSG91_TEMPLATE_ID_OTP = process.env.MSG91_TEMPLATE_ID_OTP;
const MSG91_TEMPLATE_ID_ORDER = process.env.MSG91_TEMPLATE_ID_ORDER;
const MSG91_TEMPLATE_ID_REGISTER = process.env.MSG91_TEMPLATE_ID_REGISTER;

/**
 * Send SMS via MSG91 Flow API
 * @param {string} phone - 10-digit Indian mobile number
 * @param {string} templateId - MSG91 template ID
 * @param {object} variables - Template variables e.g. { name: 'John', otp: '1234' }
 */
const sendSMS = async (phone, templateId, variables = {}) => {
  if (!MSG91_AUTH_KEY) {
    console.warn('⚠️ MSG91_AUTH_KEY not set — SMS skipped');
    return { success: false, message: 'SMS service not configured' };
  }

  try {
    const mobile = `91${phone}`; // Add country code

    const payload = {
      template_id: templateId,
      short_url: '0',
      realTimeResponse: '1',
      recipients: [
        {
          mobiles: mobile,
          ...variables
        }
      ]
    };

    const response = await axios.post(
      'https://api.msg91.com/api/v5/flow/',
      payload,
      {
        headers: {
          'authkey': MSG91_AUTH_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.type === 'success') {
      console.log(`✅ SMS sent to ${phone}`);
      return { success: true, data: response.data };
    } else {
      console.error(`❌ MSG91 error:`, response.data);
      return { success: false, message: response.data.message };
    }
  } catch (err) {
    console.error('❌ SMS send error:', err.response?.data || err.message);
    return { success: false, message: err.message };
  }
};

/**
 * Send Welcome / Registration SMS
 * Template variables: ##name##
 */
const sendRegistrationSMS = async (phone, name) => {
  if (!MSG91_TEMPLATE_ID_REGISTER) {
    console.warn('⚠️ MSG91_TEMPLATE_ID_REGISTER not set — skipped');
    return;
  }
  return sendSMS(phone, MSG91_TEMPLATE_ID_REGISTER, { name });
};

/**
 * Send Login Welcome Back SMS
 * Template variables: ##name##
 */
const sendLoginSMS = async (phone, name) => {
  // Optional — only send if template is configured
  if (!process.env.MSG91_TEMPLATE_ID_LOGIN) return;
  return sendSMS(phone, process.env.MSG91_TEMPLATE_ID_LOGIN, { name });
};

/**
 * Send Order Placed Confirmation SMS
 * Template variables: ##name##, ##orderid##, ##amount##
 */
const sendOrderPlacedSMS = async (phone, name, orderId, amount) => {
  if (!MSG91_TEMPLATE_ID_ORDER) {
    console.warn('⚠️ MSG91_TEMPLATE_ID_ORDER not set — skipped');
    return;
  }
  const shortOrderId = orderId.toString().slice(-8).toUpperCase();
  return sendSMS(phone, MSG91_TEMPLATE_ID_ORDER, {
    name,
    orderid: shortOrderId,
    amount: `₹${amount}`
  });
};

module.exports = { sendSMS, sendRegistrationSMS, sendLoginSMS, sendOrderPlacedSMS };
