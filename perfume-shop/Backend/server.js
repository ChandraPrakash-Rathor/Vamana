const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const { initCronJobs } = require("./config/cronJobs");

dotenv.config();

connectDB().then(() => {
  initCronJobs();
});

const app = express();

// Trust proxy — required so rate limiter uses real client IP (not proxy IP)
app.set('trust proxy', 1);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Still call callback(null, false) so CORS headers ARE sent with the error
      // This lets the browser read the error response properly
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Issue 3 fix: limit request body size to prevent large payload attacks
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting strategy:
// - No global limiter on GET routes (a single page load fires 8-10 requests)
// - Strict limiter only on auth & write endpoints to prevent abuse
// - 200 concurrent users × ~10 requests per page = 2000 req/min peak
//   so per-IP limits are generous — real abuse is detected by pattern, not volume

// Auth brute-force limiter — 20 attempts per 15 min per IP (login/register only)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.',
    data: null,
    error: null
  }
});

// Token verification limiter — generous, just prevents abuse of /auth/me
// Normal users hit this once on page load. 200 requests per 15 min = 13/min per IP
const tokenVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
    data: null,
    error: null
  }
});

app.use('/api/admin/login', authLimiter);
app.use('/api/admin/auth/change-password', authLimiter);
app.use('/api/member/auth/check-phone', authLimiter);
app.use('/api/member/auth/register', authLimiter);
app.use('/api/member/auth/me', tokenVerifyLimiter);

// Write endpoint limiter
app.use('/api/member/cart', tokenVerifyLimiter);
app.use('/api/member/create-order', tokenVerifyLimiter);
app.use('/api/member/verify-payment', tokenVerifyLimiter);
app.use('/api/member/coupons/validate', tokenVerifyLimiter);

app.use('/uploads', express.static('uploads'));

app.use('/api/admin', require('./Admin/routes/adminRoutes'));
app.use('/api/member', require('./Member/routes/memberRoutes'));

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    data: null,
    error: null
  });
});

// Global error handler — catches anything that slips through
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  // JSON parse errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body',
      data: null,
      error: null
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    data: null,
    error: null
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
