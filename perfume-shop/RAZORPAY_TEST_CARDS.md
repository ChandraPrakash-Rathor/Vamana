# Razorpay Test Cards & Payment Methods 💳

## Test Mode Requirements
Make sure you're using **TEST API Keys** (not LIVE keys):
- Test Key ID starts with: `rzp_test_`
- Test Secret starts with: (test secret)

---

## 🎯 Test Credit/Debit Cards

### ✅ Successful Payment Cards

#### 1. Domestic Card (Most Common)
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits (e.g., 123)
Expiry: Any future date (e.g., 12/25)
Name: Any name
```

#### 2. Mastercard
```
Card Number: 5555 5555 5555 4444
CVV: Any 3 digits (e.g., 123)
Expiry: Any future date (e.g., 12/25)
Name: Any name
```

#### 3. Rupay Card
```
Card Number: 6522 2100 0000 0000
CVV: Any 3 digits (e.g., 123)
Expiry: Any future date (e.g., 12/25)
Name: Any name
```

#### 4. American Express
```
Card Number: 3782 822463 10005
CVV: Any 4 digits (e.g., 1234)
Expiry: Any future date (e.g., 12/25)
Name: Any name
```

---

## ❌ Failed Payment Cards (For Testing Failures)

### Card Declined
```
Card Number: 4000 0000 0000 0002
CVV: Any 3 digits
Expiry: Any future date
Result: Payment will be declined
```

### Insufficient Funds
```
Card Number: 4000 0000 0000 9995
CVV: Any 3 digits
Expiry: Any future date
Result: Insufficient funds error
```

### Invalid CVV
```
Card Number: 4111 1111 1111 1111
CVV: 000
Expiry: Any future date
Result: Invalid CVV error
```

---

## 🏦 Test UPI IDs

### Successful UPI Payment
```
UPI ID: success@razorpay
Result: Payment successful
```

### Failed UPI Payment
```
UPI ID: failure@razorpay
Result: Payment failed
```

---

## 📱 Test Wallets

### Paytm
- Select Paytm wallet
- Use any mobile number
- OTP: `123456` (any 6 digits work in test mode)

### PhonePe
- Select PhonePe
- Use any mobile number
- Will auto-succeed in test mode

### Google Pay
- Select Google Pay
- Will auto-succeed in test mode

---

## 🏦 Test Net Banking

### Successful Bank
- Select any bank from the list
- Username: Any
- Password: Any
- Result: Payment successful

### Failed Bank
- Select "Test Bank - Failure"
- Result: Payment will fail

---

## 💰 Test EMI Cards

```
Card Number: 4012 0010 3714 8905
CVV: 123
Expiry: Any future date
Result: Shows EMI options
```

---

## 🔐 Test 3D Secure (OTP)

### Card with 3D Secure
```
Card Number: 5104 0600 0000 0008
CVV: 123
Expiry: Any future date
OTP: 123456 (any 6 digits)
Result: Payment successful after OTP
```

---

## 📋 Quick Test Scenarios

### Scenario 1: Successful Payment Flow
1. Add products to cart
2. Go to checkout
3. Fill shipping details
4. Select "Pay Online"
5. Use card: `4111 1111 1111 1111`
6. CVV: `123`, Expiry: `12/25`
7. Click Pay
8. ✅ Payment Success → Redirects to Invoice

### Scenario 2: Failed Payment Flow
1. Add products to cart
2. Go to checkout
3. Fill shipping details
4. Select "Pay Online"
5. Use card: `4000 0000 0000 0002`
6. CVV: `123`, Expiry: `12/25`
7. Click Pay
8. ❌ Payment Failed → Shows error message

### Scenario 3: UPI Payment
1. Add products to cart
2. Go to checkout
3. Fill shipping details
4. Select "Pay Online"
5. Choose UPI option
6. Enter: `success@razorpay`
7. ✅ Payment Success

### Scenario 4: COD (No Razorpay)
1. Add products to cart
2. Go to checkout
3. Fill shipping details
4. Select "Cash on Delivery"
5. Click "Place Order"
6. ✅ Order Placed → Redirects to Invoice

---

## 🎨 Test in Razorpay Dashboard

### View Test Payments
1. Login to Razorpay Dashboard
2. Switch to **Test Mode** (toggle at top)
3. Go to **Transactions** → **Payments**
4. See all test payments here

### Test Webhooks
1. Go to **Settings** → **Webhooks**
2. Add webhook URL: `https://your-domain.com/api/webhook`
3. Test payments will trigger webhooks

---

## 💡 Important Notes

### ✅ DO's
- Always use test cards in test mode
- Test both success and failure scenarios
- Test different payment methods (Card, UPI, Wallet)
- Verify order creation in your database
- Check invoice generation
- Test COD separately (doesn't use Razorpay)

### ❌ DON'Ts
- Never use real card details in test mode
- Don't use test cards in live mode
- Don't share test API keys publicly
- Don't test with actual money

---

## 🔍 Debugging Tips

### Payment Not Working?
1. Check if using TEST API keys (not LIVE)
2. Verify Razorpay script is loaded: `window.Razorpay`
3. Check browser console for errors
4. Verify order creation API is working
5. Check if amount is in paise (multiply by 100)

### Order Not Creating?
1. Check backend logs
2. Verify MongoDB connection
3. Check if user is authenticated
4. Verify cart has items
5. Check shipping address is filled

### Payment Success but Order Not Saved?
1. Check `verifyPayment` API
2. Verify signature validation
3. Check database connection
4. Look for errors in backend logs

---

## 📞 Common Test Amounts

```javascript
// Test with different amounts
₹1 = 100 paise
₹10 = 1000 paise
₹100 = 10000 paise
₹500 = 50000 paise
₹1000 = 100000 paise
```

---

## 🚀 Quick Start Testing

### Step 1: Start Backend
```bash
cd Backend
npm start
```

### Step 2: Start Frontend
```bash
cd member
npm start
```

### Step 3: Test Payment
1. Open: `http://localhost:3000`
2. Add products to cart
3. Go to checkout
4. Use test card: `4111 1111 1111 1111`
5. Complete payment
6. Check invoice page

---

## 📊 Test Checklist

- [ ] Successful card payment
- [ ] Failed card payment
- [ ] UPI payment
- [ ] Wallet payment
- [ ] Net banking
- [ ] COD order
- [ ] Order appears in admin dashboard
- [ ] Invoice generation
- [ ] Email notification (if configured)
- [ ] Payment status update
- [ ] Cart cleared after payment
- [ ] Razorpay dashboard shows payment

---

## 🎯 Most Used Test Card (Copy This!)

```
Card: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
Name: Test User
```

This card works 99% of the time for testing! 🎉

---

## 📱 Mobile Testing

### Test on Mobile Browser
1. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Access: `http://YOUR_IP:3000`
3. Test payment on mobile device
4. Use same test cards

---

## 🔐 Security Notes

- Test mode payments are NOT real
- No actual money is charged
- Test data is separate from live data
- Switch to LIVE mode only when ready for production
- Never commit API keys to GitHub

---

## 📞 Support

If payment still not working:
1. Check Razorpay Dashboard logs
2. Check browser console
3. Check backend server logs
4. Verify API keys are correct
5. Contact Razorpay support (for test mode issues)

---

**Happy Testing! 🎉**
