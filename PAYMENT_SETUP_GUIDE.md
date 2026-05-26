# Payment Gateway Setup Guide

## Problem
Your payment is failing with: **"Payment gateway error: Authentication failed"**

This happens because the Razorpay credentials (API Key ID and Secret) are not configured.

---

## Solution: Configure Razorpay Credentials

### 1. Get Your Razorpay Keys (TEST MODE)
- Go to https://dashboard.razorpay.com/app/keys
- You'll see two types of keys:
  - **Test Keys** (for development) - Use these for testing
  - **Live Keys** (for production) - Use these when going live

### 2. Copy Your Test Keys
From the Razorpay dashboard:
- **Key ID** - starts with `rzp_test_...`
- **Key Secret** - a long secret string

### 3. Create `.env` File in Backend Directory

Create a new file: `Backend/.env`
```
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=your_secret_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Install Updated Dependencies
```bash
cd Backend
pip install --upgrade -r requirements.txt
```

This installs the `razorpay==1.3.0` package that was just added.

### 5. Restart Django Server
```bash
python manage.py runserver
```

---

## Verify It Works

1. Go to your payment page in the frontend
2. Select **UPI** payment method
3. Click **Pay with UPI**
4. You should now see the Razorpay payment form (instead of auth error)

---

## Test Payment Details (Development Only)

Use these test card details on Razorpay:
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date (e.g., 12/29)
- **CVV**: Any 3 digits
- **OTP**: 123456

---

## Troubleshooting

### Still getting "Authentication failed"?
1. Verify `.env` file exists in `Backend/` directory
2. Check that `RAZORPAY_KEY_ID` starts with `rzp_test_` (for test mode)
3. Run: `pip install razorpay==1.3.0` to ensure it's installed
4. Check Django console output for exact error message

### Key Points to Remember
- ✅ Never commit `.env` file to Git (it's already in .gitignore)
- ✅ Use TEST keys during development
- ✅ Switch to LIVE keys only in production
- ✅ Keep your secret key SECRET (don't share in code)

---

## Files Modified
- ✅ `Backend/requirements.txt` - Added razorpay package
- ✅ `Backend/app/views.py` - Added credential validation & better error messages
- ✅ `Backend/.env.example` - Template for environment variables
- 📝 `Backend/.env` - **You need to create this** with your keys

