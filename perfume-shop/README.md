# Vamana Perfume Shop - Full Stack Application

A complete e-commerce solution for perfume retail with member portal, admin panel, and backend API.

## Project Structure

```
perfume-shop/
├── member/          # Customer-facing React application
├── Admin/           # Admin panel for managing the shop
└── Backend/         # Node.js API server
```

## Folders

### 📱 Member (Customer Portal)
The customer-facing web application built with React.js. Customers can browse products, add to cart, checkout, track orders, and manage their accounts.

**Features:**
- Product catalog with search and filters
- Shopping cart
- Secure checkout with multiple payment options
- Order tracking
- User authentication (OTP-based)
- Responsive design
- Sale/discount sections

**Tech Stack:**
- React.js
- React Router
- React Hook Form
- Bootstrap 5
- FontAwesome Icons

[View Member Documentation](./member/README.md)

---

### 🔧 Admin (Admin Panel)
Admin dashboard for managing products, orders, users, and analytics.

**Features (Planned):**
- Dashboard with analytics
- Product management
- Order management
- User management
- Inventory tracking
- Reports

[View Admin Documentation](./Admin/README.md)

---

### 🚀 Backend (API Server)
RESTful API server handling all business logic, authentication, and database operations.

**Features (Planned):**
- User authentication (JWT + OTP)
- Product CRUD operations
- Order processing
- Payment gateway integration
- Email/SMS notifications
- File uploads

[View Backend Documentation](./Backend/README.md)

---

## Getting Started

### Member Application
```bash
cd member
npm install
npm start
```

### Admin Panel
```bash
cd Admin
# Coming soon
```

### Backend Server
```bash
cd Backend
# Coming soon
```

---

## Development Workflow

1. **Member** - Customer-facing features
2. **Backend** - API development
3. **Admin** - Admin panel features

---

## Tech Stack Overview

| Component | Technology |
|-----------|-----------|
| Frontend (Member) | React.js, Bootstrap 5 |
| Frontend (Admin) | React.js, Admin UI Library |
| Backend | Node.js, Express.js |
| Database | MongoDB/PostgreSQL |
| Authentication | JWT, OTP |
| Payment | Razorpay/Stripe |
| Deployment | TBD |

---

## Contributing

This is a private project. For any questions or contributions, please contact the development team.

---

## License

Proprietary - All rights reserved
